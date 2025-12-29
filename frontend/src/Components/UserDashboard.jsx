import React, { useRef } from "react";
import Navbar from "./Navbar";
import { categories } from "../categories";
import CategoryCard from "./CategoryCard";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useSelector } from "react-redux";
import useGetShopByCity from "../hooks/useGetShopByCity";
import FoodCard from "./FoodCard";

const UserDashboard = () => {
  // 1. Hook ko call karein
  useGetShopByCity();

  // 2. State se currentCity aur shopInMyCity dono lein
  // Dhyan dein: Agar shopInMyCity null hai toh default khali array [] dein
  const { currentCity, shopInMyCity, itemsInMyCity } = useSelector(
    (state) => state.user
  );

  const categoryRef = useRef(null);
  const shopRef = useRef(null);
  const itemRef = useRef(null);
  const handleScroll = (ref, direction) => {
    if (ref && ref.current) {
      const scrollAmount = 350;
      ref.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-[#fafafa] overflow-y-auto pb-20">
      <Navbar />

      {/* SECTION 1: CATEGORIES */}
      <div className="w-full max-w-7xl flex flex-col gap-4 p-4 sm:p-6 pt-24 relative">
        <h1 className="text-gray-900 text-xl sm:text-3xl font-black tracking-tight">
          Inspiration for your first order
        </h1>
        <div className="relative w-full group">
          <button
            onClick={() => handleScroll(categoryRef, "left")}
            className="absolute left-[-15px] top-1/2 -translate-y-1/2 z-20 bg-white shadow-md p-3 rounded-full hover:bg-[#ff4d2d] hover:text-white transition-all"
          >
            <FaChevronLeft />
          </button>
          <div
            ref={categoryRef}
            className="w-full flex gap-4 sm:gap-6 overflow-x-auto py-4 scrollbar-hide scroll-smooth snap-x"
          >
            {categories.map((cate, index) => (
              <div key={index} className="snap-center">
                <CategoryCard category={cate.category} image={cate.image} />
              </div>
            ))}
          </div>
          <button
            onClick={() => handleScroll(categoryRef, "right")}
            className="absolute right-[-15px] top-1/2 -translate-y-1/2 z-20 bg-white shadow-md p-3 rounded-full hover:bg-[#ff4d2d] hover:text-white transition-all"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

      {/* SECTION 2: RESTAURANTS */}
      <div className="w-full max-w-7xl flex flex-col gap-4 p-4 sm:p-6 relative">
        <h1 className="text-gray-900 text-xl sm:text-3xl font-black tracking-tight">
          Top Restaurants in{" "}
          <span className="text-[#ff4d2d] capitalize">{currentCity}</span>
        </h1>

        <div className="relative w-full group">
          {/* Agar array mein data hai tabhi arrows aur list dikhao */}
          {shopInMyCity && shopInMyCity.length > 0 ? (
            <>
              <button
                onClick={() => handleScroll(shopRef, "left")}
                className="absolute left-[-15px] top-1/2 -translate-y-1/2 z-20 bg-white shadow-md p-3 rounded-full hover:bg-[#ff4d2d] hover:text-white transition-all"
              >
                <FaChevronLeft />
              </button>

              <div
                ref={shopRef}
                className="w-full flex gap-6 overflow-x-auto py-6 scrollbar-hide scroll-smooth snap-x"
              >
                {shopInMyCity.map((shop, index) => (
                  <div key={shop._id || index} className="snap-center">
                    <CategoryCard
                      category={shop.name} // Console screenshot se: 'name'
                      image={shop.ImageUrl} // Console screenshot se: 'ImageUrl'
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleScroll(shopRef, "right")}
                className="absolute right-[-15px] top-1/2 -translate-y-1/2 z-20 bg-white shadow-md p-3 rounded-full hover:bg-[#ff4d2d] hover:text-white transition-all"
              >
                <FaChevronRight />
              </button>
            </>
          ) : (
            <div className="w-full py-10 text-center border-2 border-dashed border-gray-200 rounded-[2rem]">
              <p className="text-gray-400 font-bold italic">
                {shopInMyCity === null
                  ? "Data fetch ho raha hai..."
                  : `Afsos! ${currentCity} mein koi restaurant nahi mila.`}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="w-full max-w-7xl flex flex-col gap-4 p-4 sm:p-6 relative">
        <h1 className="text-gray-900 text-xl sm:text-3xl font-black tracking-tight">
          Suggested food Item
        </h1>

        <div className="relative w-full group">
          {/* Agar array mein data hai tabhi arrows aur list dikhao */}
          {itemsInMyCity && itemsInMyCity.length > 0 ? (
            <>
              <button
                onClick={() => handleScroll(itemRef, "left")}
                className="absolute left-[-15px] top-1/2 -translate-y-1/2 z-20 bg-white shadow-md p-3 rounded-full hover:bg-[#ff4d2d] hover:text-white transition-all"
              >
                <FaChevronLeft />
              </button>

              <div
                ref={itemRef}
                className="w-full flex gap-6 overflow-x-auto py-6 scrollbar-hide scroll-smooth snap-x"
              >
                {itemsInMyCity.map((item, index) => (
                  <div>
                    <FoodCard key={index} data={item} />
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleScroll(itemRef, "right")}
                className="absolute right-[-15px] top-1/2 -translate-y-1/2 z-20 bg-white shadow-md p-3 rounded-full hover:bg-[#ff4d2d] hover:text-white transition-all"
              >
                <FaChevronRight />
              </button>
            </>
          ) : (
            <div className="w-full py-10 text-center border-2 border-dashed border-gray-200 rounded-[2rem]">
              <p className="text-gray-400 font-bold italic">
                {itemsInMyCity === null
                  ? "Data fetch ho raha hai..."
                  : `Afsos! ${currentCity} mein koi dish nahi mila.`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
