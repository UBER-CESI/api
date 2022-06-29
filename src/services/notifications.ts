import { Customer, Order } from "../model";
import webpush, { PushSubscription } from "web-push";
interface PushMessageBody {
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

    const options = { fullDocument: "updateLookup" };
    //[{ $match: { subscriptions: { $exists: true } } }]
    Customer.watch<{ subscriptions: PushSubscription, unsuspend: boolean, suspend: boolean }>([{ $project: { operationType: "$operationType", subscription: "$fullDocument.subscription", unsuspend: { $in: ["suspendedAt", "$updateDescription.removedFields"] }, suspend: { "$cond": [{ "$ifNull": ["$updateDescription.updatedFields.suspendedAt", null] }, true, false] } } }], options).on("change", (change: any) => {
        console.log("customerChange")
        if (change.operationType !== "update") return
        if (!change.suspend && !change.unsuspend) return
        if (!change.subscription) return
        const message: PushMessageBody = { body: "" }
        if (change.suspend) {
            message.title = "Your account has been suspended!"
            message.body = "Please contact an administrator to get more details"
        }
        if (change.unsuspend) {
            message.title = "Your account is no longer suspended!"
            message.body = "We apologize for the inconvenience"
        }
        sendNotification(change.subscription, message)
    })

    Order.watch<{ subscriptions: PushSubscription, unsuspend: boolean, suspend: boolean }>([{ $project: { operationType: "$operationType", status: "$fullDocument.status", customerId: "$fullDocument.customerId" } }], options).on("change", async (change: any) => {
        if (change.operationType !== "update") return
        if (change.status != "preparing" && change.status != "delivering" && change.status != "delivered") return
        if (!change.customerId) return
        const message: PushMessageBody = { body: "" }
        if (change.status == "preparing") {
            message.title = "Your order is being prepared"
            message.body = "We will update you shortly after"
        }
        if (change.status == "delivering") {
            message.title = "Your order is being delivered"
            message.body = "The deliverer should contact you soon!"
        }
        if (change.status == "delivered") {
            message.title = "Your order is delivered"
            message.body = "lorem ipsum dolor"
        }
        const single = await Customer.findOne({ _id: change.customerId })
        if (!single || !single.subscription) return
        sendNotification(single.subscription, message)
    })
}
