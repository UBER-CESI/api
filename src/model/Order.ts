
import {
    Schema,

    model,
    ObjectId,
    Number,
    Types,
    Date,
} from "mongoose";

export interface IOrder {
    _id?: ObjectId;
    restaurantId: Types.ObjectId;
    customerId: Types.ObjectId;
    delivererId: Types.ObjectId;
    totalPrice: Number;
    tipAmount: Number;
    items: Array<any>;
    date: Date;
}

const ordersSchema = new Schema<IOrder>({
    /*restaurantId: { type: Schema.Types.ObjectId, ref: "Restaurant" },
    customerId: { type: Schema.Types.ObjectId, ref: "Customer" },
    delivererId: { type: Schema.Types.ObjectId, ref: "Deliverer" },*/
    restaurantId: String,
    customerId: String,
    delivererId: String,
    totalPrice: Number,
    items: Array<any>,
    date: Date
})
const Order = model<IOrder>("Order", ordersSchema);
export default Order