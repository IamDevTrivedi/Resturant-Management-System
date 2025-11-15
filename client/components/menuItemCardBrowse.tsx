import React from "react";
import { Card } from "@/components/ui/card";

type MenuItem = {
  _id: string;
  dishName: string;
  description?: string;
  price: number;
  imageURL?: string;
  foodType?: "veg" | "non-veg" | "vegan" | "egg";
  isAvailable?: boolean;
};

const FoodTypeDot: React.FC<{ type?: MenuItem["foodType"] }> = ({ type }) => {
  const colors: Record<string, string> = {
    veg: "bg-green-500",
    "non-veg": "bg-red-500",
    vegan: "bg-emerald-500",
    egg: "bg-yellow-500",
  };

  return (
    <span
      className={`inline-block w-3 h-3 rounded-full ${
        type ? colors[type] : "bg-gray-400"
      }`}
    ></span>
  );
};

const MenuItemCard: React.FC<{ item: MenuItem }> = ({ item }) => {
  const unavailable = item.isAvailable === false;

  return (
    <div className="relative group w-fit">
      <Card
        className={`
          min-w-[200px] h-[220px] rounded-xl overflow-hidden relative 
          shadow-md transition-all duration-300
          ${unavailable ? "opacity-60" : "cursor-pointer hover:shadow-xl"}
        `}
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={item.imageURL}
            alt={item.dishName}
            className={`
              w-full h-full object-cover transition-transform duration-500
              ${unavailable ? "" : "group-hover:scale-110"}
            `}
          />
        </div>

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

        {/* RED UNAVAILABLE LABEL */}
        {unavailable && (
          <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full z-20">
            Unavailable
          </div>
        )}

        {/* Normal content (bottom area) */}
        <div className="absolute bottom-0 left-0 w-full p-3 text-white z-20">
          {/* Food Tag */}
          <div className="flex items-center gap-2 mb-1">
            <FoodTypeDot type={item.foodType} />
            <span className="text-xs opacity-90">{item.foodType}</span>
          </div>

          <h3 className="text-lg font-semibold leading-tight">{item.dishName}</h3>
        </div>

        {/* Description Hover Popup (ONLY if available) */}
        {!unavailable && item.description && (
          <div
            className="
              absolute bottom-0 left-0 w-full px-3 py-2 text-white text-sm
              bg-black/70 backdrop-blur-sm
              translate-y-full group-hover:translate-y-0
              transition-all duration-300 z-30
            "
          >
            {item.description}
          </div>
        )}
      </Card>
    </div>
  );
};

export default MenuItemCard;
