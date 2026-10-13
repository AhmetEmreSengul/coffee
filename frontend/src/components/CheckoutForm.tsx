import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useCartStore } from "../store/useCartStore";
import { useAuthStore } from "../store/useAuthStore";
import { useOrderStore } from "../store/useOrderStore";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";

interface CheckoutFormProps {
  setView: React.Dispatch<React.SetStateAction<string>>;
}

const CheckoutForm = ({ setView }: CheckoutFormProps) => {
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
    cart.length === 0 ||
    !cardComplete.number ||
    !cardComplete.expiry ||
    !cardComplete.cvc ||
    !authUser;

  const handlePayment = async () => {
    if (isDisabled || !stripe || !elements || !authUser) return;
    setLoading(true);

    try {
      const res = await axiosInstance.post("/stripe/create-payment-intent", {
        items: cart.map((item) => ({
          id: item._id,
          quantity: item.quantity,
        })),
      });

      const { clientSecret } = res.data;
      const cardElement = elements.getElement(CardNumberElement);

      if (!cardElement) {
        toast.error("Card details are unavailable. Please try again.");
        return;
      }

      const result = await stripe.confirmCardPayment(clientSecret, {
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

      return result.paymentIntent.id;
    } catch (err: unknown) {
      console.error("Payment error:", err);
      const message =
        err instanceof Error ? err.message : "Payment could not be completed.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const paymentIntentId = await handlePayment();
      if (!paymentIntentId) return;
      await createOrder(cart, orderNote, paymentIntentId);
      if (authUser?.isBanned === false) {
        setView("checkout");
      }
      clearCart();
    } catch (error) {
      console.error(error);
      toast.error("Checkout failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-5">
      <div>
        <label
          htmlFor="order-note"
          className="mb-2 block text-sm font-medium text-text-primary"
        >
          Order Note
          <span
            aria-hidden="true"
            className="ml-2 font-normal text-text-tertiary"
          >
            Optional
          </span>
        </label>
        <textarea
          id="order-note"
          className="min-h-24 w-full resize-y rounded-lg border border-border-medium bg-cream-50 p-3 leading-6 text-text-primary placeholder:text-text-tertiary transition focus:border-caramel-500 focus:outline-none focus:ring-2 focus:ring-caramel-200"
          placeholder="Anything we should know about your order?"
          value={orderNote}
          onChange={(e) => setOrderNote(e.target.value)}
        />
      </div>

      <div className="border-t border-border-light pt-5">
        <h3 className="font-semibold text-text-primary">Payment details</h3>
        <p className="mt-1 text-sm leading-6 text-text-secondary">
          Card details are securely handled by Stripe.
        </p>
        <div className="mt-5 text-xs">
          <p>
            For testing enter
            <span className="text-gray-400 font-mono font-bold mx-1">
              4242 4242 4242 4242
            </span>
            for the card number.
          </p>
          <p>Enter a future date and any CVC for for the rest.</p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="card-number-field"
          className="text-sm font-medium text-text-primary"
        >
          Card number
        </label>
        <div
          id="card-number-field"
          data-testid="card-number"
          className="rounded-lg border border-border-medium bg-cream-50 px-3 py-3 transition focus-within:border-caramel-500 focus-within:ring-2 focus-within:ring-caramel-200"
        >
          <CardNumberElement
            options={{
              placeholder: "4242 4242 4242 4242",
            }}
            onChange={(e) =>
              setCardComplete((prev) => ({ ...prev, number: e.complete }))
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex min-w-0 flex-col gap-2">
          <label
            htmlFor="card-expiry-field"
            className="text-sm font-medium text-text-primary"
          >
            Expiry date
          </label>
          <div
            id="card-expiry-field"
            data-testid="card-expiry"
            className="min-w-0 rounded-lg border border-border-medium bg-cream-50 px-3 py-3 transition focus-within:border-caramel-500 focus-within:ring-2 focus-within:ring-caramel-200"
          >
            <CardExpiryElement
              options={{ placeholder: "MM / YY" }}
              onChange={(e) =>
                setCardComplete((prev) => ({ ...prev, expiry: e.complete }))
              }
            />
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-2">
          <label
            htmlFor="card-cvc-field"
            className="text-sm font-medium text-text-primary"
          >
            Security code
          </label>
          <div
            id="card-cvc-field"
            data-testid="card-cvc"
            className="min-w-0 rounded-lg border border-border-medium bg-cream-50 px-3 py-3 transition focus-within:border-caramel-500 focus-within:ring-2 focus-within:ring-caramel-200"
          >
            <CardCvcElement
              options={{  placeholder: "CVC" }}
              onChange={(e) =>
                setCardComplete((prev) => ({ ...prev, cvc: e.complete }))
              }
            />
          </div>
        </div>
      </div>

      {!authUser && (
        <p
          role="status"
          className="rounded-lg border border-caramel-200 bg-caramel-100 px-3 py-3 text-sm leading-6 text-text-secondary"
        >
          <Link
            to="/login"
            className="font-semibold text-caramel-500 underline underline-offset-2 hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-caramel-500"
          >
            Log in
          </Link>{" "}
          to continue to checkout.
        </p>
      )}

      <button
        type="submit"
        disabled={isDisabled}
        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-caramel-500 px-5 py-3 font-semibold text-cream-50 transition-colors hover:bg-text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-caramel-500 disabled:cursor-not-allowed disabled:bg-beige-300 disabled:text-text-tertiary"
      >
        {loading ? (
          <span role="status" className="inline-flex items-center gap-2">
            <AiOutlineLoading3Quarters
              aria-hidden="true"
              className="size-4 animate-spin"
            />
            Processing payment…
          </span>
        ) : (
          `Pay ${totalPrice}₺`
        )}
      </button>

      <p className="text-center text-xs leading-5 text-text-tertiary">
        Stripe test environment only — no payments will be processed.
      </p>
    </form>
  );
};

export default CheckoutForm;
