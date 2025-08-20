import schemas from "../database/schemas/index.js";
import optless from "../utils/otpless.js";
export default {
    expiresIn: 15,
    createVerificationEmail: async function ({
        verificationToken,
        name,
        email,
    }) {
        const verificationLink = `${process.env.BASE_URL}/v1/auth/user/verify/${verificationToken}`;
        const emailQueue = new schemas.email_queue({
            email_template: "verification_email_template",
            tags: { verificationLink, name },
            subject: "Overray Email Verification",
        });

        await emailQueue.save();
        const emailRecipient = new schemas.email_recipient({
            name,
            email,
            email_queue_id: emailQueue._id,
        });
        emailRecipient.save();
    },
    createResetPasswordEmail: async function ({ name, email, otp }) {
        const resetPassword = new schemas.reset_password({
            email,
            otp,
            expiresAt: new Date(Date.now() + this.expiresIn * 60000),
        });
        resetPassword.save();
        const emailQueue2 = new schemas.email_queue({
            email_template: "reset_password_template",
            tags: { name, otp, expirationTime: this.expiresIn },
            subject: "Account Password Recovery",
        });
        await emailQueue2.save();
        const emailRecipient2 = new schemas.email_recipient({
            name,
            email,
            email_queue_id: emailQueue2._id,
        });
        emailRecipient2.save();
    },
    sendPhoneVerification: async (phoneNumber) => {
        return optless.sendOTP({ phoneNumber });
    },
    verifyPhoneVerification: async (requestId, code) => {
        const result = await optless.verifyOTP({ requestId, otp: code });
        return result.isOTPVerified;
    },
};
