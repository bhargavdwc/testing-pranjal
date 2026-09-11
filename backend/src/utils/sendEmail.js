import SibApiV3Sdk from "sib-api-v3-sdk";
import logger from "./logger.js";
import { escapeHtml } from "./security.js";

// Brevo client for all emails (office@pranjalsarkar.com)
const officeClient = new SibApiV3Sdk.ApiClient();
officeClient.authentications["api-key"].apiKey =
  process.env.BREVO_API_KEY_OFFICE;
const officeApi = new SibApiV3Sdk.TransactionalEmailsApi(officeClient);

/**
 * Send internal notification email when a new lead submits the form.
 * Uses BREVO_API_KEY_NEW_LEAD
 */
export const sendNewLeadNotification = async (lead) => {
  try {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.subject = `🔔 New Lead: ${lead.name}`;
    sendSmtpEmail.sender = {
      name: "CRM System",
      email: "bhargav.digitalwebconnection@gmail.com",
    };
    sendSmtpEmail.to = [{ email: "bhargav.digitalwebconnection@gmail.com", name: "Support" }];
    sendSmtpEmail.htmlContent = `
        <h2>New Lead Application</h2>
        <p><strong>Name:</strong> ${escapeHtml(lead.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(lead.email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(lead.phone)}</p>
        <p><strong>Role:</strong> ${escapeHtml(lead.role)}</p>
        <p><strong>Company:</strong> ${escapeHtml(lead.company)}</p>
        <p><strong>Message/LinkedIn:</strong> ${escapeHtml(lead.message)}</p>
    `;

    await officeApi.sendTransacEmail(sendSmtpEmail);
    logger.info("[Brevo Success] New lead notification sent to Support");
    return true;
  } catch (error) {
    logger.error(
      "[Brevo Error] New lead notification failed:",
      error.response?.text || error.message,
    );
    return false;
  }
};

/**
 * Send HTML confirmation email to mentee when lead is marked as CONVERTED.
 * Uses BREVO_API_KEY_
 */
export const sendMenteeConfirmation = async (lead) => {
  try {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.subject = "🎊 Welcome Aboard! AI Product Leadership Studio";
    sendSmtpEmail.sender = {
      name: "Team Pranjal Sarkar",
      email: "bhargav.digitalwebconnection@gmail.com",
    };
    sendSmtpEmail.to = [{ email: lead.email, name: lead.name }];
    sendSmtpEmail.htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <!-- Header Gradient Banner -->
          <div style="background: linear-gradient(to right, #0088ff, #8800ff); padding: 40px 20px; border-radius: 12px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px;">🎊 Welcome Aboard!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">AI Product Leadership Studio</p>
          </div>
          
          <!-- Body Content -->
          <div style="padding: 30px 20px; border: 1px solid #eee; border-top: none; border-radius: 0 0 12px 12px;">
            <p style="font-size: 16px; margin-bottom: 20px;"><strong>Hi ${escapeHtml(lead.name)},</strong></p>
            
            <p style="font-size: 16px; line-height: 1.5; color: #555;">
              Congratulations! Your enrollment in the <strong>AI Product Leadership Studio</strong> is confirmed. We're thrilled to have you join this selective cohort.
            </p>
            
            <!-- What happens next box -->
            <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin: 25px 0;">
              <h3 style="margin-top: 0; color: #166534; font-size: 16px; display: flex; align-items: center; gap: 8px;">
                ✅ What happens next:
              </h3>
              <ul style="color: #166534; margin: 0; padding-left: 20px; line-height: 1.8;">
                <li>You'll be added to our exclusive WhatsApp group</li>
                <li>You'll receive program materials and schedule</li>
                <li>Pranjal will personally welcome you</li>
              </ul>
            </div>
            
            <p style="font-size: 16px; line-height: 1.5; color: #555;">
              If you have any questions, reply to this email or reach out to us directly.
            </p>
            
            <p style="font-size: 16px; margin-top: 30px;">
              <strong>Looking forward to working with you!</strong><br/>
              <span style="color: #777;">— Team Pranjal Sarkar</span>
            </p>
          </div>
        </div>
      `;

    await officeApi.sendTransacEmail(sendSmtpEmail);
    logger.info(`[Brevo Success] Mentee confirmation sent to ${lead.email}`);
    return true;
  } catch (error) {
    logger.error(
      "[Brevo Error] Mentee confirmation failed:",
      error.response?.text || error.message,
    );
    return false;
  }
};

/**
 * Send OTP for admin login.
 * Uses BREVO_API_KEY_NEW_LEAD client
 */
export const sendOtpEmail = async (accountEmail, otp) => {
  try {
    const targetEmail = process.env.ADMIN_OTP_TARGET_EMAIL || process.env.BREVO_SENDER_EMAIL;
    const senderEmail = process.env.BREVO_SENDER_EMAIL || targetEmail;
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.subject = "Your Admin Login OTP";
    sendSmtpEmail.sender = {
      name: "Admin OTP",
      email: senderEmail,
    };
    sendSmtpEmail.to = [{ email: targetEmail, name: "Admin" }];
    sendSmtpEmail.replyTo = {
      name: "No Reply",
      email: senderEmail,
    };
    sendSmtpEmail.headers = { "X-Mailin-Tag": "admin-otp" };
    sendSmtpEmail.htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <div style="background: linear-gradient(to right, #0088ff, #8800ff); padding: 40px 20px; border-radius: 12px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px;">Admin Login OTP</h1>
          </div>
          <div style="padding: 30px 20px; border: 1px solid #eee; border-top: none; border-radius: 0 0 12px 12px;">
            <p style="font-size: 16px;">Hello Admin,</p>
            <p style="font-size: 16px;">A login OTP was requested for admin account: <strong>${escapeHtml(accountEmail)}</strong>. Here is the code:</p>
            <div style="text-align: center; margin: 30px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #0088ff; background: #f0f8ff; padding: 15px 30px; border-radius: 8px;">${escapeHtml(otp)}</span>
            </div>
            <p style="font-size: 14px; color: #777;">This code is valid for the next 10 minutes. If you didn't request this, you can safely ignore this email.</p>
          </div>
        </div>
    `;

    await officeApi.sendTransacEmail(sendSmtpEmail);
    logger.info(`[Brevo Success] OTP for account ${accountEmail} sent to ${targetEmail}`);
    return true;
  } catch (error) {
    logger.error(
      "[Brevo Error] OTP failed to send:",
      error.response?.text || error.message,
    );
    return false;
  }
};
