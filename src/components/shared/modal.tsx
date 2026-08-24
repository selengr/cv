"use client";

import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import type { Dispatch, ReactNode, SetStateAction } from "react";

interface Props {
  children: ReactNode;
  show?: boolean;
  setShow: (() => void) | Dispatch<SetStateAction<boolean>>;
}

export default function Modal({ children, setShow, show = true }: Props) {
  return (
    <Dialog
      open={show}
      onClose={() => (setShow as (value: boolean) => void)(false)}
      className="relative z-20"
    >
      <DialogBackdrop className="fixed inset-0 bg-black/40" />
      <div className="fixed inset-0 overflow-y-auto text-center">
        <span className="inline-block h-screen align-middle">&#8203;</span>
        <DialogPanel className="inline-block">{children}</DialogPanel>
      </div>
    </Dialog>
  );
}
