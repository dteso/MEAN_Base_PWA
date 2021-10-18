const { response } = require('express');
const { BaseController } = require('./base.controller');

const webpush = require('web-push');

const vapidKeys = {
    "publicKey": "BAfOIbp_UDfO0Vw6rFvJ0DGHyoucjPML_w8DjsxnIgMhzCnnuwL1TSkuRwESsIo1PlU6s7C11cowbJh_HJXsLS0",
    "privateKey": "5iMZSHGFKPjTjA5dnxaVSsfINHVLqBWWKxY9AEDiWb8"
};

webpush.setVapidDetails(
    'mailto:dtesodev@gmail.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

const notificationPayload = {
    "notification": {
        "title": "Welcome to D1G17AL0PHY!!!",
        "body": "Bits in veins",
        "icon": "/assets/medusa.jpg",
        "vibrate": [100, 50, 100],
        "data": {
            "dateOfArrival": Date.now(),
            "primaryKey": 1
        },
        "actions": [{
            "action": "explore",
            "title": "Go to the site"
        }]
    }
};

class NewsletterController extends BaseController {

    notify = async (req, res = response) => {
        try{
            await webpush.sendNotification(
                req.body, JSON.stringify(notificationPayload))
                .then(() => res.status(200).json({ message: 'Newsletter sent successfully.' }))
                .catch(err => {
                    console.error("Error sending notification, reason: ", err);
                    res.sendStatus(500);
                });
        }catch(err){
            console.log(err);
            res.status(500).json({
                ok: false,
                error: err
            })
        }

    }

}

module.exports = {
    NewsletterController
}