const nodemailer = require('nodemailer');
const db = require('../config/database');

// Configure email transporter (using Gmail as example)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Use App Password for Gmail
  },
});

const emailService = {
  async sendEmail(to, subject, message, type = 'General') {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        html: message,
      };

      await transporter.sendMail(mailOptions);
      
      // Log notification in database
      await this.logNotification(to, subject, message, type);
      
      console.log(`Email sent to ${to}`);
      return true;
    } catch (error) {
      console.error('Email sending error:', error);
      return false;
    }
  },

  async logNotification(email, subject, message, type) {
    try {
      // Find user by email to get user_id
      const [users] = await db.execute(
        'SELECT user_id FROM users WHERE email = ?',
        [email]
      );
      
      if (users.length > 0) {
        const user_id = users[0].user_id;
        
        await db.execute(
          'INSERT INTO notifications (user_id, subject, message, type) VALUES (?, ?, ?, ?)',
          [user_id, subject, message, type]
        );
      }
    } catch (error) {
      console.error('Notification logging error:', error);
    }
  },

  async notifyAllUsers(subject, message, type = 'General') {
    try {
      const [users] = await db.execute('SELECT email FROM users WHERE email IS NOT NULL');
      
      const emailPromises = users.map(user => 
        this.sendEmail(user.email, subject, message, type)
      );
      
      await Promise.all(emailPromises);
      console.log(`Notified ${users.length} users about: ${subject}`);
    } catch (error) {
      console.error('Bulk notification error:', error);
    }
  },

  // Send payment receipt
  async sendPaymentReceipt(userEmail, paymentDetails) {
    const subject = 'Payment Receipt - CheapFlix';
    const message = `
      <h2>Payment Receipt</h2>
      <p>Thank you for your payment to CheapFlix!</p>
      <div style="background: #f9f9f9; padding: 15px; border-radius: 5px;">
        <p><strong>Amount:</strong> ${paymentDetails.currency_code} ${paymentDetails.amount}</p>
        <p><strong>Subscription:</strong> ${paymentDetails.level_name}</p>
        <p><strong>Transaction Date:</strong> ${new Date(paymentDetails.transaction_date).toLocaleString()}</p>
        <p><strong>Payment Method:</strong> ${paymentDetails.payment_method}</p>
        <p><strong>Transaction ID:</strong> ${paymentDetails.payment_id}</p>
      </div>
      <p>If you have any questions, please contact our support team.</p>
    `;
    
    return await this.sendEmail(userEmail, subject, message, 'Receipt');
  },

  // Send new movie notification
  async sendNewMovieNotification(movieDetails) {
    const subject = 'New Movie Available - CheapFlix';
    const message = `
      <h2>New Movie Added!</h2>
      <p>We're excited to announce that a new movie has been added to CheapFlix:</p>
      <div style="background: #f9f9f9; padding: 15px; border-radius: 5px;">
        <h3>${movieDetails.title}</h3>
        <p><strong>Genre:</strong> ${movieDetails.genre}</p>
        <p><strong>Release Year:</strong> ${movieDetails.release_year}</p>
        <p><strong>Duration:</strong> ${movieDetails.duration} minutes</p>
        <p>${movieDetails.description}</p>
      </div>
      <p>Start watching now on CheapFlix!</p>
    `;
    
    return await this.notifyAllUsers(subject, message, 'MovieUpdate');
  }
};

module.exports = emailService;