// 'use client'

// import { useState } from 'react'
import {
  Popover,
  PopoverButton,
  PopoverPanel,
} from '@headlessui/react'
import {
  ArrowPathIcon,
//   Bars3Icon,
  ChartPieIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  SquaresPlusIcon,
//   XMarkIcon,
  UserIcon,
//   UserCircleIcon
  ShoppingCartIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'
// import { ChevronDownIcon,
//      } from '@heroicons/react/20/solid'
import SearchInputTxt from './SearchInputTxt'
// import SearchWithSlide from './SearchWithSlide'
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
            <div className="flex w-[60%] items-center justify-start px-10 gap-8">
                <button className="text-sm/6 font-semibold bg-white/20 px-4 py-2 rounded-lg text-white"
                    onClick={() => console.log("Home page")}>Home</button>
                <Popover>
          <PopoverButton className="block text-sm/6 font-semibold bg-white/20 px-4 py-2 rounded-lg text-white focus:outline-none data-active:text-white data-focus:outline data-focus:outline-white data-hover:text-white">
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
        <button className="text-sm/6 font-semibold bg-white/20 px-4 py-2 rounded-lg text-white"
                    onClick={() => console.log("Delivery page")}>Delivery</button>
        <button className="text-sm/6 font-semibold bg-white/20 px-4 py-2 rounded-lg text-white"
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
                
                 <button className="flex w-10 h-10 flex-none items-center justify-center rounded-full bg-white group-hover:bg-white">
                    <UserIcon aria-hidden="true" className="size-6 text-gray-600 hover:text-indigo-600" />
                </button>
            </div>
        </div>
        <div className={`flex w-full ${searchMenuOpen} ? "" : "hidden"`}>
        <SearchInterface show={searchMenuOpen} onClose={() => setSearchMenuOpen(false)}/>
        </div>
        </div>
    )
}

export default Header;







// const products = [
//   { name: 'Analytics', description: 'Get a better understanding of your traffic', href: '#', icon: ChartPieIcon },
//   { name: 'Engagement', description: 'Speak directly to your customers', href: '#', icon: CursorArrowRaysIcon },
//   { name: 'Security', description: 'Your customers’ data will be safe and secure', href: '#', icon: FingerPrintIcon },
//   { name: 'Integrations', description: 'Connect with third-party tools', href: '#', icon: SquaresPlusIcon },
//   { name: 'Automations', description: 'Build strategic funnels that will convert', href: '#', icon: ArrowPathIcon },
// ]

// export default function Example() {
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

//   return (
//     <header className="bg-white">
//       <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
//         <div className="flex lg:flex-1">
//           <a href="#" className="-m-1.5 p-1.5">
//             <span className="sr-only">Your Company</span>
//             <img
//               alt=""
//               src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
//               className="h-8 w-auto"
//             />
//           </a>
//         </div>
        
//         <div className="flex lg:hidden">
//           <button
//             type="button"
//             onClick={() => setMobileMenuOpen(true)}
//             className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
//           >
//             <span className="sr-only">Open main menu</span>
//             <Bars3Icon aria-hidden="true" className="size-6" />
//           </button>
//         </div>
//         <PopoverGroup className="hidden lg:flex lg:gap-x-12">
//             <a href="#" className="text-sm/6 font-semibold text-gray-900">
//             Home
//           </a>
//           <Popover className="relative">
//             <PopoverButton className="flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900">
//               Catalog
//               <ChevronDownIcon aria-hidden="true" className="size-5 flex-none text-gray-400" />
//             </PopoverButton>

