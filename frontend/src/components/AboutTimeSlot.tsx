const AboutTimeSlot = () => {
  return (
    <div className="flex flex-col-reverse md:flex-row min-h-screen justify-center mt-20">
      <img className=" md:h-155 md:w-[1700px] " src="./shop.png" alt="" />
      <div className="flex flex-col w-full h-155 bg-beige-50 ">
        <div className="my-auto">
          <h1 className="text-3xl mt-10 md:text-6xl md:mt-0 flex gap-2 mb-10 ml-20 font-medium tracking-tight text-text-primary leading-tight font-serif text-center">
            The Time Slot <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-caramel-400 to-caramel-500 text-center italic">
              Café
            </span>
          </h1>
          <p className=" p-5 md:pr-60 md:ml-20 text-lg font-light text-text-secondary">
            At The Time Slot, we believe great moments deserve their own space.
            That's why we've reimagined the café experience around something
            simple: time. Book your slot, step into a calm and cozy atmosphere,
            and enjoy handcrafted drinks without the rush or the wait. Whether
            you're here to unwind, create, or catch up with someone special,
            your time is truly yours.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutTimeSlot;
