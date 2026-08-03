import React from "react";
import { Button } from "./button";
import hero1 from "../../assets/hero1.jpg";

const Hero = () => {
  return (
    <section
      className="relative pb-50 pt-20 overflow-hidden mt-15 bg-transparent py-23  mx-1 rounded-xl"
      style={{
        backgroundImage: `url(${hero1})`,
        backgroundSize: "cover",
        backgroundPosition: "right center",
        backgroundRepeat: "no-repeat",
        
      }}
    >
      {/* FULL overlay */}
      <div className="absolute inset-0 bg-linear-to-r from-black/50 via-black/30 to-transparent"> </div>

      {/* CONTENT */}
      <div className="relative max-w-7xl  px-6 md:px-12 lg:px-20 mt-6  ">
        <div className="max-w-xl">
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-linear-to-r from-[#cbec7f] to-[#db60bd] bg-clip-text text-transparent leading-tight">
            Discover Your Style with Our Trendy Collection .
          </h1>

          <p className="text-lg md:text-xl mb-6 text-[#000000]">
            Explore the latest fashion trends and find your perfect look with us.
          </p>

          <div className="flex gap-4">
            <Button className="bg-linear-to-tl from-[#2600ff] to-[#ff0080] hover:from-[#2d2ab9] hover:to-[#af3271] text-[#ffffff] cursor-pointer font-bold">
              Shop Now
            </Button>

            <Button variant="outline" className="font-bold hover:underline bg-linear-to-r from-[#da63da] to-[#8446c2] text-[#272727] hover:text-[#333333] border-[#000000] hover:bg-linear-to-r hover:from-[#ad3dad] hover:to-[#8042be] hover:cursor-pointer">
              View Deal !
            </Button>
          </div>

        </div>
      </div>
      
    </section>
  );
};

export default Hero;