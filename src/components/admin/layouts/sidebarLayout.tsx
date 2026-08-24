"use client";

import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import {
  FolderIcon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import ActiveLink from "@/components/shared/activeLink";
import { useAppSelector } from "@/hooks";
import { selectUser } from "@/store/auth";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SidebarLayout({ open, setOpen }: Props) {
  const user = useAppSelector(selectUser);

  const navigation = [
    { name: "داشبورد", href: "/admin", icon: HomeIcon, enabled: true },
    {
      name: "محصولات",
      href: "/admin/products",
      icon: FolderIcon,
      enabled: user.canAccess("manage_products"),
    },
    {
      name: "کاربران",
      href: "/admin/users",
      icon: UsersIcon,
      enabled: user.canAccess("manage_users"),
    },
  ];

  const navItems = navigation.filter((item) => item.enabled);

  return (
    <>
      <Dialog open={open} onClose={setOpen} className="relative z-40 md:hidden">
        <DialogBackdrop className="fixed inset-0 bg-gray-600/75 transition duration-300 data-closed:opacity-0" />
        <div className="fixed inset-0 flex">
          <DialogPanel className="relative flex w-full max-w-xs flex-1 flex-col bg-gray-800 pt-5 pb-4 transition duration-300 data-closed:translate-x-full">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:ring-2 focus:ring-white focus:outline-none focus:ring-inset"
                onClick={() => setOpen(false)}
              >
                <span className="sr-only">Close sidebar</span>
                <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </button>
            </div>
            <div className="flex shrink-0 items-center px-4">
              <span className="text-lg font-bold text-white">Shopy</span>
            </div>
            <div className="mt-5 h-0 flex-1 overflow-y-auto">
              <nav className="space-y-1 px-2">
                {navItems.map((item) => (
                  <ActiveLink href={item.href} key={item.name}>
                    {({ active }) => (
                      <span
                        className={`${active ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"} group flex items-center rounded-md px-2 py-2 text-base font-medium`}
                      >
                        <item.icon
                          className={`${active ? "text-gray-300" : "text-gray-400 group-hover:text-gray-300"} ml-4 h-6 w-6 shrink-0`}
                          aria-hidden="true"
                        />
                        {item.name}
                      </span>
                    )}
                  </ActiveLink>
                ))}
              </nav>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-gray-800">
          <div className="flex h-16 shrink-0 items-center bg-gray-900 px-4">
            <span className="text-lg font-bold text-white">Shopy</span>
          </div>
          <div className="flex flex-1 flex-col overflow-y-auto">
            <nav className="flex-1 space-y-1 px-2 py-4">
              {navItems.map((item) => (
                <ActiveLink key={item.name} href={item.href}>
                  {({ active }) => (
                    <span
                      className={`${active ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"} group flex items-center rounded-md px-2 py-2 text-sm font-medium`}
                    >
                      <item.icon
                        className={`${active ? "text-gray-300" : "text-gray-400 group-hover:text-gray-300"} ml-3 h-6 w-6 shrink-0`}
                        aria-hidden="true"
                      />
                      {item.name}
                    </span>
                  )}
                </ActiveLink>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}
