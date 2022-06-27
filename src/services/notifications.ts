import webpush, { PushSubscription } from "web-push";
import { Customer } from "~~/model";
if (!process.env.VAPID_PUBLICKEY || !process.env.VAPID_PRIVATEKEY)
    throw new Error("no VAPID keys found, please set env vars");
webpush.setVapidDetails(
    "mailto:admin@cesi-eats.fr",
    process.env.VAPID_PUBLICKEY,
    process.env.VAPID_PRIVATEKEY
);

interface PushMessageBody {
    title?: string
    body: string
    image?: string
    icon?: string
}

export const sendNotification = (subscription: PushSubscription, body: PushMessageBody) =>
    webpush.sendNotification(subscription, JSON.stringify(body))
Customer.watch([{ $match: { suspend: { 'type': 6 } } }]).on("change", e => {
    if (e.operationType !== "update") return
    if (!e.documentKey) return
    console.log("suspend" + e.documentKey._id)
})