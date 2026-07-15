const CONFIG = {
  SPREADSHEET_ID: '1Wiw7BN0rSlnZz2qDWS-SfDGpRz3rEKUigthRuDJ5ddY',
  SHEET_NAME: 'Admission Enquiries',
  PDF_FOLDER_NAME: 'Sharusuri EdTech Enquiry PDFs',
  FROM_NAME: 'Sharusuri EdTech',
};

const REQUIRED_HEADERS = [
  'Timestamp',
  'Reference ID',
  'Source Page',
  'Name',
  'Guardian Name',
  'Email',
  'Phone',
  'Student Class',
  'Program',
  'Preferred Mode',
  'Message',
  'State',
  'District',
  'Taluk',
  'Hobli',
  'Village',
  'PDF URL',
];

function doPost(event) {
  try {
    const payload = parsePayload_(event);
    const timestamp = new Date();
    const sheet = getSheet_();
    const headers = ensureHeaders_(sheet, payload);

    if (payload.action === 'verifyStudentAccess') {
      return jsonResponse_(verifyStudentAccess_(sheet, headers, payload));
    }

    const phone = normalizeMobile_(payload.phone || payload.mobile || payload.Phone || payload.Mobile);
    if (phone && findExistingPhoneRow_(sheet, headers, phone) > 1) {
      throw new Error('This mobile number is already registered. Please use the existing reference ID or contact support.');
    }

    const referenceId = createReferenceId_(phone, timestamp);
    const pdfFile = createReceiptPdf_(payload, referenceId, timestamp);

    payload.timestamp = timestamp.toISOString();
    payload.referenceId = referenceId;
    payload.pdfUrl = pdfFile.getUrl();

    appendResponse_(sheet, headers, payload, timestamp, referenceId, pdfFile.getUrl());
    sendReceiptEmail_(payload, referenceId, pdfFile);

    return jsonResponse_({
      ok: true,
      referenceId,
      message: 'Admission enquiry submitted successfully.',
      pdfUrl: pdfFile.getUrl(),
    });
  } catch (error) {
    return jsonResponse_({
      ok: false,
      message: error.message || 'Unable to submit admission enquiry.',
    });
  }
}

function doGet() {
  return jsonResponse_({
    ok: true,
    message: 'Sharusuri EdTech enquiry endpoint is running.',
  });
}

function parsePayload_(event) {
  if (!event || !event.postData) return {};

  const contentType = event.postData.type || '';
  const contents = event.postData.contents || '';
  if (contentType.includes('application/json') || contents.trim().startsWith('{')) {
    return JSON.parse(event.postData.contents || '{}');
  }

  return Object.assign({}, event.parameter || {});
}

function getSheet_() {
  const spreadsheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  return spreadsheet.getSheetByName(CONFIG.SHEET_NAME) || spreadsheet.insertSheet(CONFIG.SHEET_NAME);
}

function ensureHeaders_(sheet, payload) {
  const requiredHeaderKeys = REQUIRED_HEADERS.map(normalizeHeaderKey_);
  const dynamicHeaders = Object.keys(payload)
    .map(toTitle_)
    .filter((header) => !requiredHeaderKeys.includes(normalizeHeaderKey_(header)));
  const desiredHeaders = REQUIRED_HEADERS.concat(dynamicHeaders);
  const lastColumn = Math.max(sheet.getLastColumn(), desiredHeaders.length);
  const currentHeaders = sheet.getRange(1, 1, 1, lastColumn).getValues()[0].filter(Boolean);
  const headers = currentHeaders.length ? currentHeaders.slice() : [];

  desiredHeaders.forEach((header) => {
    if (!headers.includes(header)) headers.push(header);
  });

  if (headers.length) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
  }

  return headers;
}

function appendResponse_(sheet, headers, payload, timestamp, referenceId, pdfUrl) {
  const row = headers.map((header) => {
    if (header === 'Timestamp') return timestamp;
    if (header === 'Reference ID') return referenceId;
    if (header === 'PDF URL') return pdfUrl;
    return payload[toCamel_(header)] || payload[header] || '';
  });

  sheet.appendRow(row);
}

function createReceiptPdf_(payload, referenceId, timestamp) {
  const folder = getOrCreateFolder_(CONFIG.PDF_FOLDER_NAME);
  const html = HtmlService.createHtmlOutput(buildReceiptHtml_(payload, referenceId, timestamp));
  const blob = html
    .getBlob()
    .getAs(MimeType.PDF)
    .setName(`Sharusuri-Enquiry-${referenceId}.pdf`);

  return folder.createFile(blob);
}

