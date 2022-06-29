
import {
    Schema,
    model,
    ObjectId,
    Number,
    Types,
    Date,
} from "mongoose";

import { PushSubscription } from "web-push";

interface IDeliverer {
    _id?: ObjectId;
    userId: Number;
    email: string;
    nickname: string;
    firstname: string;
    lastname: string;
    phoneNumber: string;
    suspendedAt?: Date;
    subscription?: PushSubscription;
}

const usersSchema = new Schema<IDeliverer>({
    userId: Number,
    email: String,
    nickname: String,
    firstname: String,
    lastname: String,
    phoneNumber: String,
    suspendedAt: Date,
    subscription: Object,
});


const Deliverer = model<IDeliverer>("Deliverer", usersSchema);
export default Deliverer