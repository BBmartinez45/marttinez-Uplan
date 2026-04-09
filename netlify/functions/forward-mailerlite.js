// Netlify Function: forward-mailerlite
// Receives POSTed form data (JSON or URL-encoded) and forwards subscriber to MailerLite.
// Configure the following environment variables in Netlify site settings:
// - NETLIFY_MAILERLITE_API_KEY (required)
// - MAILERLITE_GROUP_ID (optional)

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const headers = event.headers || {};
  const contentType = (headers['content-type'] || headers['Content-Type'] || '').toLowerCase();
  let data = {};

  try {
    if (contentType.includes('application/json')) {
      data = JSON.parse(event.body || '{}');
    } else {
      // handle form-encoded bodies (beacon may send JSON or text)
      const params = new URLSearchParams(event.body || '');
      for (const [k, v] of params.entries()) data[k] = v;
    }
  } catch (e) {
    console.error('Failed to parse body', e);
    return { statusCode: 400, body: 'Invalid request body' };
  }

  const apiKey = process.env.NETLIFY_MAILERLITE_API_KEY;
  const groupId = process.env.MAILERLITE_GROUP_ID;

  if (!apiKey) {
    console.log('NETLIFY_MAILERLITE_API_KEY not configured; skipping forward to MailerLite.');
    // Still return success so that form submission flow isn't blocked
    return { statusCode: 200, body: JSON.stringify({ message: 'No API key configured - submission accepted locally.' }) };
  }

  const email = data.email || data['fields[email]'];
  const name = data.name || data['fields[name]'] || '';

  if (!email) {
    return { statusCode: 400, body: 'Missing email field' };
  }

  const apiUrl = groupId
    ? `https://api.mailerlite.com/api/v2/groups/${groupId}/subscribers`
    : 'https://api.mailerlite.com/api/v2/subscribers';

  try {
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-MailerLite-ApiKey': apiKey,
        'Accept': 'application/json'
      },
      body: JSON.stringify({ email: email, name: name })
    });

    const text = await res.text();
    // forward the response code and body from MailerLite (helpful for debugging)
    return { statusCode: res.status, body: text };
  } catch (err) {
    console.error('Error forwarding to MailerLite:', err);
    return { statusCode: 500, body: 'Error forwarding to MailerLite' };
  }
};