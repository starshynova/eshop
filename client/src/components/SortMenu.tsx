import React from "react";
import { Menu } from "@ark-ui/react/menu";
import { Portal } from "@ark-ui/react/portal";

type SortValue =
  | "default"
  | "price_asc"
  | "price_desc"
  | "name_asc"
  | "name_desc";

interface SortMenuProps {
  sort?: SortValue | null;
  handleSortChange: (value: SortValue) => void;
}

const labelByValue: Record<string, string> = {
  price_asc: "Price: Low to High",
  price_desc: "Price: High to Low",
  name_asc: "Name: A-Z",
  name_desc: "Name: Z-A",
  default: "By default",
  undefined: "By default",
  null: "By default",
};

const SortMenu: React.FC<SortMenuProps> = ({ sort, handleSortChange }) => {
  const items: { label: string; value: SortValue }[] = [
    { label: "By default", value: "default" },
    { label: "Price: Low to High", value: "price_asc" },
    { label: "Price: High to Low", value: "price_desc" },
    { label: "Name: A-Z", value: "name_asc" },
    { label: "Name: Z-A", value: "name_desc" },
  ];

  return (
    <div className="flex  mt-8 h-[40px] items-center justify-end">
      <Menu.Root positioning={{ placement: "bottom-end", gutter: 8 }}>
        <Menu.Trigger asChild>
          <button
            type="button"
            className="px-4 py-1 bg-white text-[16px] rounded
                     border-b-2 border-b-transparent hover:border-b-[#d0ff00]
                     transition-colors cursor-pointer
                     outline-none focus-visible:outline-none
                     focus-visible:border-b-2 focus-visible:border-b-[#d0ff00]"
          >
            {`Sort: ${labelByValue[String(sort ?? "undefined")]}`}
          </button>
        </Menu.Trigger>

        <Portal>
          <Menu.Positioner className="z-10">
            <Menu.Content
              className="bg-white shadow w-40 rounded outline-none
                       focus-visible:outline-none"
            >
              {items.map(({ label, value }) => {
                const isActive = sort === value;
                return (
                  <Menu.Item
                    key={value}
                    value={value}
                    onClick={() => handleSortChange(value)}
                    className="block w-full px-4 py-2 text-left cursor-pointer
                  data-[highlighted]:border-b-2
                             data-[highlighted]:border-b-[#d0ff00]"
                  >
                    <div className="flex items-center justify-between">
                      <span>{label}</span>
                      {isActive && <span aria-hidden>✓</span>}
                    </div>
                  </Menu.Item>
                );
              })}
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
    </div>
  );
};

export default SortMenu;
