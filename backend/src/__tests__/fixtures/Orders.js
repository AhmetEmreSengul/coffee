import { testCoffee } from "./Coffees";
import { userId } from "./Users";

export const orderPayload = {
  orderItems: [
    {
      _id: testCoffee._id,
      title: "Latte",
      type: "Hot Coffee",
      quantity: 2,
      image: "latte.jpg",
      price: 120,
    },
  ],
  orderNote: "Less sugar",
};

export const testOrder = {
  _id: "6a66987b6ae3d09310fd50c6",
  user: userId,
  orderItems: [
    {
      _id: testCoffee._id,
      title: "Latte",
      type: "Hot Coffee",
      quantity: 2,
      image: "latte.jpg",
      price: 120,
    },
  ],
  totalPrice: 240,
  orderNote: "Less sugar",
};

export const stripePayload = {
  items: [
    {
      id: testCoffee._id,
      quantity: 2,
    },
  ],
};
