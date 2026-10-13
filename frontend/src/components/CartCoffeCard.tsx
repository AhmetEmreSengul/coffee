import { useState } from "react";
import { FaMinus, FaPlus, FaTrashAlt } from "react-icons/fa";
import { useCartStore } from "../store/useCartStore";

interface CartCoffee extends Coffee {
  quantity: number;
}

interface CartCoffeeCardProps {
  coffee: CartCoffee;
}

const CartCoffeCard = ({ coffee }: CartCoffeeCardProps) => {
  const { decreaseQty, increaseQty, removeFromCart } = useCartStore();
  const [imageFailed, setImageFailed] = useState(false);
  const totalPrice = coffee.price * coffee.quantity;

  return (
    <div className="flex gap-3 rounded-xl border border-border-light bg-cream-50 p-3 shadow-sm sm:grid sm:grid-cols-[minmax(0,1fr)_auto_auto_auto] sm:items-center sm:gap-6 sm:p-4">
      <div className="flex min-w-0 flex-1 items-start gap-3 sm:items-center sm:gap-4">
        {imageFailed ? (
          <div
            role="img"
            aria-label={`Photo unavailable for ${coffee.title}`}
            className="flex size-20 shrink-0 items-center justify-center rounded-lg bg-beige-100 text-sm text-text-tertiary sm:size-24"
          >
            Café
          </div>
        ) : (
          <img
            className="size-20 shrink-0 rounded-lg border border-border-light bg-beige-100 object-cover sm:size-24"
            src={coffee.image}
            alt={coffee.title}
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
            <div className="min-w-0">
              <h2 className="wrap-break-word font-semibold text-text-primary sm:text-lg">
                {coffee.title}
              </h2>
              <p className="mt-1 text-sm text-text-tertiary">{coffee.type}</p>
            </div>
            <p className="shrink-0 text-sm font-medium tabular-nums text-text-secondary sm:hidden">
              ₺{coffee.price.toFixed(2)} each
            </p>
          </div>
          <p className="mt-2 hidden text-sm text-text-secondary sm:block">
            ₺{coffee.price.toFixed(2)} each
          </p>
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-end justify-between gap-3 sm:contents">
        <div
          aria-label={`Quantity for ${coffee.title}`}
          className="inline-flex min-h-10 items-center gap-1 rounded-lg border border-border-medium bg-bg-primary p-1"
        >
          <button
            type="button"
            aria-label={`Remove one ${coffee.title}`}
            disabled={!coffee._id}
            onClick={() => coffee._id && decreaseQty(coffee._id)}
            className="inline-flex size-9 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-beige-100 hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-caramel-500 disabled:cursor-not-allowed cursor-pointer"
          >
            <FaMinus aria-hidden="true" className="size-3" />
          </button>
          <span
            aria-live="polite"
            className="min-w-7 text-center text-sm font-semibold tabular-nums text-text-primary"
          >
            {coffee.quantity}
          </span>
          <button
            type="button"
            aria-label={`Add one ${coffee.title}`}
            disabled={!coffee._id || coffee.quantity >= 10}
            onClick={() => coffee._id && increaseQty(coffee._id)}
            className="inline-flex size-9 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-beige-100 hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-caramel-500 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
          >
            <FaPlus aria-hidden="true" className="size-3" />
          </button>
        </div>

        <div className="flex items-center gap-3 sm:contents">
          <p className="min-w-20 text-right text-sm font-semibold tabular-nums text-text-primary sm:text-base">
            ₺{totalPrice.toFixed(2)}
          </p>
          <button
            type="button"
            aria-label={`Remove ${coffee.title} from cart`}
            disabled={!coffee._id}
            onClick={() => coffee._id && removeFromCart(coffee._id)}
            className="inline-flex size-9 items-center justify-center rounded-md text-text-tertiary transition-colors hover:bg-red-50 hover:text-red-700 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-red-700 disabled:cursor-not-allowed sm:size-10"
          >
            <FaTrashAlt aria-hidden="true" className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartCoffeCard;
