# Gmail SMTP Migration Guide — Replace Formspree with Nodemailer

Extracted from the WebCraft project. Use this to swap out Formspree in your new project.

---

## 1. Install Dependencies

```json
// package.json
"dependencies": {
  "nodemailer": "^6.9.7",
  "dotenv": "^16.3.1"
}
```

```bash
npm install nodemailer dotenv
```

---

## 2. Environment Variables (`.env`)

Copy these into your `.env` file:

```env
# ── Gmail SMTP ─────────────────────────────────
GMAIL_USER=aliamirchoudhary@gmail.com
GMAIL_APP_PASSWORD=ldwv ryyr zhfk ukdn

# ── Admin notification recipient ────────────────
ADMIN_EMAIL=aliamirchoudhary@gmail.com

# ── Abstract API – email validation (free tier) ─
ABSTRACT_API_KEY=a91f5650d4474916ad9981dfc0c3c208

# ── Frontend origin (CORS) ──────────────────────
FRONTEND_ORIGIN=http://localhost:3000
```

> **Important:** Also create a `.env.example` with placeholder values for Git.

---

## 3. Nodemailer Transporter (Gmail SMTP)

Create the transporter anywhere you need to send email:

```js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,  // SSL on port 465
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});
```

### Startup verification (optional but recommended)

```js
transporter.verify((err, success) => {
  if (err) {
    console.error('EMAIL TRANSPORTER FAILED:', err.message);
  } else {
    console.log('Email transporter ready — Gmail SMTP connected.');
  }
});
```

---

## 4. Sending Emails

### 4a. HTML Email CSS Template

```js
const emailCSS = `
  body{margin:0;padding:0;background:#f4f4f4;font-family:'Segoe UI',Arial,sans-serif}
  .wrapper{max-width:600px;margin:32px auto;background:#1e1e1e;border-radius:12px;overflow:hidden}
  .header{background:#1e1e1e;padding:32px 36px 24px;border-bottom:1px solid #2d2d2d}
  .header h1{margin:0;font-size:22px;color:#99FFCC;letter-spacing:-0.02em}
  .header p{margin:6px 0 0;font-size:13px;color:#888}
  .body{padding:28px 36px}
  .body p{margin:0 0 14px;font-size:15px;color:#cccccc;line-height:1.65}
  .field{margin-bottom:20px}
  .field .label{font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#99FFCC;margin-bottom:4px}
  .field .value{font-size:14px;color:#e8e8e8;background:#252525;padding:10px 14px;border-radius:6px;border-left:3px solid #99FFCC;white-space:pre-wrap;word-break:break-word}
  .footer{background:#181818;padding:20px 36px;text-align:center}
  .footer p{margin:0;font-size:12px;color:#555}
  .footer a{color:#99FFCC;text-decoration:none}
  .btn{display:inline-block;margin:16px 0 0;padding:12px 28px;background:#99FFCC;color:#0f1a14;font-size:14px;font-weight:700;border-radius:8px;text-decoration:none}
`;
```

### 4b. HTML Escape (XSS Prevention)

```js
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
```

### 4c. Send Mail Example

**Admin notification (contact form):**

```js
await transporter.sendMail({
  from: `"YourSite Forms" <${process.env.GMAIL_USER}>`,
  to:   process.env.ADMIN_EMAIL,
  subject: `[YourSite] New Contact: ${subject} — ${name}`,
  html: `<!DOCTYPE html><html><head><style>${emailCSS}</style></head><body>
    <div class="wrapper">
      <div class="header"><h1>New Contact Message</h1></div>
      <div class="body">
        <div class="field"><div class="label">From</div><div class="value">${escHtml(name)}</div></div>
        <div class="field"><div class="label">Email</div><div class="value">${escHtml(email)}</div></div>
        <div class="field"><div class="label">Message</div><div class="value">${escHtml(message)}</div></div>
      </div>
    </div></body></html>`,
});
```

**Customer confirmation:**

```js
await transporter.sendMail({
  from: `"YourSite" <${process.env.GMAIL_USER}>`,
  to:   email,  // customer's email
  subject: `We received your message — YourSite`,
  html: `<!DOCTYPE html><html><head><style>${emailCSS}</style></head><body>
    <div class="wrapper">
      <div class="header"><h1>Thanks, ${escHtml(name)}!</h1></div>
      <div class="body">
        <p>Hi ${escHtml(name)},</p>
        <p>Thanks for reaching out! I'll reply within <strong>24 hours</strong>.</p>
      </div>
    </div></body></html>`,
});
```

---

## 5. Replacing Formspree

### Before (Formspree):

```html
<form action="https://formspree.io/f/xxxxx" method="POST">
  <input name="name" required>
  <input type="email" name="email" required>
  <textarea name="message" required></textarea>
  <button type="submit">Send</button>
</form>
```

### After (Your own backend):

**Frontend (JavaScript):**

```js
fetch('/send-contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, email, subject, message }),
})
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      alert("Message sent! I'll be in touch within 24 hours.");
    } else {
      alert(data.message || 'Something went wrong.');
    }
  })
  .catch(() => alert('Network error.'));
```

**Backend route (Express):**

```js
app.post('/send-contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
    }

    // Send admin notification
    await transporter.sendMail({
      from: `"YourSite Forms" <${process.env.GMAIL_USER}>`,
      to:   process.env.ADMIN_EMAIL,
      subject: `[YourSite] New Contact: ${subject || 'General'} — ${name}`,
      html: `<!-- your HTML -->`,
    });

    // Send customer confirmation
    await transporter.sendMail({
      from: `"YourSite" <${process.env.GMAIL_USER}>`,
      to:   email,
      subject: `We received your message — YourSite`,
      html: `<!-- your HTML -->`,
    });

    return res.status(200).json({ success: true, message: "Message sent! I'll be in touch within 24 hours." });
  } catch (err) {
    console.error('Email error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error — could not send email.' });
  }
});
```

---

## 6. Vercel Deployment (if using serverless functions)

**`vercel.json`:**
```json
{
  "rewrites": [
    { "source": "/send-contact", "destination": "/api/send-contact" },
    { "source": "/send-order", "destination": "/api/send-order" }
  ]
}
```

**`api/send-contact.js`** (see full reference in this project's `api/send-contact.js`) — creates its own transporter inline and exports a `handler(req, res)` function.

> **Note:** Serverless functions must create the transporter inside the handler (not at module scope) or handle cold starts. The WebCraft project creates it inside the handler for each Vercel function.

---

## 7. Gmail App Password Setup

1. Go to https://myaccount.google.com/apppasswords
2. Make sure **2-Step Verification** is ON for your Google account
3. Generate an **App Password** for "Mail"
4. Use that 16-character password (with spaces) as `GMAIL_APP_PASSWORD`
5. Your regular Gmail password will **not** work — you must use an App Password

---

## Can You Reuse the Same API Keys?

**Yes — all of them.** Since you're using the same Gmail account (`aliamirchoudhary@gmail.com`):

| Variable | Reusable? | Why |
|---|---|---|
| `GMAIL_USER` | ✅ Yes | Same Gmail address |
| `GMAIL_APP_PASSWORD` | ✅ Yes | Tied to the Gmail account, not the project |
| `ADMIN_EMAIL` | ✅ Yes | Same inbox |
| `ABSTRACT_API_KEY` | ✅ Yes | Tied to your Abstract API account (100 free validations/month) |

Just copy the `.env` values directly into your new project. No need to generate new credentials.