//             <PopoverPanel
//               transition
//               className="absolute top-full -left-8 z-50 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5 transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in"
//             >
//               <div className="p-4">
//                 {products.map((item) => (
//                   <div
//                     key={item.name}
//                     className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm/6 hover:bg-gray-50"
//                   >
//                     <div className="flex size-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
//                       <item.icon aria-hidden="true" className="size-6 text-gray-600 group-hover:text-indigo-600" />
//                     </div>
//                     <div className="flex-auto">
//                       <a href={item.href} className="block font-semibold text-gray-900">
//                         {item.name}
//                         <span className="absolute inset-0" />
//                       </a>
//                       <p className="mt-1 text-gray-600">{item.description}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               {/* <div className="grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-50">
//                 {callsToAction.map((item) => (
//                   <a
//                     key={item.name}
//                     href={item.href}
//                     className="flex items-center justify-center gap-x-2.5 p-3 text-sm/6 font-semibold text-gray-900 hover:bg-gray-100"
//                   >
//                     <item.icon aria-hidden="true" className="size-5 flex-none text-gray-400" />
//                     {item.name}
//                   </a>
//                 ))}
//               </div> */}
//             </PopoverPanel>
//           </Popover>

          
//           <a href="#" className="text-sm/6 font-semibold text-gray-900">
//             Contact
//           </a>
//           <a href="#" className="text-sm/6 font-semibold text-gray-900">
//             About us
//           </a>
//         </PopoverGroup>
//         <div className="hidden lg:flex lg:flex-1 lg:justify-end">
//           <a href="#" className="text-sm/6 font-semibold text-gray-900">
//             {/* Log in <span aria-hidden="true">&rarr;</span> */}
//             <div className="flex size-11 flex-none items-center justify-center rounded-lg bg-white group-hover:bg-white">
//                       <UserIcon aria-hidden="true" className="size-6 text-gray-600 group-hover:text-indigo-600" />
//                     </div>
//           </a>
//         </div>
//       </nav>
//       <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
//         <div className="fixed inset-0 z-50" />
//         <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
//           <div className="flex items-center justify-between">
//             <a href="#" className="-m-1.5 p-1.5">
//               <span className="sr-only">Your Company</span>
//               <img
//                 alt=""
//                 src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
//                 className="h-8 w-auto"
//               />
//             </a>
//             <button
//               type="button"
//               onClick={() => setMobileMenuOpen(false)}
//               className="-m-2.5 rounded-md p-2.5 text-gray-700"
//             >
//               <span className="sr-only">Close menu</span>
//               <XMarkIcon aria-hidden="true" className="size-6" />
//             </button>
//           </div>
//           <div className="mt-6 flow-root">
//             <div className="-my-6 divide-y divide-gray-500/10">
//               <div className="space-y-2 py-6">
//                 <Disclosure as="div" className="-mx-3">
//                   <DisclosureButton className="group flex w-full items-center justify-between rounded-lg py-2 pr-3.5 pl-3 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">
//                     Product
//                     <ChevronDownIcon aria-hidden="true" className="size-5 flex-none group-data-open:rotate-180" />
//                   </DisclosureButton>
//                   <DisclosurePanel className="mt-2 space-y-2">
//                     {[...products].map((item) => (
//                       <DisclosureButton
//                         key={item.name}
//                         as="a"
//                         href={item.href}
//                         className="block rounded-lg py-2 pr-3 pl-6 text-sm/7 font-semibold text-gray-900 hover:bg-gray-50"
//                       >
//                         {item.name}
//                       </DisclosureButton>
//                     ))}
//                   </DisclosurePanel>
//                 </Disclosure>
//                 <a
//                   href="#"
//                   className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
//                 >
//                   Features
//                 </a>
//                 <a
//                   href="#"
//                   className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
//                 >
//                   Marketplace
//                 </a>
//                 <a
//                   href="#"
//                   className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
//                 >
//                   Company
//                 </a>
//               </div>
//               <div className="py-6">
//                 <a
//                   href="#"
//                   className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
//                 >
//                   Log in
//                 </a>
//               </div>
//             </div>
//           </div>
//         </DialogPanel>
//       </Dialog>
//     </header>
//   )
// }