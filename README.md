# Calm Nerve — Landing Page Prototype

This folder contains a clean, editable landing page prototype for Calm Nerve (early access). Use it as a starting point for your page builder (Shopify, ClickFunnels, Leadpages), or host the static HTML on Netlify/Vercel.

Files added:
- `index.html` — Landing page with hero, features, ingredients, FAQ, signup form (posts to `thankyou.html` placeholder).
- `styles.css` — Simple responsive styles.
- `thankyou.html` — Thank-you/confirmation placeholder after signup.
- `email-welcome.txt` — Draft welcome email and optional beta tester variant.

How to preview locally:
1. Open `index.html` in your browser (double-click the file).

Or serve with a simple static server (PowerShell example using Python if installed):

```powershell
python -m http.server 8000; Start-Process http://localhost:8000/index.html
```

Before public launch, update the following:
- `assets/logo-placeholder.png` and `assets/bottle-mockup.png`  add your real logo and product images.
- Update brand colors in `styles.css` (`--accent` variable).
- Add verified testimonial content where appropriate.
- Configure the signup form action to point to your email provider or page-builder integration.

Integrating with an email provider (high-level steps):
- Klaviyo: create a Signup Form or API list and replace the form action with Klaviyo's form endpoint or use their embedded form code. Map fields to `email`, `firstName`, `beta`.
- MailerLite: create a form and copy/paste the HTML form code or use their API to add subscribers.
- Zapier / Make: post the form to a small serverless endpoint (Netlify Functions/Azure Functions) which forwards to your email provider.

Beta program and follow-ups:
- Capture a `beta` checkbox on your signup form and tag subscribers who checked it.
- Prepare a short onboarding email sequence (welcome, what to expect, beta instructions).

Next recommended steps I can help with:
- Create a Klaviyo/MailerLite-ready form snippet.
- Design a bottle mockup or export transparent PNG for the product image.
- Draft an automated 3-email welcome sequence for early access + beta testers.

Deploy to Netlify ✅
- I added `netlify.toml` and `_redirects` for an easy Netlify deploy (this site publishes from the repo root).
- Quick deploy options:
  1. Push this repo to GitHub, then in Netlify select **New site from Git**, pick the repo, set **build command** blank, and **publish directory** to `.`.
  2. Or drag-and-drop the project folder onto Netlify's Sites page for an instant deploy.

Netlify Forms + MailerLite forwarding (optional) 🔁
- The site now includes a Netlify Form named `early-access` (see `index.html`) that posts to `/thankyou.html` on success.
- I added a Netlify Function at `netlify/functions/forward-mailerlite.js` which can forward submissions to MailerLite when configured.
- To enable forwarding, add these environment variables in your Netlify site settings (Site → Settings → Build & deploy → Environment):
  - `NETLIFY_MAILERLITE_API_KEY` — your MailerLite API key (required to forward)
  - `MAILERLITE_GROUP_ID` — optional MailerLite group ID to add the subscriber to
- How it works:
  - On the client, the form uses `navigator.sendBeacon` (or a best-effort fetch) to POST to the function endpoint `/.netlify/functions/forward-mailerlite` when the user submits the form.
  - The form still performs a native HTML submit so **Netlify Forms** captures the entry and the browser redirects to `thankyou.html`.
  - If the API key is not present, the function will safely log and return success (no keys are committed to the repo).

Local testing 💻
- Install the Netlify CLI: `npm install -g netlify-cli`.
- Run locally: `netlify dev` (it will serve functions and the site at `http://localhost:8888`).
- Set local env vars with `netlify env:set NETLIFY_MAILERLITE_API_KEY "<key>"` etc., or create a `.env` file for `netlify dev`.

Security note ⚠️
- Never commit your API keys to the repository. Use Netlify environment variables or a secret manager.

If you'd like, I can also:
- Convert the form to use a different provider (Klaviyo, MailerLite embedded), or
- Set up Netlify outgoing form webhooks to invoke the function from Netlify's side instead of the client (optional).

If you'd like, I can now:
- Generate the Klaviyo form HTML (tell me which provider), or
- Draft the 3-email welcome/engagement sequence, or
- Replace placeholder images with a base64 placeholder for quick testing.
