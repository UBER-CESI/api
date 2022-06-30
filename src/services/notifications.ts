import webpush, { PushSubscription } from "web-push";
import "./Customers"
import "./Orders"
import "../model"
export interface PushMessageBody {
    title?: string
    body: string
    image?: string
    icon?: string
}

export var sendNotification: (subscription: PushSubscription, body: PushMessageBody) =>
    Promise<webpush.SendResult>

export function setup() {
    if (!process.env.VAPID_PUBLICKEY || !process.env.VAPID_PRIVATEKEY)
        throw new Error("no VAPID keys found, please set env vars");
    webpush.setVapidDetails(
        "mailto:admin@cesi-eats.fr",
        process.env.VAPID_PUBLICKEY,
        process.env.VAPID_PRIVATEKEY
    );

    sendNotification = (subscription: PushSubscription, body: PushMessageBody) =>
        webpush.sendNotification(subscription, JSON.stringify(body))
}