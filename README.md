# OMR Evaluation Frontend

This is the frontend for the Automated OMR Evaluation & Scoring System. It allows evaluators to upload OMR sheet images, view results, and export data. Connects to the backend API for real OMR processing.

## Features
- Upload OMR sheet images (multiple at once)
- Select exam version and enter student ID
- View per-subject and total scores
- Export results as CSV, Excel, or PDF

## Setup
1. Open `index.html` in your browser for local testing.
2. For production, host on GitHub Pages, Vercel, or Netlify.
3. Update the API endpoint in `main.js` to point to your backend.

## Folder Structure
```
.
├── index.html
├── style.css
├── main.js
└── README.md
```

## Connect to Backend
- The frontend expects a backend API for OMR processing (see backend repo).
- Update the API URL in `main.js` as needed.
