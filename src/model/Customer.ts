import {
    Schema,
    model,
    ObjectId,
    Number,
    Types,
} from "mongoose";

import { PushSubscription } from "web-push";

interface ICustomer {
    _id?: Types.ObjectId;
    userId: Number;
    email: string;
    nickname: string;
    firstname: string;
    lastname: string;
    phoneNumber: string;
    suspendedAt?: Date;
    subscription?: PushSubscription;
}

const usersSchema = new Schema<ICustomer>({
    userId: Number,
    email: String,
    nickname: String,
    firstname: String,
    lastname: String,
    phoneNumber: String,
    suspendedAt: Date,
    subscription: Object,
});
const Customer = model<ICustomer>("Customer", usersSchema);
export default Customer