
import {
    Schema,
    model,
    ObjectId,
    Number,
    Types,
    Date,
} from "mongoose";

import { PushSubscription } from "web-push";

export interface IRestaurant {
    _id?: ObjectId;
    userId: Number;
    email: string;
    name: String;
    phoneNumber: string;
    address: string;
    subscription?: PushSubscription;
}

const restaurantsSchema = new Schema<IRestaurant>({
    userId: Number,
    email: String,
    name: String,
    phoneNumber: String,
    address: String,
    subscription: Object,
});


const Restaurant = model<IRestaurant>("Restaurant", restaurantsSchema);
export default Restaurant