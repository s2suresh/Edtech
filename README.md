# Sharusuri EdTech

Sharusuri EdTech is a static GitHub Pages starter website for an education project focused on rural and semi-urban learners.

Live site: https://s2suresh.github.io/Edtech/

## Current Website Sections

- Hero section with clear mission and calls to action.
- About section explaining the rural education purpose.
- Program cards with search and category filtering.
- Admissions journey for students and parents.
- Scalability roadmap from village pilot to wider rollout.
- Latest news placeholders for events and announcements.
- FAQ section for common parent/student questions.
- Contact and admission enquiry form placeholder.
- Responsive navigation, mobile menu, and dark/light mode.
- SEO metadata, Open Graph tags, and Schema.org organization markup.
- Standalone pages for About, Programs, Admissions, Roadmap, News, and Contact.

## Folder Structure

```text
Edtech-main/
├── assets/
│   └── icons/              # Logo, favicon, UI icons, and future SVG assets
├── css/
│   ├── base/               # Design tokens, reset, and global defaults
│   ├── components/         # Reusable UI pieces like buttons, cards, forms
│   ├── layout/             # Page layout, containers, navigation
│   ├── sections/           # Section-specific styles like hero, programs, footer
│   ├── utilities/          # Responsive and helper CSS
│   └── style.css           # Main CSS import file
├── js/
│   ├── modules/            # Feature logic split by behavior
│   └── script.js           # Main JavaScript initializer
├── folder/                 # Planning notes and source ideas
├── index.html
├── about.html
├── programs.html
├── admissions.html
├── roadmap.html
├── news.html
├── contact.html
├── manifest.webmanifest
├── robots.txt
└── sitemap.xml
```

## How To Add Future Features

- Add new icons or logo files inside `assets/icons/`.
- Add a new reusable design piece in `css/components/`, then import it from `css/style.css`.
- Add page-section styling in `css/sections/`, then import it from `css/style.css`.
- Add feature behavior in `js/modules/`, export an init function, then call it from `js/script.js`.
- Keep each HTML page focused on content and structure; keep styling in CSS and behavior in JS modules.

## Information To Replace Later

- Real email address, phone number, WhatsApp number, and location.
- Final program names, syllabus, class levels, fees, and batch timings.
- Teacher profiles, branch details, gallery images, and achievements.
- Admission dates, event calendar, latest notices, and downloadable PDFs.
- Real form integration such as Google Forms, Formspree, PHP, Node.js, or a database-backed API.
- Student, parent, teacher, and admin login links when a backend is built.

## Recommended Next Steps

1. Confirm the final brand name, logo, colors, and contact information.
2. Replace placeholder program content with the real academic offering.
3. Add original photos or optimized images for trust and local relevance.
4. Connect the enquiry form to a real submission system.
5. Add separate pages for About, Admissions, Courses, Calendar, News, Gallery, Downloads, and Login when content grows.
6. Add analytics only after choosing the privacy and tracking approach.

## Suggested Future Stack

This version is intentionally simple: HTML, CSS, and JavaScript. When the project needs real accounts, dashboards, payments, content management, or admissions tracking, consider:

- Frontend: React, Next.js, or Astro.
- Styling: Tailwind CSS or a component design system.
- Backend: Node.js, PHP, or Firebase/Supabase.
- Database: PostgreSQL, MySQL, or Firestore.
- Deployment: GitHub Pages for static pages, Vercel/Netlify for apps, or a VPS for full backend control.
