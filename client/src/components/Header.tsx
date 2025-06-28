import {
  Popover,
  PopoverButton,
  PopoverPanel,
} from '@headlessui/react'
import {
  UserIcon,
  ShoppingCartIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'
import{ useState } from 'react';
import SearchInterface from './SearchInterface';



const Header: React.FC = () => {
    const [searchMenuOpen, setSearchMenuOpen] = useState<boolean>(false);
    return (
        <div className="w-full flex flex-col items-center justify-center">
        <div className="bg-black w-full h-[80px] flex items-center justify-between px-20 ">
            <div className="w-[10%] flex items-center justify-start">
                
                <img src="../../public/vite.svg" alt="Logo" className="h-[50px] " />
            </div>
            <div className="flex w-[60%] items-center justify-start px-10 gap-8  ">
                <button className="text-sm/6 font-semibold bg-white/20 hover:bg-white/50 transition-colors duration-200 px-4 py-2 rounded-lg text-white"
                    onClick={() => console.log("Home page")}>Home</button>
                <Popover>
          <PopoverButton className="block text-sm/6 font-semibold bg-white/20 px-4 py-2 rounded-lg hover:bg-white/50 transition-colors duration-200 text-white focus:outline-none data-active:text-white data-focus:outline data-focus:outline-white data-hover:text-white">
            Catalog
          </PopoverButton>
          <PopoverPanel
            transition
            anchor="bottom"
            className="divide-y divide-white rounded-xl mt-2 bg-[#ff5353] text-sm/6 transition duration-200 ease-in-out [--anchor-gap:--spacing(5)] data-closed:-translate-y-1 data-closed:opacity-0"
          >
            <div className="p-3">
              <a className="block rounded-lg px-3 py-2 transition hover:bg-white/20" href="#">
                <p className="font-semibold text-white">Section 1</p>
              </a>
              <a className="block rounded-lg px-3 py-2 transition hover:bg-white/20" href="#">
                <p className="font-semibold text-white">Section 2</p>
              </a>
              <a className="block rounded-lg px-3 py-2 transition hover:bg-white/20" href="#">
                <p className="font-semibold text-white">Section 3</p>
              </a>
            </div>
          </PopoverPanel>
        </Popover>
        <button className="text-sm/6 font-semibold bg-white/20 hover:bg-white/50 transition-colors duration-200 px-4 py-2 rounded-lg text-white"
                    onClick={() => console.log("Delivery page")}>Delivery</button>
        <button className="text-sm/6 font-semibold bg-white/20 hover:bg-white/50 transition-colors duration-200 px-4 py-2 rounded-lg text-white"
                    onClick={() => console.log("About page")}>About us</button>
            </div>
            <div className="w-[30%] flex flex-row gap-8 items-center justify-end pr-4">
                <button className="flex size-11 flex-none items-center justify-center rounded-[50%] bg-white group-hover:bg-white"
                onClick={() => setSearchMenuOpen(!searchMenuOpen)}>
                    <MagnifyingGlassIcon aria-hidden="true" className="size-6 text-gray-600 hover:text-indigo-600" />
                </button>
                <button className="flex w-10 h-10 flex-none items-center justify-center rounded-full bg-white group-hover:bg-white">
                    <ShoppingCartIcon aria-hidden="true" className="size-6 text-[#cf3232] hover:text-indigo-600" />
                </button>
                <Popover>
                 <PopoverButton className="flex w-10 h-10 flex-none items-center justify-center rounded-full bg-white group-hover:bg-white">
                    <UserIcon aria-hidden="true" className="size-6 text-gray-600 hover:text-indigo-600" />
                </PopoverButton>
                <PopoverPanel
                transition
                anchor="bottom"
                className="divide-y divide-white rounded-xl mt-2 bg-[#818181] text-sm/6 transition duration-200 ease-in-out [--anchor-gap:--spacing(5)] data-closed:-translate-y-1 data-closed:opacity-0">
                    <div className="p-2">
                        <a className="block rounded-lg px-3 py-2 transition hover:bg-white/20" href="#">
                          <p className="font-semibold text-white">Log In</p>
                        </a>
                        <a className="block rounded-lg px-3 py-2 transition hover:bg-white/20" href="#">
                          <p className="font-semibold text-white">Log Out</p>
                        </a>
                    </div>
                </PopoverPanel>
                </Popover>
            </div>
        </div>
        <div className={`flex w-full ${searchMenuOpen} ? "" : "hidden"`}>
        <SearchInterface show={searchMenuOpen} />
        </div>
        </div>
    )
}

export default Header;
