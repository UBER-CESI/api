import webpush from "web-push";
import { PushSubscription } from "web-push";
if (!process.env.VAPID_PUBLICKEY || !process.env.VAPID_PRIVATEKEY)
    throw new Error("no VAPID keys found, please set env vars");
webpush.setVapidDetails(
    "mailto:admin@cesi-eats.fr",
    process.env.VAPID_PUBLICKEY,
    process.env.VAPID_PRIVATEKEY
);

export function notify() {

}