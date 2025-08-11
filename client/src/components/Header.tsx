import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import {
  UserIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { UserIcon as UserIconSolid } from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";
import SearchInterface from "./SearchInterface";
import { useNavigate } from "react-router-dom";
import CustomDialog from "./CustomDialog";
import API_BASE_URL from "../config";
import getUserRole from "../utils/getUserRole";
import { useAuth } from "../context/AuthContext";
import CartIconWithBadge from "./CartIconWithBadge";
import ButtonSecond from "./ButtonSecond";
import { Accordion } from '@ark-ui/react/accordion';
// import { ChevronDownIcon } from 'lucide-react';
import { Menu } from '@ark-ui/react/menu';
import {
  ChevronRightIcon,
  ChevronDownIcon,
  CreditCardIcon,
  LogOutIcon,
  MailIcon,
  MessageSquareIcon,
  PlusCircleIcon,
  SettingsIcon,
  // UserIcon,
  UserPlusIcon,
} from 'lucide-react';
import Button from "./Button";


type Subcategory = {
  id: string;
  subcategory_name: string;
};

type Category = {
  id: string;
  category_name: string;
  subcategories?: Subcategory[];
};

const Header: React.FC = () => {
  const [searchMenuOpen, setSearchMenuOpen] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate();
  const toggleSearch = () => setSearchMenuOpen((open) => !open);
  const [openCategoryId, setOpenCategoryId] = useState<string | null>(null);

  // const toggleCategory = (categoryId: string) => {
  //   setOpenCategoryId((prev) => (prev === categoryId ? null : categoryId));
  // };
  const toggleCategory = (id: string) => {
    setOpenCategoryId(openCategoryId === id ? null : id);
  }

  const role = getUserRole();
  const { isAuthenticated } = useAuth();

  // const handleLogOut = () => {
  //   logout();
  //   console.log("User logged out");
  //   setIsOpen(true);
  // };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/products/categories`);
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Error getting categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="bg-white w-full h-[80px] flex items-center justify-between px-20 ">
        {/* <div className="w-[10%] flex items-center justify-start">
          <img src="../../public/vite.svg" alt="Logo" className="h-[50px] " />
        </div> */}
        <div className="flex w-[60%] items-center justify-start px-10 gap-8  ">
          {/* <button
            className="text-sm/6 font-semibold bg-white/20 hover:bg-white/50 transition-colors duration-200 px-4 py-2 rounded-lg text-white"
            onClick={() => navigate("/")}
          >
            Home
          </button> */}


            {/* <Menu.Root>
      <Menu.Trigger>Open Menu</Menu.Trigger>
      <Menu.Positioner>
        <Menu.Content>
          <Menu.ItemGroup>
            <Menu.ItemGroupLabel>My Account</Menu.ItemGroupLabel>
            <Menu.Separator />
            <Menu.Item value="billing">
              <CreditCardIcon /> Billing
            </Menu.Item>
            <Menu.Item value="settings">
              <SettingsIcon /> Settings
            </Menu.Item>
            <Menu.Root positioning={{ placement: 'right-start', gutter: -2 }}>
              <Menu.TriggerItem>
                <UserPlusIcon />
                Invite member
                <ChevronRightIcon />
              </Menu.TriggerItem>
              <Menu.Positioner>
                <Menu.Content>
                  <Menu.Item value="email">
                    <MailIcon /> Email
                  </Menu.Item>
                  <Menu.Item value="message">
                    <MessageSquareIcon /> Message
                  </Menu.Item>
                  <Menu.Separator />
                  <Menu.Item value="other">
                    <PlusCircleIcon />
                    More Options...
                  </Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Menu.Root>
            <Menu.Separator />
            <Menu.Item value="logout">
              <LogOutIcon />
              Logout
            </Menu.Item>
          </Menu.ItemGroup>
        </Menu.Content>
      </Menu.Positioner>
    </Menu.Root> */}

    <Menu.Root>
      <Menu.Trigger className="self-start h-8 bg-transparent text-[#000000] text-lg  px-1 justify-center uppercase
                              border-b-2 border-transparent hover:border-[#000000] transition-colors">
        Catalog
      </Menu.Trigger>
      <Menu.Positioner>
        <Menu.Content>
          {categories.map((category) => {
            const hasSub = Array.isArray(category.subcategories) && category.subcategories.length > 0

            if (!hasSub) {
              // Простой пункт меню без вложенности
              return (
                // <Menu.Item
                //   key={category.id}
                //   value={category.category_name}
                //   onClick={() =>
                //     navigate(`/?category_name=${category.category_name}`)
                //   }
                //   className="flex items-center justify-between px-3 py-2 hover:bg-white/20 text-[#000000]"
                // >
                //   {category.category_name}
                <Menu.Item asChild value={category.category_name}>
                  <ButtonSecond children={category.category_name} onClick={() => navigate(`/?category_name=${category.category_name}`) } className="text-md"/>
                </Menu.Item>
              )
            }

            // Пункт меню с подменю
            return (
              <Menu.Root
                key={category.id}
                positioning={{ placement: "right-start", gutter: -2 }}
                open={openCategoryId === category.id}
                onOpenChange={() => toggleCategory(category.id)}
              >
                {/* <Menu.TriggerItem className="flex items-center justify-between px-3 py-2 hover:bg-white/20 ">
                  {category.category_name}
                  {openCategoryId === category.id ? (
                    <ChevronDownIcon size={14} />
                  ) : (
                    <ChevronRightIcon size={14} />
                  )}
                </Menu.TriggerItem> */}
                <Menu.TriggerItem className="flex items-center justify-between px-3 py-2 bg-transparent text-[#000000] text-md uppercase border-b-2 border-transparent hover:border-[#000000] transition-colors cursor-pointer">
                  {category.category_name}
                  {openCategoryId === category.id ? (
                    <ChevronDownIcon size={16} />
                  ) : (
                    <ChevronRightIcon size={16} />
                  )}
                </Menu.TriggerItem>
                <Menu.Positioner>
                  <Menu.Content>
                    {category.subcategories &&
                      category.subcategories.map((subcat) => (
                        <Menu.Item
                          key={subcat.id}
                          value={subcat.subcategory_name}
                          onClick={() =>
                            navigate(
                              `/?subcategory_name=${subcat.subcategory_name}`
                            )
                          }
                          className="flex items-center justify-between px-3 py-2 bg-transparent text-[#000000] text-md uppercase border-b-2 border-transparent hover:border-[#000000] transition-colors cursor-pointer"
                        >
                          {subcat.subcategory_name}
                        </Menu.Item>
                      ))}
                  </Menu.Content>
                </Menu.Positioner>
              </Menu.Root>
            )
          })}
        </Menu.Content>
      </Menu.Positioner>
    </Menu.Root>

          <ButtonSecond
            onClick={() => navigate("/")}
            children="Home" />
          {/* <Popover>
            <PopoverButton className="block text-sm/6 font-semibold bg-white/20 px-4 py-2 rounded-lg hover:bg-white/50 transition-colors duration-200 text-white focus:outline-none data-active:text-white data-focus:outline data-focus:outline-white data-hover:text-white">
              Catalog
            </PopoverButton>
            <PopoverPanel
              transition
              anchor="bottom"
              className="divide-y divide-white rounded-xl mt-2 bg-[#ff5353] text-sm/6 transition duration-200 ease-in-out [--anchor-gap:--spacing(5)] data-closed:-translate-y-1 data-closed:opacity-0"
            >
              <div className="p-3 space-y-1">
                {categories.map((category) => {
                  const isOpen = openCategoryId === category.id;

                  return (
                    <div key={category.id}>
                      <button
                        onClick={() => {
                          if (category.subcategories?.length) {
                            toggleCategory(category.id);
                          } else {
                            navigate(
                              `/?category_name=${category.category_name}`,
                            );
                          }
                        }}
                        className="flex w-full items-center justify-between rounded-lg px-3 py-2 transition hover:bg-white/20 text-left"
                      >
                        <span className="font-semibold text-white">
                          {category.category_name}
                        </span>
                        {category.subcategories &&
                          category.subcategories.length > 0 && (
                            <span className="text-white text-sm">
                              {isOpen ? "▼" : "▶"}
                            </span>
                          )}
                      </button>

                      {isOpen &&
                        category.subcategories &&
                        category.subcategories.length > 0 && (
                          <div className="ml-4 mt-1 flex flex-col gap-1 transition-all duration-200">
                            {category.subcategories.map((subcat) => (
                              <button
                                key={subcat.id}
                                onClick={() =>
                                  navigate(
                                    `/?subcategory_name=${subcat.subcategory_name}`,
                                  )
                                }
                                className="block w-full text-left rounded-lg px-3 py-1 transition hover:bg-white/10 text-white text-sm"
                              >
                                {subcat.subcategory_name}
                              </button>
                            ))}
                          </div>
                        )}
                    </div>
                  );
                })}
              </div>
            </PopoverPanel>
          </Popover> */}
          <Popover>
  {/* <PopoverButton className="block text-sm/6 font-semibold bg-white/20 px-4 py-2 rounded-lg hover:bg-white/50 transition-colors duration-200 text-white focus:outline-none data-active:text-white data-focus:outline data-focus:outline-white data-hover:text-white">
    Catalog
  </PopoverButton> */}
  
  <PopoverButton className="self-start h-8 bg-transparent text-[#000000] text-lg  px-1 justify-center uppercase
  border-b-2 border-transparent hover:border-[#000000] transition-colors">
    Catalog
  </PopoverButton>
  <PopoverPanel
    transition
    anchor="bottom"
    className="divide-y divide-white  mt-2 bg-[#ff5353] text-sm/6 transition duration-200 ease-in-out [--anchor-gap:--spacing(5)] data-closed:-translate-y-1 data-closed:opacity-0"
  >
    <div className="p-3 space-y-1">
      {categories.map((category) => {
        const isOpen = openCategoryId === category.id;

        // return (
        //   <div key={category.id}>
        //     <ButtonSecond
        //       onClick={() => {
        //         if (category.subcategories?.length) {
        //           toggleCategory(category.id);
        //         } else {
        //           navigate(`/?category_name=${category.category_name}`);
        //         }
        //       }}
        //       // className="flex w-full items-center justify-between rounded-lg px-3 py-2 transition hover:bg-white/20 text-left text-white font-semibold"
        //     >
        //       {category.category_name}
        //       {category.subcategories &&
        //         category.subcategories.length > 0 && (
        //           <span className="text-black text-sm">
        //             {isOpen ? "▼" : "▶"}
        //           </span>
        //         )}
        //     </ButtonSecond>

        //     {isOpen &&
        //       category.subcategories &&
        //       category.subcategories.length > 0 && (
        //         <div className="ml-4 mt-1 flex flex-col gap-1 transition-all duration-200">
        //           {category.subcategories.map((subcat) => (
        //             <ButtonSecond
        //               key={subcat.id}
        //               onClick={() =>
        //                 navigate(
        //                   `/?subcategory_name=${subcat.subcategory_name}`
        //                 )
        //               }
        //               className="block w-full text-left rounded-lg px-3 py-1 transition hover:bg-white/10 text-white text-sm"
        //             >
        //               {subcat.subcategory_name}
        //             </ButtonSecond>
        //           ))}
        //         </div>
        //       )}
        //   </div>
        // );
        return (
  <div key={category.id} className="relative">
    <ButtonSecond
      onClick={() => {
        if (category.subcategories?.length) {
          toggleCategory(category.id);
        } else {
          navigate(`/?category_name=${category.category_name}`);
        }
      }}
      className="flex w-full items-center justify-between rounded-lg px-3 py-2 transition hover:bg-white/20 text-left text-white font-semibold"
    >
      {category.category_name}
      {category.subcategories && category.subcategories.length > 0 && (
        <span className="text-black text-sm">{isOpen ? "▼" : "▶"}</span>
      )}
    </ButtonSecond>

    {isOpen &&
      category.subcategories &&
      category.subcategories.length > 0 && (
        <div
          className="absolute top-0 left-full ml-2 flex flex-col gap-1 bg-[#ff5353] rounded-lg p-2 shadow-lg"
        >
          {category.subcategories.map((subcat) => (
            <ButtonSecond
              key={subcat.id}
              onClick={() =>
                navigate(`/?subcategory_name=${subcat.subcategory_name}`)
              }
              className="block text-left rounded-lg px-3 py-1 transition hover:bg-white/10 text-white text-sm whitespace-nowrap"
            >
              {subcat.subcategory_name}
            </ButtonSecond>
          ))}
        </div>
      )}
  </div>
);
      })}
    </div>
  </PopoverPanel>
</Popover>
          <ButtonSecond
            onClick={() => console.log("Delivery page")}
            children="delivery" />
          <ButtonSecond
            onClick={() => console.log("About page")}
            children="about us" />
          {/* <button
            className="text-sm/6 font-semibold bg-white/20 hover:bg-white/50 transition-colors duration-200 px-4 py-2 rounded-lg text-white"
            onClick={() => console.log("Delivery page")}
          >
            Delivery
          </button>
          <button
            className="text-sm/6 font-semibold bg-white/20 hover:bg-white/50 transition-colors duration-200 px-4 py-2 rounded-lg text-white"
            onClick={() => console.log("About page")}
          >
            About us
          </button> */}
        </div>
        <div className="w-[30%] flex flex-row gap-8 items-center justify-end pr-4">
          {role === "admin" && (
            // <button
            //   className="flex size-11 flex-none items-center justify-center rounded-[50%] bg-white group-hover:bg-white"
            //   onClick={() => console.log("Admin page")}
            // >
            //   <ChartBarIcon
            //     aria-hidden="true"
            //     className="size-6 text-gray-600 hover:text-indigo-600"
            //   />
            // </button>
            <ButtonSecond
              onClick={() => console.log("Admin page")}
              children="dashboard" 
              />
          )}
          {/* <button
            className="flex size-11 flex-none items-center justify-center rounded-[50%] bg-white group-hover:bg-white"
            onClick={toggleSearch}
          >
            <MagnifyingGlassIcon
              aria-hidden="true"
              className="size-6 text-gray-600 hover:text-indigo-600"
            />
          </button> */}
          <ButtonSecond
            onClick={toggleSearch}
            children="search" />
          <CartIconWithBadge />
          {isAuthenticated ? (
            <ButtonSecond
              onClick={() => navigate("/account")}
              children="account" />
          ) : (
            <ButtonSecond
              onClick={() => navigate("/login")}
              children="log in" />
          )
        }
          {/*  <Popover>
            <PopoverButton className="flex w-10 h-10 flex-none items-center justify-center rounded-full bg-white group-hover:bg-white">
              {isAuthenticated ? (
                <UserIconSolid
                  aria-hidden="true"
                  className="size-6 text-gray-600 hover:text-indigo-600"
                />
              ) : (
                <UserIcon
                  aria-hidden="true"
                  className="size-6 text-gray-600 hover:text-indigo-600"
                />
              )}
            </PopoverButton>
            <PopoverPanel
              transition
              anchor="bottom"
              className="divide-y divide-white rounded-xl mt-2 bg-[#818181] text-sm/6 transition duration-200 ease-in-out [--anchor-gap:--spacing(5)] data-closed:-translate-y-1 data-closed:opacity-0"
            >
              {!isAuthenticated ? (
                <div className="p-2">
                  <button
                    className="block rounded-lg px-3 py-2 transition hover:bg-white/20"
                    onClick={() => navigate("/login")}
                  >
                    <p className="font-semibold text-white">Log In</p>
                  </button>
                </div>
              ) : (
                <div className="p-2">
                  <button
                    className="block rounded-lg px-3 py-2 transition hover:bg-white/20"
                    onClick={() => console.log("Profile page")}
                  >
                    <p className="font-semibold text-white">Profile</p>
                  </button>
                  <button
                    className="block rounded-lg px-3 py-2 transition hover:bg-white/20"
                    onClick={() => {
                      handleLogOut();
                    }}
                  >
                    <p className="font-semibold text-white">Log Out</p>
                  </button>
                </div>
              )}
            </PopoverPanel>
          </Popover> */ }
          {/* <CustomDialog
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            message="You have successfully logged out."
            buttonTitle="Go to Main Page"
            onClickButton={() => navigate("/")}
          /> */}
        </div>
      </div>
      <div className={`flex w-full ${searchMenuOpen} ? "" : "hidden"`}>
        <SearchInterface
          show={searchMenuOpen}
          onClose={() => setSearchMenuOpen(false)}
        />
      </div>
    </div>
  );
};

export default Header;
