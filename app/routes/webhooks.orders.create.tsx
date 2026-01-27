import { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import db from "../db.server";
import nodemailer from "nodemailer";

export const action = async ({ request }: ActionFunctionArgs) => {
    const { topic, shop, session, admin, payload } = await authenticate.webhook(request);

    if (!admin) {
        // The topic was valid, but there was no active session for this shop.
        // This can happen if the app was uninstalled or the session expired.
        return new Response();
    }

    // Define types for Order items
    // payload is the Order resource: https://shopify.dev/docs/api/admin-rest/2023-10/resources/order
    const order = payload as any;

    console.log(`[Webhook] Order ${order.name} created on ${shop}`);

    // Check for Preorder items
    // We look for line items that have a property `_preorder` == 'true'
    const preorderItems = order.line_items.filter((item: any) => {
        return item.properties && item.properties.some((prop: any) =>
            prop.name === '_preorder' && (prop.value === 'true' || prop.value === true)
        );
    });

    if (preorderItems.length > 0) {
        console.log(`[Webhook] Found ${preorderItems.length} preorder items in Order ${order.name}`);

        // Fetch app settings for this shop
        const settings = await db.settings.findUnique({
            where: { shop },
        });

        const customerEmail = order.email;
        const customerFirstName = order.customer ? order.customer.first_name : "Customer";
        const customerLastName = order.customer ? order.customer.last_name : "";

        // For now, we'll log it. 
        // To actually send mail, we need an SMTP service or API.

        await sendPreorderConfirmation(
            shop,
            customerEmail,
            customerFirstName,
            customerLastName,
            preorderItems,
            order.name,
            settings
        );
    }

    return new Response();
};

async function sendPreorderConfirmation(
    shop: string,
    email: string,
    firstName: string,
    lastName: string,
    items: any[],
    orderName: string,
    settings: any
) {
    console.log(`---------------------------------------------------`);
    console.log(`📧 SENDING PREORDER EMAIL to: ${email}`);

    // Default Templates
    const defaultSubject = "Preorder Confirmation for Order {{order_number}}";
    const defaultHeader = "Hi {{customer_first_name}}, thanks for your preorder! The following items are on preorder:";
    const defaultLineItem = "- {{product_title}} ({{variant_name}}) - Qty: {{quantity}}";
    const defaultFooter = "We will notify you when they ship.";

    // Get templates from settings or use defaults
    let subjectTpl = settings?.emailSubject || defaultSubject;
    let headerTpl = settings?.emailHeader || defaultHeader;
    let lineItemTpl = settings?.emailLineItem || defaultLineItem;
    let footerTpl = settings?.emailLineFooter || defaultFooter;

    // Helper to replace global variables
    const replaceGlobalVars = (text: string) => {
        return text
            .replace(/{{customer_first_name}}/g, firstName)
            .replace(/{{customer_last_name}}/g, lastName)
            .replace(/{{order_number}}/g, orderName);
    };

    // Prepare Subject
    const subject = replaceGlobalVars(subjectTpl);

    // Prepare Body
    let body = "";

    // Header
    body += replaceGlobalVars(headerTpl) + "\n\n";

    // Line Items
    items.forEach(item => {
        let line = lineItemTpl;
        line = line
            .replace(/{{product_title}}/g, item.title)
            .replace(/{{variant_name}}/g, item.variant_title || "")
            .replace(/{{quantity}}/g, item.quantity)
            .replace(/{{price}}/g, item.price)
            .replace(/{{sku}}/g, item.sku || "")
            .replace(/{{order_number}}/g, orderName);

        // Try to find preorder description (custom property?) - failing gracefully if not present
        const preorderProp = item.properties?.find((p: any) => p.name === 'Preorder Description');
        const desc = preorderProp ? preorderProp.value : "";
        line = line.replace(/{{preorder_description}}/g, desc);

        body += line + "\n";
    });

    // Footer
    body += "\n" + replaceGlobalVars(footerTpl);

    // SMTP Configuration
    if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
        console.error("❌ Email not sent: GMAIL_USER or GMAIL_PASS not set in environment variables.");
        return;
    }

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS, // Use Gmail App Password
        },
    });

    const mailOptions = {
        from: settings?.senderEmail || process.env.GMAIL_USER,
        to: email,
        subject: subject,
        html: body.replace(/\n/g, "<br>"), // Basic conversion to HTML
        bcc: settings?.bccMe && settings?.bccEmail ? settings.bccEmail : undefined,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`📧 Preorder email sent to ${email}: ${info.messageId}`);
    } catch (error) {
        console.error(`❌ Error sending email to ${email}:`, error);
    }
}


