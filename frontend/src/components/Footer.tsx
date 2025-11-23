const Footer = () => {
  return (
    <div className="bg-amber-900/20 w-full h-100">
      <div className="grid grid-cols-1 md:grid-cols-3 items-center">
        <div className="flex flex-col items-center ">
          <img className="size-72" src="./timeslot.png" alt="" />
          <p className="font-bold">Customer Support</p>
          <p className="font-light">0 123 123 23</p>
          <p className="font-bold text-md mt-5">support@timeslot.com</p>
        </div>
        <div className="flex flex-col  gap-3">
          <h1 className="font-bold text-lg mb-5">Corporate</h1>
          <p className="font-light cursor-pointer hover:underline">
            Corporate Membership Agreement
          </p>
          <p className="font-light cursor-pointer hover:underline">
            Distance Sales Agreement
          </p>
          <p className="font-light cursor-pointer hover:underline">
            Privacy Policy
          </p>
          <p className="font-light cursor-pointer hover:underline">
            Product Return Conditions
          </p>
          <p className="font-light cursor-pointer hover:underline">
            Cookie Policy
          </p>
          <p className="font-light cursor-pointer hover:underline">
            Commercial Electronic Message Consent
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <h1 className="font-bold text-lg mb-5">Customer Services</h1>
          <p className="font-light cursor-pointer hover:underline">
            Customer Service
          </p>
          <p className="font-light cursor-pointer hover:underline">
            My Account
          </p>
          <p className="font-light cursor-pointer hover:underline">
            Track Your Order
          </p>
          <p className="font-light cursor-pointer hover:underline">Contact</p>
          <p className="font-light cursor-pointer hover:underline">FAQ</p>
          <p className="font-light cursor-pointer hover:underline">
            Mobile Applications
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
