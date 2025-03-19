const Koa = require('koa');
const Router = require('koa-router');
const nodemailer = require('nodemailer');
const app = new Koa();
const router = new Router();

// Setup mail transporter (Use your own SMTP details)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-email-password'
  }
});

// Send notification email
router.post('/api/notify', async (ctx) => {
  const { to, subject, text } = ctx.request.body;

  const mailOptions = {
    from: 'your-email@gmail.com',
    to,
    subject,
    text
  };
  try {
    await transporter.sendMail(mailOptions);
    ctx.body = { message: 'Email sent successfully' };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: 'Failed to send email', details: error.message };
  }
});
app.use(router.routes());
app.use(router.allowedMethods());
app.listen(3003, () => console.log('Notification Service started on port 3003'));
