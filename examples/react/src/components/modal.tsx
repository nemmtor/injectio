import { AnimatePresence, motion } from 'framer-motion';
import { ReactNode } from 'react';

import { Button } from './button';

export type ModalProps = {
  isOpened: boolean;
  onClose: VoidFunction;
  onCloseAnimationFinished: VoidFunction;
};

type Props = {
  children: ReactNode;
} & ModalProps;

export const Modal = ({
  isOpened,
  onClose,
  onCloseAnimationFinished,
  children,
}: Props) => {
  return (
    <AnimatePresence onExitComplete={onCloseAnimationFinished}>
      {isOpened && (
        <div className="z-50">
          <motion.div
            className="fixed inset-0 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed top-1/2 right-1/2 bg-white p-4 flex flex-col items-start max-w-max min-w-xs"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
            <Button className="self-end" onClick={onClose}>
              Close
            </Button>
            <div className="mt-4 w-full">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
