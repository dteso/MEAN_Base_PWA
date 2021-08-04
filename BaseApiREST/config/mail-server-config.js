exports.mailServerConfig = {
    service: process.env.MAIL_SERVICE,
    auth: {
        user: process.env.MAIL_SENDER_DIR,
        pass: process.env.MAIL_SENDER_PASS
    }
}