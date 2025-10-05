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
    <div className="w-full flex flex-col items-center justify-between px-8 mt-[20px]">
      <div className="w-full sticky top-0 z-50 bg-white shadow-md">
        <div className="h-[80px] flex items-center justify-between px-8">
          <div
            className="flex flex-1 items-center justify-start gap-8 relative"
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
              className="relative"
            >
              <Menu.Root open={catalogOpen} positioning={{ gutter: -0 }}>
                <Menu.Trigger
                  className="self-start h-8 bg-transparent text-[#000000] text-lg px-1 uppercase focus:outline-none
                 border-b-2 border-b-transparent hover:border-b-[#000000] transition-colors cursor-pointer"
                  onClick={() => navigate("/")}
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
                              className="py-2 h-auto text-left w-full"
                              onClick={() => {
                                navigate(
                                  `/?category_name=${category.category_name}`,
                                );
                                setCatalogOpen(false);
                                setOpenCategoryId(null);
                              }}
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
                              className="flex items-center justify-between px-1 py-2 bg-transparent text-[#000000] text-lg focus:outline-none
                             uppercase border-b-2 border-b-transparent hover:border-b-[#000000] transition-colors cursor-pointer"
                              onClick={() => {
                                navigate(
                                  `/?category_name=${category.category_name}`,
                                );
                                setCatalogOpen(false);
                                setOpenCategoryId(null);
                              }}
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
                                    onClick={() => {
                                      navigate(
                                        `/?subcategory_name=${subcat.subcategory_name}`,
                                      );
                                      setCatalogOpen(false);
                                      setOpenCategoryId(null);
                                    }}
                                    className="flex items-center justify-between px-4 py-3 bg-transparent text-[#000000] text-sm uppercase focus:outline-none
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

            <ButtonSecond children="delivery" disabled={true} />
            <ButtonSecond children="about us" disabled={true} />
          </div>
          <div className="flex-1 flex justify-center">
            <div
              className="text-5xl font-bold cursor-pointer uppercase"
              onClick={() => navigate("/")}
            >
              eshop
            </div>
          </div>

          <div className="flex flex-1 flex-row gap-8 items-center justify-end">
            {role === "admin" && (
              <ButtonSecond
                onClick={() => navigate("/admin/dashboard")}
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
