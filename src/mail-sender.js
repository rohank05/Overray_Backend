import path from "path";
import schemas from "./database/schemas/index.js";
import fs from "fs";
import sgMail from "@sendgrid/mail";
import { fileURLToPath } from "url";
import logger from "./utils/logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

sgMail.setApiKey(process.env.SEND_GRID_KEY);

function replaceTagsInTemplate(html, tags) {
    let replacedHtml = html;
    for (const [key, value] of Object.entries(tags)) {
        replacedHtml = replacedHtml.replace(
            new RegExp(`{{${key}}}`, "g"),
            value,
        );
    }
    return replacedHtml;
}

const getEmailTemplate = async (templateName) => {
    const templatePath = path.join(
        __dirname,
        "email-templates",
        `${templateName}.html`,
    );
    try {
        return fs.readFileSync(templatePath, "utf8");
    } catch (error) {
        logger.error(`Error reading template file ${templateName}:`, error);
        return null;
    }
};

async function sendEmail(recipient, subject, html) {
    const msg = {
        to: recipient.email,
        from: process.env.SENDER_EMAIL,
        subject: subject,
        html: html,
    };

    try {
        await sgMail.send(msg);
        return true;
    } catch (error) {
        logger.error("Error sending email:", error);
        return false;
    }
}

const processEmail = async () => {
    const pendingEmails = await schemas.email_queue
        .find({ status: "pending" })
        .exec();
    for (const queueItem of pendingEmails) {
        const templateHtml = await getEmailTemplate(queueItem.email_template);
        const emailRecipient = await schemas.email_recipient.findOne({
            email_queue_id: queueItem._id,
        });
        if (templateHtml && emailRecipient) {
            const replacedHtml = replaceTagsInTemplate(
                templateHtml,
                queueItem.tags,
            );
            const success = await sendEmail(
                emailRecipient,
                queueItem.subject || "Email Notification",
                replacedHtml,
            );

            if (success) {
                queueItem.status = "sent";
                queueItem.sentAt = new Date();
            } else {
                queueItem.status = "failed";
            }

            await queueItem.save();
        } else {
            logger.error(
                `Failed to process email: templateName=${queueItem.templateName}, recipientId=${queueItem._id}`,
            );
            queueItem.status = "failed";
            await queueItem.save();
        }
    }
};

export default processEmail;
