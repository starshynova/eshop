import { useState, useEffect } from "react";
import SearchInterface from "./SearchInterface";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import getUserRole from "../utils/getUserRole";
import { useAuth } from "../context/AuthContext";
import CartIconWithBadge from "./CartIconWithBadge";
import ButtonSecond from "./ButtonSecond";
import { Menu } from "@ark-ui/react/menu";
import { ChevronRightIcon, ChevronDownIcon } from "lucide-react";
import { getUserId } from "../utils/getUserId";

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
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate();
  const toggleSearch = () => setSearchMenuOpen((open) => !open);
  const [openCategoryId, setOpenCategoryId] = useState<string | null>(null);
  const [catalogOpen, setCatalogOpen] = useState(false);

  const [leftHover, setLeftHover] = useState(false);
  const role = getUserRole();
  const { isAuthenticated } = useAuth();

  const handleUserAccountClick = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    const token = localStorage.getItem("token");
    console.log("Token:", token);
    if (!token) {
      console.error("No token found in localStorage");
      return;
    }
    const userId = getUserId();
    if (!userId) {
      navigate("/login");
      return;
    }
    navigate(`/users/${userId}`);
  };

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
    <div className="w-full flex flex-col items-center justify-between px-8">
      <div className="w-full sticky top-0 z-50 bg-white shadow-md">
        <div className="h-[80px] flex items-center justify-between px-24">
          <div
            className="flex w-[60%] items-center justify-start gap-8"
            onMouseEnter={() => setLeftHover(true)}
            onMouseLeave={() => setLeftHover(false)}
          >
            <ButtonSecond onClick={() => navigate("/")} children="Home" />
            <div
              onMouseEnter={() => setCatalogOpen(true)}
              onMouseLeave={() => {
                setCatalogOpen(false);
                setOpenCategoryId(null);
              }}
            >
              <Menu.Root open={catalogOpen}>
                <Menu.Trigger
                  className="self-start h-8 bg-transparent text-[#000000] text-lg px-1 uppercase
                 border-b-2 border-b-transparent hover:border-b-[#000000] transition-colors cursor-pointer"
                >
                  Catalog
                </Menu.Trigger>

                <Menu.Positioner>
                  <Menu.Content>
                    {categories.map((category) => {
                      const hasSub =
                        Array.isArray(category.subcategories) &&
                        category.subcategories.length > 0;

                      if (!hasSub) {
                        return (
                          <Menu.Item
                            asChild
                            value={category.category_name}
                            key={category.id}
                          >
                            <ButtonSecond
                              children={category.category_name}
                              onClick={() =>
                                navigate(
                                  `/?category_name=${category.category_name}`,
                                )
                              }
                              className="text-[16px]"
                            />
                          </Menu.Item>
                        );
                      }

                      return (
                        <div
                          key={category.id}
                          className="relative"
                          onMouseEnter={() => setOpenCategoryId(category.id)}
                          onMouseLeave={() => setOpenCategoryId(null)}
                        >
                          <Menu.Root
                            positioning={{
                              placement: "right-start",
                              gutter: -2,
                            }}
                            open={openCategoryId === category.id}
                          >
                            <Menu.TriggerItem
                              className="flex items-center justify-between px-3 py-2 bg-transparent text-[#000000] text-[16px]
                             uppercase border-b-2 border-b-transparent hover:border-b-[#000000] transition-colors cursor-pointer"
                            >
                              {category.category_name}
                              {openCategoryId === category.id ? (
                                <ChevronDownIcon size={16} />
                              ) : (
                                <ChevronRightIcon size={16} />
                              )}
                            </Menu.TriggerItem>

                            <Menu.Positioner>
                              <Menu.Content>
                                {category.subcategories?.map((subcat) => (
                                  <Menu.Item
                                    key={subcat.id}
                                    value={subcat.subcategory_name}
                                    onClick={() =>
                                      navigate(
                                        `/?subcategory_name=${subcat.subcategory_name}`,
                                      )
                                    }
                                    className="flex items-center justify-between px-3 py-2.5 bg-transparent text-[#000000] text-sm uppercase
                                   border-b-2 border-b-transparent hover:border-b-[#000000] transition-colors cursor-pointer"
                                  >
                                    {subcat.subcategory_name}
                                  </Menu.Item>
                                ))}
                              </Menu.Content>
                            </Menu.Positioner>
                          </Menu.Root>
                        </div>
                      );
                    })}
                  </Menu.Content>
                </Menu.Positioner>
              </Menu.Root>
            </div>

            <ButtonSecond
              onClick={() => console.log("Delivery page")}
              children="delivery"
            />
            <ButtonSecond
              onClick={() => console.log("About page")}
              children="about us"
            />
          </div>

          <div className="w-[30%] flex flex-row gap-8 items-center justify-end">
            {role === "admin" && (
              <ButtonSecond
                onClick={() => console.log("Admin page")}
                children="dashboard"
              />
            )}
            <ButtonSecond onClick={toggleSearch} children="search" />
            <CartIconWithBadge />
            {isAuthenticated ? (
              <ButtonSecond
                onClick={handleUserAccountClick}
                children="account"
              />
            ) : (
              <ButtonSecond
                onClick={() => navigate("/login")}
                children="log in"
              />
            )}
          </div>
        </div>

        <div
          className={`transition-all duration-300 overflow-hidden bg-white ${
            leftHover ? "h-[160px]" : "h-0"
          }`}
        ></div>
      </div>

      <div className={`flex w-full ${searchMenuOpen ? "" : "hidden"}`}>
        <SearchInterface
          show={searchMenuOpen}
          onClose={() => setSearchMenuOpen(false)}
        />
      </div>
    </div>
  );
};

export default Header;
