import { Link } from "react-router-dom";
import CartCoffeCard from "../components/CartCoffeCard";
import { useCartStore } from "../store/useCartStore";

const Cart = () => {
  const { cart, decreaseQty, increaseQty } = useCartStore();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0,
  );

  return (
    <div className="pt-30 flex flex-col items-center justify-center mx-20">
      <h1 className="font-bold text-4xl">Cart</h1>

      <div className="flex flex-col gap-2 mt-10">
        {cart.length > 0 && (
          <div className="hidden md:flex w-full border-b  items-center justify-between">
            <p className="font-bold text-lg w-70 ">Product</p>
            <p className="font-bold text-lg mr-29 md:mr-1 text-center ">
              Quantity
            </p>
            <p className="font-bold text-lg">Total Price</p>
          </div>
        )}

        {cart.length === 0 ? (
          <div className="text-xl">
            No items in cart you can browse coffes from the{" "}
            <Link className="text-caramel-400 underline hover:text-caramel-300 transition" to="/menu">
              menu.
            </Link>{" "}
          </div>
        ) : (
          <div className="h-120 space-y-2 overflow-y-auto">
            {cart.map((item) => (
              <div key={item.id}>
                <CartCoffeCard coffee={item} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
