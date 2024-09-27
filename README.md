# E-Learning

E-Learning Management System

# Forget Password Functionality

## Email Service Provider

We have chosen **SMTP (Zoho)** as our email service provider for now. It provides simple setup because it uses smtp while also being able to send suitable amount of daily emails for now. In case of scalability, we can use **SendGrid** with a custom domain email.

### Sending OTPs

We are sending a 6-digit OTP to users when they request a password reset. The OTP is valid for 3 minutes. The expiration is checked using the `updated_at` timestamp from the user's document in the database.

### OTP Expiration

- The OTP expires after 3 minutes. If expired, the user will receive a message indicating the OTP is invalid or expired.
