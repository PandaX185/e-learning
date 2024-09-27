# E-Learning

E-Learning Management System

# Forget Password Functionality

## Email Service Provider

We have chosen **SendGrid** as our email service provider for the following reasons:

- Professional branding and customization options for emails.
- Higher deliverability rate and advanced features like analytics and tracking.
- Free tier covers up to 100 emails per day, which is sufficient for our current scale.
- Easily scalable when the app grows, with paid plans that offer more flexibility.

### Sending OTPs

We are sending a 6-digit OTP to users when they request a password reset. The OTP is valid for 3 minutes. The expiration is checked using the `updated_at` timestamp from the user's document in the database.

### OTP Expiration

- The OTP expires after 3 minutes. If expired, the user will receive a message indicating the OTP is invalid or expired.