function sendReceiptEmail_(payload, referenceId, pdfFile) {
  const email = payload.email || payload.Email;
  if (!email) return;

  const name = payload.name || payload.Name || 'Student';
  const program = payload.program || payload.Program || 'selected course';
  const subject = `Sharusuri EdTech enquiry received - ${referenceId}`;
  const body = [
    `Dear ${name},`,
    '',
    `Thank you for your interest in ${program}.`,
    `Your enquiry reference ID is ${referenceId}.`,
    '',
    'Our team will contact you with course details, batch timing, fee guidance, and next steps.',
    '',
    'Regards,',
    CONFIG.FROM_NAME,
  ].join('\n');

  MailApp.sendEmail({
    to: email,
    subject,
    body,
    name: CONFIG.FROM_NAME,
    attachments: [pdfFile.getBlob()],
  });
}

function buildReceiptHtml_(payload, referenceId, timestamp) {
  const rows = Object.keys(payload)
    .filter((key) => payload[key])
    .map((key) => `<tr><th>${escapeHtml_(toTitle_(key))}</th><td>${escapeHtml_(payload[key])}</td></tr>`)
    .join('');

  return `
    <html>
      <body style="font-family: Arial, sans-serif; color: #10201c;">
        <h1>Sharusuri EdTech Admission Enquiry</h1>
        <p><strong>Reference ID:</strong> ${escapeHtml_(referenceId)}</p>
        <p><strong>Submitted:</strong> ${escapeHtml_(timestamp.toLocaleString())}</p>
        <table style="width: 100%; border-collapse: collapse;" border="1" cellpadding="8">
          ${rows}
        </table>
        <p>Our team will contact you with course, timing, fee, and admission guidance.</p>
      </body>
    </html>
  `;
}

function getOrCreateFolder_(folderName) {
  const folders = DriveApp.getFoldersByName(folderName);
  return folders.hasNext() ? folders.next() : DriveApp.createFolder(folderName);
}

function createReferenceId_(phone, timestamp) {
  const dateText = Utilities.formatDate(timestamp || new Date(), Session.getScriptTimeZone(), 'dd-MM-yyyy');
  const mobile = normalizeMobile_(phone) || 'mobile';
  return `${dateText}-${mobile}`;
}

function verifyStudentAccess_(sheet, headers, payload) {
  const phone = normalizeMobile_(payload.mobile || payload.phone || payload.Mobile || payload.Phone);
  const referenceId = String(payload.referenceId || payload.reference || payload.Reference || payload['Reference ID'] || '').trim();

  if (!phone || !referenceId) {
    return {
      ok: false,
      message: 'Registered mobile number and enquiry reference ID are required.',
    };
  }

  const phoneIndex = headers.indexOf('Phone');
  const referenceIndex = headers.indexOf('Reference ID');
  if (phoneIndex === -1 || referenceIndex === -1 || sheet.getLastRow() < 2) {
    return {
      ok: false,
      message: 'No registered student records found.',
    };
  }

  const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, headers.length).getValues();
  const match = rows.find((row) => {
    const rowPhone = normalizeMobile_(row[phoneIndex]);
    const rowReference = String(row[referenceIndex] || '').trim();
    return rowPhone === phone && rowReference === referenceId;
  });

  return match
    ? {
        ok: true,
        message: 'Student access verified.',
        redirectUrl: 'student-dashboard.html',
      }
    : {
        ok: false,
        message: 'Mobile number and reference ID do not match. Please check the email PDF receipt or contact WhatsApp support.',
      };
}

function findExistingPhoneRow_(sheet, headers, phone) {
  const phoneIndex = headers.indexOf('Phone');
  if (phoneIndex === -1 || sheet.getLastRow() < 2) return -1;

  const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, headers.length).getValues();
  const normalizedPhone = normalizeMobile_(phone);
  const matchIndex = rows.findIndex((row) => normalizeMobile_(row[phoneIndex]) === normalizedPhone);
  return matchIndex === -1 ? -1 : matchIndex + 2;
}

function normalizeMobile_(value) {
  const digits = String(value || '').replace(/\D/g, '');
  return digits.length === 12 && digits.startsWith('91') ? digits.slice(2) : digits;
}

function jsonResponse_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function toTitle_(value) {
  return String(value)
    .replace(/([A-Z])/g, ' $1')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function normalizeHeaderKey_(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]/g, '');
}

function toCamel_(value) {
  const words = String(value).toLowerCase().split(/\s+/);
  return words[0] + words.slice(1).map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join('');
}

function escapeHtml_(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
