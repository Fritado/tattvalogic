/**
 * Branded HTML Email Templates for TattvaLogic
 * All styles are inline for maximum email client compatibility.
 */

/**
 * Generates the onboarding invitation email for the new hire.
 * @param {string} candidateName - Full name of the candidate
 * @param {string} onboardingLink - Secure token-based onboarding URL
 * @param {string} expiryDateStr  - Human-readable expiry date/time string
 * @returns {string} HTML string
 */
const onboardingInviteEmail = (candidateName, onboardingLink, expiryDateStr) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Complete Your Onboarding – TattvaLogic</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:'Segoe UI',Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#0f0f0f 0%,#1a1a2e 100%);padding:40px 48px;text-align:center;">
              <div style="display:inline-block;background:rgba(255,255,255,0.08);border-radius:12px;padding:12px 24px;border:1px solid rgba(255,255,255,0.12);">
                <span style="color:#ffffff;font-size:22px;font-weight:800;letter-spacing:0.5px;">TattvaLogic</span>
                <span style="color:rgba(255,255,255,0.4);font-size:11px;font-weight:600;letter-spacing:3px;display:block;margin-top:2px;text-transform:uppercase;">Human Resources</span>
              </div>
            </td>
          </tr>

          <!-- Welcome Banner -->
          <tr>
            <td style="background:linear-gradient(135deg,#f8f9ff 0%,#eff2ff 100%);padding:32px 48px 24px;text-align:center;border-bottom:1px solid #eef0f8;">
              <div style="display:inline-block;background:#e8edff;border-radius:50%;width:64px;height:64px;line-height:64px;font-size:28px;margin-bottom:16px;">🎉</div>
              <h1 style="margin:0 0 8px;color:#0f0f0f;font-size:26px;font-weight:800;line-height:1.3;">Welcome to the Team!</h1>
              <p style="margin:0;color:#6b7280;font-size:15px;">We're thrilled to have you joining TattvaLogic.</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 48px;">
              <p style="margin:0 0 16px;color:#374151;font-size:16px;line-height:1.7;">
                Hi <strong style="color:#0f0f0f;">${candidateName}</strong>,
              </p>
              <p style="margin:0 0 24px;color:#4b5563;font-size:15px;line-height:1.8;">
                We're excited to welcome you to <strong>TattvaLogic</strong>! To help us get everything ready for your first day, please complete your onboarding profile using the secure link below.
              </p>

              <!-- Steps -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border-radius:14px;padding:24px;margin:0 0 28px;">
                <tr>
                  <td>
                    <p style="margin:0 0 14px;color:#0f0f0f;font-size:13px;font-weight:800;letter-spacing:2px;text-transform:uppercase;">What you'll need to complete:</p>
                    <table cellpadding="0" cellspacing="0">
                      <tr><td style="padding:5px 0;color:#374151;font-size:14px;">✅ &nbsp;Personal details &amp; addresses</td></tr>
                      <tr><td style="padding:5px 0;color:#374151;font-size:14px;">✅ &nbsp;Professional background</td></tr>
                      <tr><td style="padding:5px 0;color:#374151;font-size:14px;">✅ &nbsp;Family &amp; emergency contact info</td></tr>
                      <tr><td style="padding:5px 0;color:#374151;font-size:14px;">✅ &nbsp;Bank account details for payroll</td></tr>
                      <tr><td style="padding:5px 0;color:#374151;font-size:14px;">✅ &nbsp;Document uploads (Resume, ID, etc.)</td></tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:8px 0 28px;">
                    <a href="${onboardingLink}"
                       style="display:inline-block;background:linear-gradient(135deg,#0f0f0f 0%,#1a1a2e 100%);color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;padding:16px 40px;border-radius:12px;letter-spacing:0.3px;box-shadow:0 4px 16px rgba(0,0,0,0.2);">
                      Complete My Onboarding →
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Expiry Warning -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff8ed;border:1px solid #fde68a;border-radius:12px;padding:16px 20px;margin:0 0 28px;">
                <tr>
                  <td>
                    <p style="margin:0;color:#92400e;font-size:13px;line-height:1.6;">
                      ⏰ &nbsp;<strong>This link expires on ${expiryDateStr}.</strong><br/>
                      After expiry, you'll need to contact HR to request a new link.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Fallback link -->
              <p style="margin:0 0 8px;color:#9ca3af;font-size:12px;">If the button above doesn't work, copy and paste this link into your browser:</p>
              <p style="margin:0;background:#f3f4f6;border-radius:8px;padding:12px;font-size:11px;color:#6b7280;word-break:break-all;font-family:monospace;">${onboardingLink}</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:28px 48px;text-align:center;">
              <p style="margin:0 0 6px;color:#6b7280;font-size:12px;">Questions? Reach us at <a href="mailto:support@tattvalogic.com" style="color:#3b82f6;text-decoration:none;">support@tattvalogic.com</a></p>
              <p style="margin:0;color:#9ca3af;font-size:11px;">© ${new Date().getFullYear()} TattvaLogic. All rights reserved.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
`;

/**
 * Generates the admin notification email when a candidate completes onboarding.
 * @param {string} candidateName - Full name of the candidate
 * @param {string} employeeId    - System employee ID (e.g. LTE001)
 * @param {string} adminDashboardLink - Link to the employee's onboarding view in admin panel
 * @returns {string} HTML string
 */
const onboardingCompletionAdminEmail = (candidateName, employeeId, adminDashboardLink) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Onboarding Completed – ${candidateName}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:'Segoe UI',Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#064e3b 0%,#065f46 100%);padding:32px 48px;text-align:center;">
              <div style="display:inline-block;background:rgba(255,255,255,0.12);border-radius:50%;width:56px;height:56px;line-height:56px;font-size:26px;margin-bottom:12px;">✅</div>
              <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:800;">Onboarding Completed</h1>
              <p style="margin:6px 0 0;color:rgba(255,255,255,0.7);font-size:13px;">Admin Notification · TattvaLogic HR</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 48px;">
              <p style="margin:0 0 20px;color:#374151;font-size:15px;line-height:1.7;">
                <strong style="color:#0f0f0f;">${candidateName}</strong> has successfully completed their onboarding profile.
              </p>

              <!-- Info Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:20px 24px;margin:0 0 28px;">
                <tr>
                  <td>
                    <p style="margin:0 0 8px;color:#065f46;font-size:13px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;">Summary</p>
                    <p style="margin:0 0 6px;color:#065f46;font-size:14px;">👤 &nbsp;<strong>Candidate:</strong> ${candidateName}</p>
                    <p style="margin:0 0 6px;color:#065f46;font-size:14px;">🆔 &nbsp;<strong>Employee ID:</strong> ${employeeId}</p>
                    <p style="margin:0;color:#065f46;font-size:14px;">📅 &nbsp;<strong>Submitted At:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</p>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 24px;color:#4b5563;font-size:14px;line-height:1.7;">
                Please review the submitted details and proceed with document verification and account setup.
              </p>

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${adminDashboardLink}"
                       style="display:inline-block;background:#0f0f0f;color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;padding:14px 36px;border-radius:12px;letter-spacing:0.3px;">
                      View Onboarding Profile →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:20px 48px;text-align:center;">
              <p style="margin:0;color:#9ca3af;font-size:11px;">© ${new Date().getFullYear()} TattvaLogic Internal HR System · Do not reply to this email.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
`;

module.exports = { onboardingInviteEmail, onboardingCompletionAdminEmail };
