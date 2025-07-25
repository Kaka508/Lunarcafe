# Lunarcafe

Lunar lakes cafe push notification demo

## Features

- Simple username login (stored in localStorage)
- Add up to 3 notifications per day, each with its own countdown to announcement
- Notifications and countdowns persist in localStorage
- When countdown reaches zero, a browser push notification is shown
- Basic service worker for push support
- Ready to deploy with Create React App

## Usage

- Run with `npm start`
- Open in a browser, log in, and add notifications with a future time today

## Notes

- For push notifications to work, you must run on `localhost` or HTTPS and allow notifications in your browser.
- Demo is local-only unless you integrate a backend.