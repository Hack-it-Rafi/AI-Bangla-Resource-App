import { useState } from "react";
import RealHome from "./RealHome";

const AllHome = () => {
  const [activeMenuItem, setActiveMenuItem] = useState("home");

  const menuItems = [
    { name: "Home", id: "home" },
    { name: "Uploads", id: "upload" },
    { name: "Settings", id: "settings" },
    { name: "Help", id: "help" },
  ];

  return (
    <div className="flex min-h-screen bg-black">
      <div className="w-64 bg-black shadow-lg">
        <div className="p-4 text-white text-2xl font-bold">Menu</div>
        <ul>
          {menuItems.map((item) => (
            <li
              key={item.id}
              className={`p-4 cursor-pointer text-white ${
                activeMenuItem === item.id ? "bg-[#F7F7F7] text-[#6A1E55]" : "hover:bg-gray-600 "
              }`}
              onClick={() => setActiveMenuItem(item.id)}
            >
              {item.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-grow p-8 bg-black text-white">
        {activeMenuItem === "home" && <RealHome></RealHome>}
        {activeMenuItem === "upload" && <div>Upload Section</div>}
        {activeMenuItem === "settings" && <div>Settings Section</div>}
        {activeMenuItem === "help" && <div>Help Section</div>}
      </div>
    </div>
  );
};

export default AllHome;
