import { Router } from "express";

import webpush from "web-push";
if (!process.env.VAPID_PUBLICKEY || !process.env.VAPID_PRIVATEKEY)
  throw new Error("no VAPID keys found, please set env vars");
webpush.setVapidDetails(
  "mailto:admin@cesi-eats.fr",
  process.env.VAPID_PUBLICKEY,
  process.env.VAPID_PRIVATEKEY
);

const router = Router();
//Stub for AUTH, to remove later
router.post("/subscribe", (req, res) => {
  const subscription = req.body.subscription;
  res.status(201).json({});

  const payload = JSON.stringify({
    title: "UberCESI",
    body: "You will now recieve notifications",
  });

  webpush
    .sendNotification(subscription, payload)
    .catch((err) => console.error(err));
});

//test to send notification to specific customer
router.get("/sendNotificationTo/:type/:id", async (req, res) => {
  const payload = JSON.stringify({
    title: "test Push Notification",
    body: "content of push notification",
  });
  //get subscription from Database
  /*await webpush
      .sendNotification(sub, payload)
      .catch((err) => console.error(err));*/
  res.status(201).json({});
});

export default router;
