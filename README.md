# Pay site

Page with an amount field and an Apple Pay-style animated payment sheet
(sheet slides up, spinner, green ring and check mark).

IMPORTANT: out of the box this is a DEMO. Nothing is charged.
Real payments need a provider connected in `provider.js`.

## Files
- `server.js`      – web server, re-checks the amount ($0.10 - $1000)
- `provider.js`    – the place to connect a payment provider
- `public/index.html` – the page and the animation

## Run locally
1. Install Node.js 18+ (https://nodejs.org)
2. In this folder: `npm start`
3. Open http://localhost:3000

## Deploy to Railway
1. Create a private GitHub repo and upload the contents of this folder.
2. railway.app -> New Project -> Deploy from GitHub repo.
3. Settings -> Networking -> Generate Domain.
4. Open the domain. The animation works right away (demo mode).

## Connect a real provider
1. Register with a provider and get API keys.
2. Add keys in Railway -> Variables (never in HTML or Git).
3. In `provider.js` write the call that creates a payment/invoice and
   return `{ url }` (redirect to the provider's page) or `{}` (paid).
4. Set the variable `LIVE=1` so the demo can no longer succeed by accident.
5. Test with the provider's test mode, then switch to live keys.
