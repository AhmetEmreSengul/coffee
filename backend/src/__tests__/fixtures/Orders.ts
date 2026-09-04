import { testCoffee } from "./Coffees.js";
import { userId } from "./Users.js";

export const orderPayload = {
  orderItems: [
    {
      _id: testCoffee._id,
      title: "Latte",
      type: "Hot",
      quantity: 2,
      image: "latte.jpg",
      description : "Fake description",
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
      type: "Hot",
      quantity: 2,
      image: "latte.jpg",
      description : "Fake description",
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
