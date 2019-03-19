import {USER_SUBSCRIPTIONS} from './in-memory-db';

const webpush = require('web-push');


export function sendNewsletter(req, res) {

    console.log('Total subscriptions', USER_SUBSCRIPTIONS.length);

    // sample notification payload
    const notificationPayload = {
        'notification': {
            'title': 'Push-Notifiactaion pealkiri',
            'body': 'Push-i body l2heb siia',
            'icon': 'assets/main-page-logo-small-hat.png',
            'vibrate': [100, 50, 100],
            'data': {
                'dateOfArrival': Date.now(),
                'primaryKey': 1
            },
            'actions': [{
                'action': 'explore',
                'title': 'Button Vaata notificationit'
            }]
        }
    };


    Promise.all(USER_SUBSCRIPTIONS.map(sub => webpush.sendNotification(
        sub, JSON.stringify(notificationPayload) )))
        .then(() => res.status(200).json({message: 'Console kiri kui saadetud.'}))
        .catch(err => {
            console.error('Error sending notification, reason: ', err);
            res.sendStatus(500);
        });






}

