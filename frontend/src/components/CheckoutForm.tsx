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
import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useOrderStore } from "../store/useOrderStore";

const CheckoutForm = ({
  setView,
}: {
  setView: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [orderNote, setOrderNote] = useState("");
  const stripe = useStripe();
  const elements = useElements();
  const { cart, clearCart } = useCartStore();
  const { createOrder } = useOrderStore();
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

  const handlePayment = async () => {
    if (isDisabled) return;
    setLoading(true);

    try {
      const res = await axiosInstance.post("/stripe/create-payment-intent", {
        items: cart.map((item) => ({
          id: item._id,
          quantity: item.quantity,
        })),
      });

      const { clientSecret } = res.data;

      const cardElement = elements?.getElement(CardNumberElement);

      if (!cardElement) return;

      const result = await stripe!.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            email: authUser.email,
          },
        },
      });

      if (result.error) {
        console.error(result.error.message);
        toast.error(result.error.message);
        return false;
      }

      return true;
    } catch (err: any) {
      console.error("Payment error:", err);
      toast.error(err.response?.data?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handlePayment();
    await createOrder(cart, totalPrice, orderNote);
    setView("checkout");
    clearCart();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-6">
      <textarea
        className="border border-caramel-400 rounded-lg p-3 mt-6 w-full min-h-30 max-h-30"
        placeholder="Order Note"
        value={orderNote}
        onChange={(e) => setOrderNote(e.target.value)}
      />

      <div className="mt-5">
        <p>
          For testing enter
          <span className="text-gray-400 font-mono font-bold mx-1">
            4242 4242 4242 4242
          </span>
          for the card number.
        </p>
        <p>Enter a future date and any CVC for for the rest.</p>
      </div>
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
        {loading ? (
          <span className="inline-flex items-center gap-2">
            Processing <AiOutlineLoading3Quarters className="animate-spin" />
          </span>
        ) : (
          `Pay ${totalPrice}₺`
        )}
      </button>

      <p className="text-sm text-gray-500">
        Stripe test environment only - no payments will be processed
      </p>
    </form>
  );
};

export default CheckoutForm;
