const Footer = () => {
  return (
    <div className="bg-beige-100 w-full h-fit border-t border-border-light">
      <div className="flex flex-col gap-5 md:gap-0 md:grid grid-cols-1 md:grid-cols-3 items-center">
        <div className="flex flex-col items-center ">
          <img className="size-72" src="./timeslot.png" alt="" />
          <p className="font-bold text-text-primary">Customer Support</p>
          <p className="font-light text-text-secondary">0 123 123 23</p>
          <p className="font-bold text-md mt-5 text-caramel-500">
            support@timeslot.com
          </p>
        </div>
        <div className="flex flex-col gap-3 w-80">
          <h1 className="font-bold text-lg mb-5 text-text-primary">
            Corporate
          </h1>
          <p className="font-light text-text-secondary cursor-pointer hover:text-caramel-500 hover:underline transition">
            Corporate Membership Agreement
          </p>
          <p className="font-light text-text-secondary cursor-pointer hover:text-caramel-500 hover:underline transition">
            Distance Sales Agreement
          </p>
          <p className="font-light text-text-secondary cursor-pointer hover:text-caramel-500 hover:underline transition">
            Privacy Policy
          </p>
          <p className="font-light text-text-secondary cursor-pointer hover:text-caramel-500 hover:underline transition">
            Product Return Conditions
          </p>
          <p className="font-light text-text-secondary cursor-pointer hover:text-caramel-500 hover:underline transition">
            Cookie Policy
          </p>
          <p className="font-light text-text-secondary cursor-pointer hover:text-caramel-500 hover:underline transition">
            Commercial Electronic Message Consent
          </p>
        </div>
        <div className="flex flex-col gap-3 w-80">
          <h1 className="font-bold text-lg mb-5 text-text-primary">
            Customer Services
          </h1>
          <p className="font-light text-text-secondary cursor-pointer hover:text-caramel-500 hover:underline transition">
            Customer Service
          </p>
          <p className="font-light text-text-secondary cursor-pointer hover:text-caramel-500 hover:underline transition">
            My Account
          </p>
          <p className="font-light text-text-secondary cursor-pointer hover:text-caramel-500 hover:underline transition">
            Track Your Order
          </p>
          <p className="font-light text-text-secondary cursor-pointer hover:text-caramel-500 hover:underline transition">
            Contact
          </p>
          <p className="font-light text-text-secondary cursor-pointer hover:text-caramel-500 hover:underline transition">
            FAQ
          </p>
          <p className="font-light text-text-secondary cursor-pointer hover:text-caramel-500 hover:underline transition">
            Mobile Applications
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
