import { PushSubscription } from "web-push";
import { PushMessageBody, sendNotification } from "./notifications";
import Order from "../model/Order";
import Customer from "../model/Customer";
import Restaurant from "../model/Restaurant";
import Deliverer from "../model/Deliverer";

const options = { fullDocument: "updateLookup" };
Order.watch<{ subscriptions: PushSubscription, unsuspend: boolean, suspend: boolean }>([{ $project: { operationType: "$operationType", status: "$fullDocument.status", customerId: "$fullDocument.customerId" } }], options).on("change", async (change: any) => {
    console.log("OrderChange")
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

Order.watch<{ subscriptions: PushSubscription, unsuspend: boolean, suspend: boolean }>([{ $project: { operationType: "$operationType", status: "$fullDocument.status", restaurantId: "$fullDocument.restaurantId" } }], options).on("change", async (change: any) => {
    if (change.operationType !== "update") return
    if (change.status != "paid" && change.status != "delivered") return
    if (!change.restaurantId) return
    const message: PushMessageBody = { body: "" }
    if (change.status == "paid") {
        message.title = "Your recieved a new order from a customer"
        message.body = "and you are a restaurant"
    }
    if (change.status == "delivered") {
        message.title = "Your order is delivered"
        message.body = "and you are a restaurant"
    }
    const single = await Restaurant.findOne({ _id: change.customerId })
    if (!single || !single.subscription) return
    sendNotification(single.subscription, message)
})

Order.watch<{ subscriptions: PushSubscription, unsuspend: boolean, suspend: boolean }>([{ $project: { operationType: "$operationType", status: "$fullDocument.status", delivererId: "$fullDocument.delivererId" } }], options).on("change", async (change: any) => {
    if (change.operationType !== "update") return
    if (change.status != "prepared") return
    if (!change.delivererId) return
    const message: PushMessageBody = { body: "" }
    if (change.status == "prepared") {
        message.title = "You need to fetch an order from a restaurant!"
        message.body = "and you are a deliverer"
    }
    const single = await Deliverer.findOne({ _id: change.delivererId })
    if (!single || !single.subscription) return
    sendNotification(single.subscription, message)
})

export default {}