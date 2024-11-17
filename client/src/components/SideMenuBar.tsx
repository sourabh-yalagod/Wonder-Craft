import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

import { ModeToggle } from "./ModeToggler";
import { SideMenuTypes, useSideMenu } from "@/lib/SideMenuData";
import { useNavigate } from "react-router-dom";

const SideMenuBar = () => {
  const navigate = useNavigate();
  const sideMenuList = useSideMenu();
  return (
    <Sheet>
      <SheetTrigger>
        <Menu className="z-10" />
      </SheetTrigger>
      <SheetContent className="w-56 sm:w-60 md:w-72">
        <SheetHeader>
          <SheetTitle>
            <div className="flex justify-around gap-3">
              <p>Wonder Craft</p>
              <ModeToggle />
            </div>
          </SheetTitle>
          <ul className="mx-auto w-full sm:pl-3 md:pl-5 lg:pl-9 space-y-3">
            {sideMenuList?.map((menu: SideMenuTypes) => {
              return (
                <li
                  onClick={() => navigate(menu?.link)}
                  key={menu?.id}
                  className="flex gap-2 cursor-pointer items-center hover:scale-95 transition-all p-1 hover:bg-slate-700 hover:text-white rounded-lg"
                >
                  <div>{menu.icon}</div>
                  {menu.label}
                </li>
              );
            })}
          </ul>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default SideMenuBar;
