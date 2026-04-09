MailerLite serverless integration (Netlify function example)

Overview

This example shows a minimal Netlify Function (Node) that accepts POST requests from your landing page form, creates a subscriber in MailerLite, and optionally adds them to a group (for example, a "beta" group). Keep your MailerLite API key secret by storing it in an environment variable.

Steps

1) Create a Netlify function file at `./netlify/functions/subscribe.js` (or `subscribe.ts` if using TypeScript).
2) Set environment variables in Netlify:
   - MAILERLITE_API_KEY = <your_api_key>
   - MAILERLITE_GROUP_ID = <optional_group_id> (if you want to auto-add subscribers to a group)
3) Point your form's JS fetch to the function path. For Netlify, the function is available at `/.netlify/functions/subscribe`.

Example `subscribe.js` (Node 16+):

```js
// netlify/functions/subscribe.js
const fetch = require('node-fetch'); // node 18+ has global fetch — remove if available

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let data;
  try {
    data = JSON.parse(event.body);
  } catch (err) {
    return { statusCode: 400, body: 'Invalid JSON' };
  }

  const { name, email, beta } = data;
  if (!email) return { statusCode: 400, body: 'Email required' };

  const apiKey = process.env.MAILERLITE_API_KEY;
  if (!apiKey) return { statusCode: 500, body: 'Missing MailerLite API key' };

  try {
    // Create subscriber (MailerLite v2 API example)
    const createRes = await fetch('https://api.mailerlite.com/api/v2/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-MailerLite-ApiKey': apiKey
      },
      body: JSON.stringify({
        email: email,
        name: name || undefined,
        fields: { beta: beta === 'yes' ? 'yes' : 'no' }
      })
    });

    const created = await createRes.json();

    // Optionally add to a group (useful to tag beta testers)
    const groupId = process.env.MAILERLITE_GROUP_ID; // optional
    if (groupId) {
      // Add the subscriber to the group by email
      await fetch(`https://api.mailerlite.com/api/v2/groups/${groupId}/subscribers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-MailerLite-ApiKey': apiKey
        },
        body: JSON.stringify({ email })
      });
    }

    return { statusCode: 200, body: JSON.stringify({ success: true, created }) };
  } catch (err) {
    console.error('MailerLite error', err);
    return { statusCode: 500, body: 'Internal error' };
  }
};
```

Notes & security

- Do NOT place your MailerLite API key in client-side code. Always use a backend or serverless function to talk to the MailerLite API.
- MailerLite API versions and endpoints may change — confirm the API path for your account in MailerLite docs.
- To tag or segment subscribers you can use groups (recommended) or custom fields. If using groups, set `MAILERLITE_GROUP_ID` in your environment variables.

Testing locally

- Netlify CLI: install `netlify-cli` and run `netlify dev` to serve functions locally.
- Use your page with the Option B script from `mailerlite-form.html`. The fetch path should match the local dev server's function path.

Alternative providers

- If you prefer Vercel, AWS Lambda, or Azure Functions, the same function code can be adapted; set env vars in the host and update the function path.

If you want, I can:
- Add the `netlify/functions/subscribe.js` file directly into this workspace and update `index.html` to use the Option B form + script.
- Or, paste your MailerLite embedded form code here and I will insert it into `index.html` for you.
