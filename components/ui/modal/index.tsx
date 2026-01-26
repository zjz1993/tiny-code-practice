import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;

  title?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;

  className?: string;
  width?: number | string;

  maskClosable?: boolean;
}

export function Modal(props: ModalProps) {
  const {
    open,
    defaultOpen,
    onOpenChange,
    title,
    children,
    footer,
    className,
    width = 520,
    maskClosable = true,
  } = props;

  return (
    <Dialog.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {(open ?? defaultOpen) && (
          <Dialog.Portal forceMount>
            {/* Mask */}

            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 bg-black/40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            </Dialog.Overlay>

            {/* Content */}

            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 10 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                style={{ width }}
                //onPointerDownOutside={e => {
                //  if (!maskClosable) e.preventDefault();
                //}}
                className={clsx(
                  "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
                  "bg-white rounded-xl shadow-xl",
                  "focus:outline-none",
                  className,
                )}
              >
                {/* Header */}

                {title && (
                  <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
                    <Dialog.Title className="text-base font-medium">{title}</Dialog.Title>

                    <Dialog.Close className="text-xl leading-none opacity-60 hover:opacity-100">
                      <X />
                    </Dialog.Close>
                  </div>
                )}

                {/* Body */}

                <div className="px-6 py-4">{children}</div>

                {/* Footer */}

                {footer && (
                  <div className="flex justify-end gap-2 px-6 py-3 border-t border-border/50">
                    {footer}
                  </div>
                )}
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
