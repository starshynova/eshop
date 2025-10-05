import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { SearchQueryProvider } from "../context/SearchQueryContext";
import Header from "../components/Header";
import { API_BASE_URL } from "../config";
import Loader from "../components/Loader";
import Button from "../components/Button";
import { Accordion } from "@ark-ui/react";
import { Plus, Minus } from "lucide-react";
import { useCart } from "../context/CartContext";
import CustomDialog from "../components/CustomDialog";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

type ProductProps = {
  id: string;
  title: string;
  price: number;
  description: string;
  main_photo_url: string;
  stock: number;
  category?: { name: string };
  subcategory?: { name: string };
};

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductProps | null>(null);
  const { addAndRefresh } = useCart();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchProductDetails = async () => {
      setError(null);
      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/products/${id}`);
        if (!response.ok) {
          throw new Error(`Error fetching product details: ${response.status}`);
        }
        const data = await response.json();
        setProduct(data);
      } catch (error: any) {
        setError(error.message || "Error fetching product details");
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProductDetails();
  }, [id]);

  const handleAddToCart = async () => {
    if (!id) return;
    const result = await addAndRefresh(id, 1);
    if (!result || !result.success) {
      toast.error(result?.error || "An error occurred.");
      setIsDisabled(true);
    } else {
      toast.success("Product added to cart!");
    }
  };

  if (isLoading) return <Loader />;
  if (error) {
    return (
      <CustomDialog
        isOpen={true}
        onClose={() => setError(null)}
        message={error}
        isVisibleButton={false}
      />
    );
  }

  if (!product) return null;

  return (
    <SearchQueryProvider>
      <Header />
      <div className="flex flex-row w-full px-8 gap-x-12 my-12 absolute top-[100px]">
        <img
          src={product.main_photo_url}
          alt={product.title}
          className="w-[45%] object-cover aspect-[1/1]"
        />
        <div className="flex flex-col w-[55%]">
          <h2 className="text-lg text-gray-800 text-left flex gap-2 items-center">
            <button
              className="capitalize"
              onClick={() => navigate("/")}
              type="button"
            >
              home /
            </button>
            {product.category?.name && (
              <button
                className=" capitalize"
                onClick={() =>
                  navigate(
                    `/?category_name=${encodeURIComponent(product.category!.name)}`,
                  )
                }
                type="button"
              >
                {product.category.name}
              </button>
            )}
            {product.subcategory?.name && (
              <>
                <span>/</span>
                <button
                  className="capitalize"
                  onClick={() =>
                    navigate(
                      `/?subcategory_name=${encodeURIComponent(product.subcategory!.name)}`,
                    )
                  }
                  type="button"
                >
                  {product.subcategory.name}
                </button>
              </>
            )}
          </h2>
          <h1 className="text-4xl font-bold text-black uppercase mt-4">
            {product.title}
          </h1>
          <div className="mt-4 text-black text-xl">
            €{product.price.toFixed(2)}
          </div>
          <div className="mt-8" />
          {product.stock > 0 ? (
            <Button
              onClick={handleAddToCart}
              children="Add to Cart"
              className={`min-w-fit ${isDisabled ? "bg-gray-400 text-gray-200 cursor-not-allowed hover:bg-gray-400 hover:text-gray-200" : ""}`}
              disabled={isDisabled}
            />
          ) : (
            <span className="text-red-500 font-semibold py-2 uppercase">
              out of stock
            </span>
          )}
          <div className="border-t-[1px] border-gray-400 w-full mt-8" />
          <Accordion.Root collapsible>
            <Accordion.Item value="description">
              <Accordion.ItemTrigger className="group w-full my-4 flex flex-row justify-between data-[state=open]:font-bold">
                Description
                <span className="ml-2 flex">
                  <Plus
                    className="block group-data-[state=open]:hidden"
                    size="24px"
                    color="#505050"
                  />
                  <Minus
                    className="hidden group-data-[state=open]:block"
                    size="24px"
                    color="#505050"
                  />
                </span>
              </Accordion.ItemTrigger>
              <Accordion.ItemContent className="my-4">
                {product.description}
              </Accordion.ItemContent>
            </Accordion.Item>
          </Accordion.Root>
          <div className="border-t-[1px] border-gray-400 w-full" />
        </div>
      </div>
    </SearchQueryProvider>
  );
};

export default ProductDetails;
