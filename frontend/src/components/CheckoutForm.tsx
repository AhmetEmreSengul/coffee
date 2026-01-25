import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { useCartStore } from "../store/useCartStore";
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

const CheckoutForm = ({
  setView,
}: {
  setView: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const cart = useCartStore((s) => s.cart);
  const { authUser } = useAuthStore();

  const [cardComplete, setCardComplete] = useState({
    number: false,
    expiry: false,
    cvc: false,
  });

  const [loading, setLoading] = useState(false);

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const isDisabled =
    !stripe ||
    !elements ||
    loading ||
    !cardComplete.number ||
    !cardComplete.expiry ||
    !cardComplete.cvc ||
    !authUser;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isDisabled) return;

    setLoading(true);

    try {
      const cardElement = elements!.getElement(CardNumberElement);

      if (!cardElement) return;

      setView("checkout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-6">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Card Number</label>
        <div className="border border-caramel-400 rounded-xl px-4 py-3 bg-white focus-within:ring-2 focus-within:ring-caramel-400 transition">
          <CardNumberElement
            onChange={(e) =>
              setCardComplete((prev) => ({ ...prev, number: e.complete }))
            }
          />
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex flex-col gap-1 w-1/2">
          <label className="text-sm font-medium">Expiry Date</label>
          <div className="border border-caramel-400 rounded-xl px-4 py-3 bg-white focus-within:ring-2 focus-within:ring-caramel-400 transition">
            <CardExpiryElement
              onChange={(e) =>
                setCardComplete((prev) => ({ ...prev, expiry: e.complete }))
              }
            />
          </div>
        </div>

        <div className="flex flex-col gap-1 w-1/2">
          <label className="text-sm font-medium">CVC</label>
          <div className="border border-caramel-400 rounded-xl px-4 py-3 bg-white focus-within:ring-2 focus-within:ring-caramel-400 transition">
            <CardCvcElement
              onChange={(e) =>
                setCardComplete((prev) => ({ ...prev, cvc: e.complete }))
              }
            />
          </div>
        </div>
      </div>

      {!authUser && (
        <p className="text-red-400">You must be logged in to checkout.</p>
      )}
      <button
        type="submit"
        disabled={isDisabled}
        className={`py-2 rounded-lg font-medium transition ${
          isDisabled
            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
            : "bg-caramel-400 text-white hover:bg-caramel-400/80 cursor-pointer"
        }`}
      >
        {loading ? "Processing..." : `Pay ${totalPrice}₺`}
      </button>

      <p className="text-sm text-gray-500">
        Stripe test environment only - no payments will be processed
      </p>
    </form>
  );
};

export default CheckoutForm;
