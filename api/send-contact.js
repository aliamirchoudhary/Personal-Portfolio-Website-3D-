import nodemailer from 'nodemailer'
import 'dotenv/config'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  const { name, email, message } = req.body
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({ success: false, message: 'Name, email, and message are required.' })
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  })

  try {
    const escHtml = (str) =>
      String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')

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
    `

    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.GMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `[Portfolio] New Contact — ${name}`,
      html: `<!DOCTYPE html><html><head><style>${emailCSS}</style></head><body>
        <div class="wrapper">
          <div class="header"><h1>New Contact Message</h1></div>
          <div class="body">
            <div class="field"><div class="label">From</div><div class="value">${escHtml(name)}</div></div>
            <div class="field"><div class="label">Email</div><div class="value">${escHtml(email)}</div></div>
            <div class="field"><div class="label">Message</div><div class="value">${escHtml(message)}</div></div>
          </div>
        </div></body></html>`,
    })

    await transporter.sendMail({
      from: `"Muhammad Ali Aamir" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `I received your message!`,
      html: `<!DOCTYPE html><html><head><style>${emailCSS}</style></head><body>
        <div class="wrapper">
          <div class="header"><h1>Thanks, ${escHtml(name)}!</h1></div>
          <div class="body">
            <p>Hi ${escHtml(name)},</p>
            <p>Thanks for reaching out! I've received your message and will reply within <strong>24 hours</strong>.</p>
          </div>
        </div></body></html>`,
    })

    return res.status(200).json({ success: true, message: "Message sent! I'll be in touch within 24 hours." })
  } catch (err) {
    console.error('Email error:', err.message)
    return res.status(500).json({ success: false, message: 'Server error — could not send email.' })
  }
}
