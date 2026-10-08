import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border-light bg-beige-100 px-4 py-10 sm:px-6 md:px-10 md:py-14">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr] lg:gap-16">
          <div className="max-w-sm">
            <Link
              to="/"
              aria-label="Time Slot Café home"
              className="inline-flex items-center gap-3"
            >
              <img className="size-14" src="/timeslot.png" alt="" />
              <span className="font-serif text-2xl text-text-primary">
                Time Slot Café
              </span>
            </Link>
            <p className="mt-4 leading-7 text-text-secondary">
              A little space to slow down, enjoy a good coffee, and make the
              moment your own.
            </p>
          </div>

          <nav aria-label="Explore the café">
            <h2 className="mb-4 font-semibold text-text-primary">Explore</h2>
            <ul className="space-y-3">
              <li>
                <Link
                  className="text-text-secondary transition-colors hover:text-caramel-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-caramel-500"
                  to="/menu"
                >
                  Menu
                </Link>
              </li>
              <li>
                <Link
                  className="text-text-secondary transition-colors hover:text-caramel-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-caramel-500"
                  to="/book-table"
                >
                  Book a table
                </Link>
              </li>
              <li>
                <Link
                  className="text-text-secondary transition-colors hover:text-caramel-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-caramel-500"
                  to="/cart"
                >
                  Your cart
                </Link>
              </li>
              <li>
                <Link
                  className="text-text-secondary transition-colors hover:text-caramel-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-caramel-500"
                  to="/my-bookings"
                >
                  My bookings
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <h2 className="mb-4 font-semibold text-text-primary">Say hello</h2>
            <ul className="space-y-3 text-text-secondary">
              <li>
                <a
                  className="transition-colors hover:text-caramel-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-caramel-500"
                  href="tel:012312323"
                >
                  0 123 123 23
                </a>
              </li>
              <li>
                <a
                  className="transition-colors hover:text-caramel-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-caramel-500"
                  href="mailto:support@timeslot.com"
                >
                  support@timeslot.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border-medium pt-5 text-sm text-text-tertiary">
          © {new Date().getFullYear()} Time Slot Café
        </div>
      </div>
    </footer>
  );
};

export default Footer;
