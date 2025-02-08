# job-flow

Job Application tracker with URL smart storage across LinkedIn and Export CSV option.

# JobFlow

A Chrome extension that automatically tracks your job applications across LinkedIn and other job sites.

## Features

- Automatically captures job applications when you click "Apply" or "Easy Apply"
- Works with LinkedIn and external job sites
- Tracks job title, company, application date, and application URL
- Export your application history to CSV
- Clean, simple interface to review your applications

## Installation

1. Clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension directory

## Usage

1. Browse jobs on LinkedIn or other job sites
2. Click any "Apply" or "Easy Apply" button
3. JobFlow will automatically track the application
4. Click the extension icon to view your application history
5. Export to CSV or click on entries to revisit application pages

## Permissions

- `storage`: Store job application data
- `activeTab`: Read job details from current page
- `scripting`: Monitor apply button clicks
- `tabs`: Track external application URLs

## Development

- `background.js`: Handles application tracking and storage
- `contentScript.js`: Monitors apply buttons and scrapes job data
- `popup.html/js`: Manages the user interface

## License

MIT
