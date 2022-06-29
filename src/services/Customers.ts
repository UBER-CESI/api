import { PushSubscription } from "web-push";
import { PushMessageBody, sendNotification } from "./notifications";
import Customer from "../model/Customer";

const options = { fullDocument: "updateLookup" };
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

export default {}