const COURSE_DETAILS = {
    'basic-foundation': {
        title: 'Basic Foundation',
        anchor: 'basic-foundation',
        description: 'Foundation learning support for reading, writing, number sense, discipline, and confidence building.',
        mode: 'Offline preferred, online support available',
    },
    'classes-1-3': {
        title: 'Classes 1-3 Fundamentals',
        anchor: 'classes-1-3',
        description: 'Primary fundamentals for basic Maths, language practice, activities, revision, and doubt clearing.',
        mode: 'Offline, online, or hybrid',
    },
    'competitive-4-5': {
        title: 'Classes 4-5 Competitive',
        anchor: 'competitive-4-5',
        description: 'Navodaya, Morarji Desai, and other competitive entrance preparation with practice and test planning.',
        mode: 'Hybrid with weekend test support',
    },
    'classes-6-10-maths': {
        title: 'Classes 6-10 Maths',
        anchor: 'classes-6-10-maths',
        description: 'Chapter-wise Maths concept clarity, problem solving, exam practice, and doubt clearing.',
        mode: 'Evening offline, online, or hybrid',
    },
    'plus-one-plus-two': {
        title: '+1 and +2 Physics & Maths',
        anchor: 'plus-one-plus-two',
        description: 'Higher secondary Physics and Mathematics support with numerical practice and exam planning.',
        mode: 'Evening or weekend hybrid support',
    },
};

const COURSE_TYPES = {
    full: 'Full Course',
    unit: 'Unit Course',
};

const getSelectedCourse = () => {
    const params = new URLSearchParams(window.location.search);
    const courseKey = params.get('course') || '';
    const typeKey = params.get('type') || '';

    return {
        course: COURSE_DETAILS[courseKey],
        type: COURSE_TYPES[typeKey] || 'Course Type To Confirm',
    };
};

const buildWhatsAppUrl = (courseTitle, courseType) => {
    const message = [
        'Hi Sharusuri EdTech,',
        `I have paid for ${courseTitle} - ${courseType}.`,
        'Please confirm my payment.',
        'My enquiry reference ID is: ',
        'Payment screenshot is attached here.',
    ].join(' ');

    return `https://wa.me/918088835686?text=${encodeURIComponent(message)}`;
};

export function initPaymentFlow() {
    const title = document.getElementById('paymentCourseTitle');
    const description = document.getElementById('paymentCourseDescription');
    const type = document.getElementById('paymentCourseType');
    const mode = document.getElementById('paymentCourseMode');
    const note = document.getElementById('paymentCourseNote');
    const detailsLink = document.getElementById('paymentCourseDetailsLink');
    const whatsAppLink = document.getElementById('paymentWhatsappLink');

    if (!title || !description || !type || !mode || !note || !detailsLink || !whatsAppLink) {
        return;
    }

    const selected = getSelectedCourse();
    const course = selected.course || {
        title: 'Selected Course',
        anchor: 'explore-tracks',
        description: 'Choose a course from the course details page before payment.',
        mode: 'Offline, online, or hybrid after discussion',
    };

    title.textContent = course.title;
    description.textContent = course.description;
    type.textContent = selected.type;
    mode.textContent = course.mode;
    note.textContent = 'Pay only after fee amount is confirmed. Then share payment screenshot and enquiry reference ID on WhatsApp.';
    detailsLink.href = `course-details.html#${course.anchor}`;
    whatsAppLink.href = buildWhatsAppUrl(course.title, selected.type);
}
