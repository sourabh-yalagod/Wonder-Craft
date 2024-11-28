import {
  Home,
  ImageDown,
  Notebook,
  PhoneCall,
  Store,
  Subscript,
  User2Icon,
  Video,
} from "lucide-react";

export const useSideMenu = () => {
  const sideMenuData = [
    {
      id: 1,
      label: "Home",
      link: "/home",
      icon: <Home className="size-5 sm:size-6 md:size-7" />,
    },
    {
      id: 2,
      label: "My Store",
      link: "/store",
      icon: <Store className="size-5 sm:size-6 md:size-7" />,
    },
    {
      id: 3,
      label: "Videos",
      link: "/videos",
      icon: <Video className="size-5 sm:size-6 md:size-7" />,
    },
    {
      id: 4,
      label: "About",
      link: "/about",
      icon: <Notebook className="size-5 sm:size-6 md:size-7" />,
    },
    {
      id: 5,
      label: "Contact Us",
      link: "/contact",
      icon: <PhoneCall className="size-5 sm:size-6 md:size-7" />,
    },
    { id: 6, label: "Create Account", link: "/", icon: <User2Icon /> },
    {
      id: 7,
      label: "Subsription",
      link: "/subscription",
      icon: <Subscript className="size-5 sm:size-6 md:size-7" />,
    },
  ];
  return sideMenuData;
};