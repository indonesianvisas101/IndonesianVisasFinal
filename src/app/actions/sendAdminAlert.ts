"use server";

export async function sendAdminAlert(subject: string, message: string) {
    const adminEmails = [
        "damnbayu@gmail.com",
        "damnbayu@icloud.com",
        "indonesianvisas@gmail.com"
    ];

    console.log(`[URGENT EMAIL ALERT] To: ${adminEmails.join(', ')} | Subject: ${subject}`);
    console.log(`Body: ${message}`);

    // Placeholder for actual email sending logic (e.g., SMTP or API)
    // If you have credentials later, uncomment and use them.
    /*
    try {
        await resend.emails.send({ ... })
    } catch (e) {
        console.error("Failed to send email", e);
    }
    */

    return { success: true };
}
