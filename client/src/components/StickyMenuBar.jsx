import { useSideMenu } from "@/lib/SideMenuData";
import React from "react";
import { useNavigate } from "react-router-dom";
import { ModeToggle } from "./ModeToggler";

const StickyMenuBar = () => {
  const menuItems = useSideMenu();
  const navigate = useNavigate();
  return (
    <div className="w-16 z-10 hover:bg-slate-900 rounded-r-xl hover:bg-opacity-20 hidden sm:block hover:w-48 fixed top-[56px] p-3 dark:border-r inset-y-0 transition-width duration-300 group">
      <ul className="space-y-5 ">
        {menuItems.map((menu) => {
          return (
            <li
              onClick={() => navigate(menu.link)}
              className="flex transition-none hover:text-white items-center cursor-pointer hover:bg-slate-700 p-1 rounded-lg gap-3"
              key={menu.id}
            >
              <div>{menu.icon}</div>
              <div className="transform transition-all duration-300 opacity-0 -translate-x-5 group-hover:opacity-100 group-hover:translate-x-0">
                {menu.label}
              </div>
            </li>
          );
        })}
        <li className="absolute bottom-2">
          <ModeToggle />
        </li>
      </ul>
    </div>
  );
};

export default StickyMenuBar;
