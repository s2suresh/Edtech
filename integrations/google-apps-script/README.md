# Google Apps Script Enquiry Integration

This integration stores website admission enquiries in Google Sheets, creates a PDF receipt in Google Drive, and emails the PDF to the submitted email address.

## Current Google assets

- Response sheet: `https://docs.google.com/spreadsheets/d/1Wiw7BN0rSlnZz2qDWS-SfDGpRz3rEKUigthRuDJ5ddY/edit?usp=sharing`
- Apps Script project: `https://script.google.com/u/0/home/projects/1nRlbWFEseKNRfQnQHboTDhwzV43hW5DJr9rbVM979OLo6zTeliIEW2N9/edit`

## Setup Steps

1. Open the Apps Script project.
2. Replace `Code.gs` in Apps Script with the contents of `integrations/google-apps-script/Code.gs`.
3. Click **Save**.
4. Click **Deploy** -> **New deployment**.
5. Select type: **Web app**.
6. Set **Execute as**: `Me`.
7. Set **Who has access**: `Anyone`.
8. Click **Deploy**.
9. Authorize Google Sheets, Drive, and Mail permissions.
10. Copy the generated Web App URL ending in `/exec`.

## Activate Website Submission

Paste the `/exec` URL into:

```js
// js/modules/enquiryConfig.js
export const ENQUIRY_ENDPOINT = 'PASTE_WEB_APP_EXEC_URL_HERE';
```

After that, website form submissions will be sent to Apps Script.

## How It Works

- The website form sends all fields dynamically.
- Reference IDs use `DD-MM-YYYY-MobileNumber`, for example `14-07-2026-8088835686`.
- Apps Script rejects a new enquiry when the same mobile number already exists in the response sheet.
- Student access verification can match `mobile` plus `referenceId` from the response sheet before opening a private dashboard in a future backend flow.
- Apps Script adds new Sheet columns if future form fields are added.
- Apps Script creates a PDF receipt in Google Drive folder `Sharusuri EdTech Enquiry PDFs`.
- Apps Script emails the PDF to the submitted email address with payment guidance and a WhatsApp confirmation link.
- Fully automatic WhatsApp replies require WhatsApp Business Platform or an approved provider later; the current free flow uses click-to-WhatsApp links.

## Future Enhancements

- Add final fee structure columns.
- Add selected course fee and installment details to the PDF.
- Add parent/student separate email templates.
- Add WhatsApp notification workflow through a verified provider.
- Generate secure per-user QR codes for student profile, parent report, teacher, mentor, employee, and admin dashboards after a real backend is added.
