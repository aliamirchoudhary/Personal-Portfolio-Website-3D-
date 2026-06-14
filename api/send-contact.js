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
      body{margin:0;padding:0;background:#0a0a0f;font-family:'Segoe UI',Arial,sans-serif}
      .wrapper{max-width:560px;margin:32px auto;background:#12121a;border-radius:16px;overflow:hidden;border:1px solid #1e1e2a}
      .header{background:linear-gradient(135deg,#0a0a0f 0%,#1a0a3a 100%);padding:36px 36px 28px;border-bottom:1px solid #2d1d5e;text-align:center}
      .header .icon{display:inline-block;width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,#7c3aed,#a78bfa);margin-bottom:12px;line-height:48px;font-size:22px;color:#fff;box-shadow:0 0 20px rgba(124,58,237,.4)}
      .header h1{margin:0;font-size:24px;color:#a78bfa;letter-spacing:-.02em;font-weight:700}
      .header p{margin:6px 0 0;font-size:13px;color:#64748b}
      .body{padding:28px 36px}
      .body p{margin:0 0 14px;font-size:15px;color:#cbd5e1;line-height:1.7}
      .field{margin-bottom:20px}
      .field .label{font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#7c3aed;margin-bottom:6px}
      .field .value{font-size:14px;color:#e2e8f0;background:#0f0f18;padding:12px 16px;border-radius:8px;border-left:3px solid #7c3aed;white-space:pre-wrap;word-break:break-word}
      .field .value::before{content:'';display:block;position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,#7c3aed,transparent)}
      .accent-bar{height:3px;background:linear-gradient(90deg,#7c3aed,#06b6d4,#a78bfa);margin:0}
      .footer{background:#0a0a0f;padding:24px 36px;text-align:center;border-top:1px solid #1e1e2a}
      .footer p{margin:4px 0;font-size:12px;color:#475569}
      .footer a{color:#a78bfa;text-decoration:none}
      .footer .sig{font-size:13px;color:#7c3aed;font-weight:600;margin-bottom:8px}
      .badge{display:inline-block;background:#1a0a3a;border:1px solid #2d1d5e;border-radius:6px;padding:4px 12px;font-size:11px;color:#a78bfa;margin-top:8px}
    `

    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.GMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `[Portfolio] New Contact — ${name}`,
      html: `<!DOCTYPE html><html><head><style>${emailCSS}</style></head><body>
        <div class="wrapper">
          <div class="accent-bar"></div>
          <div class="header">
            <div class="icon">&#9993;</div>
            <h1>New Contact Message</h1>
            <p>Someone reached out through your portfolio</p>
          </div>
          <div class="body">
            <div class="field"><div class="label">From</div><div class="value">${escHtml(name)}</div></div>
            <div class="field"><div class="label">Email</div><div class="value">${escHtml(email)}</div></div>
            <div class="field"><div class="label">Message</div><div class="value">${escHtml(message)}</div></div>
          </div>
          <div class="footer">
            <p style="color:#64748b">Sent via <strong style="color:#a78bfa">Muhammad Ali Aamir</strong> — Portfolio Contact Form</p>
          </div>
        </div></body></html>`,
    })

    await transporter.sendMail({
      from: `"Muhammad Ali Aamir" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `I received your message!`,
      html: `<!DOCTYPE html><html><head><style>${emailCSS}</style></head><body>
        <div class="wrapper">
          <div class="accent-bar"></div>
          <div class="header">
            <div class="icon">&#10024;</div>
            <h1>Thanks, ${escHtml(name)}!</h1>
            <p>Your message has been received</p>
          </div>
          <div class="body">
            <p>Hi ${escHtml(name)},</p>
            <p>Thank you for reaching out! I've received your message and will get back to you within <strong>24 hours</strong>.</p>
            <p>In the meantime, feel free to check out my work on <a href="https://github.com/aliamirchoudhary" style="color:#a78bfa">GitHub</a> or connect with me on <a href="https://linkedin.com/in/aliamirchoudhary" style="color:#a78bfa">LinkedIn</a>.</p>
          </div>
          <div class="footer">
            <div class="sig">Muhammad Ali Aamir</div>
            <p>Full-Stack Developer &amp; Data Science Enthusiast</p>
            <p style="margin-top:8px">
              <a href="https://github.com/aliamirchoudhary">GitHub</a> &bull;
              <a href="https://linkedin.com/in/aliamirchoudhary">LinkedIn</a>
            </p>
          </div>
        </div></body></html>`,
    })

    return res.status(200).json({ success: true, message: "Message sent! I'll be in touch within 24 hours." })
  } catch (err) {
    console.error('Email error:', err.message)
    return res.status(500).json({ success: false, message: 'Server error — could not send email.' })
  }
}
