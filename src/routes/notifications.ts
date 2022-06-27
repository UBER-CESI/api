import { Router } from "express";
import { notify } from "../services/notifications"
const router = Router();
//Stub for AUTH, to remove later
router.post("/subscribe", (req, res) => {
    const subscription = req.body.subscription;
    res.status(201).json({});

    const payload = JSON.stringify({
        title: "UberCESI",
        body: "You will now recieve notifications",
    });


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
