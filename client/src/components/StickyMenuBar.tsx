import { SideMenuTypes, useSideMenu } from "@/lib/SideMenuData";
import React from "react";
import { useNavigate } from "react-router-dom";

const StickyMenuBar = () => {
  const menuItems = useSideMenu();
  const navigate = useNavigate();
  return (
    <div className="w-16 z-10 hover:bg-slate-600 hover:bg-opacity-20 hidden sm:block hover:w-48 border-r fixed top-[56px] inset-x-0 p-3 border-b inset-y-0 transition-width duration-300 group">
      <ul className="space-y-5">
        {menuItems.map((menu: SideMenuTypes) => {
          return (
            <li
              onClick={() => navigate(menu.link)}
              className="flex transition-none hover:text-white items-center cursor-pointer hover:bg-slate-700 p-1 rounded-lg gap-3"
              key={menu.id}
            >
              <div>{menu.icon}</div>
              {/* Label slides in from the left when the parent div is hovered */}
              <div className="transform transition-all duration-300 opacity-0 -translate-x-5 group-hover:opacity-100 group-hover:translate-x-0">
                {menu.label}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default StickyMenuBar;
