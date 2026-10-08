import { IoMdCart } from "react-icons/io";
import { useCartStore } from "../store/useCartStore";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";
import { useState } from "react";
import { FaMugHot } from "react-icons/fa";

interface CoffeeCardProps {
  coffee: Coffee;
  variant?: "default" | "featured";
}

const CoffeeCard = ({ coffee, variant = "default" }: CoffeeCardProps) => {
  const { addToCart, increaseQty, decreaseQty, cart } = useCartStore();
  const [imageFailed, setImageFailed] = useState(false);

  const cartItem = cart.find((item) => item._id === coffee._id);
  const isFeatured = variant === "featured";

  return (
    <article
      className={
        isFeatured
          ? "group flex h-full flex-col overflow-hidden rounded-xl border border-border-light bg-cream-50 shadow-sm transition-shadow hover:shadow-lg"
          : "mt-10 flex flex-col items-center justify-center rounded-3xl border border-border-light bg-beige-100 p-6 shadow-2xl"
      }
    >
      <div
        className={
          isFeatured
            ? "flex h-full flex-col"
            : "flex h-120 w-70 flex-col items-center rounded-xl"
        }
      >
        <div
          className={
            isFeatured
              ? "relative overflow-hidden bg-beige-100"
              : "flex flex-col items-center"
          }
        >
          {imageFailed ? (
            <div
              role="img"
              aria-label={`Photo unavailable for ${coffee.title}`}
              className="flex size-63 md:size-70 w-full flex-col items-center justify-center gap-2 bg-beige-100 text-text-tertiary"
            >
              <FaMugHot aria-hidden="true" className="size-10" />
              <span className="text-sm">Made for a slower moment</span>
            </div>
          ) : (
            <img
              className={
                isFeatured
                  ? "h-64 w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  : `size-63 rounded-lg border-2 md:size-70 ${
                      coffee.type === "Cold"
                        ? "border-dusty-blue-300"
                        : "border-caramel-300"
                    }`
              }
              src={coffee.image}
              alt={`${coffee.title} coffee`}
              loading={isFeatured ? "lazy" : undefined}
              onError={() => setImageFailed(true)}
            />
          )}
          {isFeatured && (
            <span className="absolute bottom-3 left-3 rounded-full bg-cream-50/95 px-3 py-1 text-xs font-medium text-text-secondary">
              {coffee.type}
            </span>
          )}
        </div>
        <div
          className={
            isFeatured
              ? "flex flex-1 flex-col p-5"
              : "mt-5 flex flex-col gap-5 p-3 md:p-0"
          }
        >
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-medium text-text-primary">{coffee.title}</h3>
            <p className="shrink-0 font-semibold text-text-primary">
              ₺{coffee.price}
            </p>
          </div>
          <p
            className={
              isFeatured
                ? "mt-3 line-clamp-3 min-h-18 leading-6 text-text-secondary"
                : "h-20 font-light text-text-secondary"
            }
          >
            {coffee.description}
          </p>
          {!cartItem ? (
            <button
              type="button"
              aria-label={`Add ${coffee.title} to cart`}
              onClick={() => addToCart(coffee)}
              className={
                isFeatured
                  ? "mt-auto inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-beige-200 px-4 py-2 font-medium text-text-primary transition-colors hover:bg-caramel-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-caramel-500"
                  : "mt-auto flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-beige-400 p-2 transition hover:bg-beige-400/70"
              }
            >
              <IoMdCart className="size-5" /> Add to Cart
            </button>
          ) : (
            <div
              className={
                isFeatured
                  ? "mt-auto flex min-h-11 w-full items-center justify-center gap-8 rounded-lg bg-beige-200 px-3 py-1"
                  : "mt-auto flex w-full cursor-pointer flex-row items-center justify-center gap-10 rounded-full bg-beige-400 p-2 transition hover:bg-beige-400/70"
              }
            >
              <button
                type="button"
                aria-label={`Remove one ${coffee.title} from cart`}
                onClick={() => decreaseQty(coffee._id!)}
                className="cursor-pointer rounded-full text-xl font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-caramel-500"
              >
                <CiCircleMinus className="size-7" />
              </button>
              <span className="font-semibold" aria-live="polite">
                {cartItem.quantity}
              </span>
              <button
                type="button"
                aria-label={`Add one ${coffee.title} to cart`}
                onClick={() => increaseQty(coffee._id!)}
                className="cursor-pointer rounded-full text-xl font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-caramel-500"
              >
                <CiCirclePlus className="size-7" />
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default CoffeeCard;
