import { Schema } from "mongoose";
import webpush, { PushSubscription } from "web-push";
import { Customer } from "~~/model";
if (!process.env.VAPID_PUBLICKEY || !process.env.VAPID_PRIVATEKEY)
    throw new Error("no VAPID keys found, please set env vars");
webpush.setGCMAPIKey('AIzaSyCnd5zVWsmFxDP2e3vSc1Cm4HVffBajvF8');
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

export const sendNotification = (subscription: PushSubscription, body: PushMessageBody) => {
    return webpush.sendNotification(subscription, JSON.stringify(body))
}


const options = { fullDocument: "updateLookup" };
//[{ $match: { subscriptions: { $exists: true } } }]
Customer.watch<{ subscriptions: PushSubscription, unsuspend: boolean, suspend: boolean }>([{ $project: { operationType: "$operationType", subscriptions: "$fullDocument.subscriptions", unsuspend: { $in: ["suspendedAt", "$updateDescription.removedFields"] }, suspend: { "$cond": [{ "$ifNull": ["$updateDescription.updatedFields.suspendedAt", null] }, true, false] } } }], options).on("change", (change: any) => {
    if (change.operationType !== "update") return
    if (!change.suspend && !change.unsuspend) return
    if (!change.subscriptions || !Object.keys(change.subscriptions).length) return
    const subs = Object.values(change.subscriptions) as PushSubscription[]
    const message: PushMessageBody = { body: "" }
    if (change.suspend) {
        message.title = "Your account has been suspended!"
        message.body = "Please contact an administrator to get more details"
    }
    if (change.unsuspend) {
        message.title = "Your account is no longer suspended!"
        message.body = "We apologize for the inconvenience"
    }
    subs.forEach(subscription => {
        sendNotification(subscription, message)
    })
})

export function setup() { }
