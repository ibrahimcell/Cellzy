"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import BookRepairModal from "./modals/BookRepairModal";
import ContactModal from "./modals/ContactModal";
import TrackOrderModal from "./modals/TrackOrderModal";

export type ModalType = "repair" | "contact" | "trackOrder" | null;

interface ModalCtxValue {
  open: (modal: ModalType) => void;
  close: () => void;
}

const ModalCtx = createContext<ModalCtxValue>({ open: () => {}, close: () => {} });
export const useModal = () => useContext(ModalCtx);

export default function ModalProvider({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState<ModalType>(null);

  const open  = useCallback((m: ModalType) => setActive(m), []);
  const close = useCallback(() => setActive(null), []);

  return (
    <ModalCtx.Provider value={{ open, close }}>
      {children}

      <AnimatePresence>
        {active && (
          <motion.div
            key="overlay"
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={e => { if (e.target === e.currentTarget) close(); }}
          >
            <motion.div
              className="modal-card"
              initial={{ opacity: 0, y: 32, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            >
              {active === "repair"     && <BookRepairModal onClose={close} />}
              {active === "contact"    && <ContactModal    onClose={close} />}
              {active === "trackOrder" && <TrackOrderModal onClose={close} />}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ModalCtx.Provider>
  );
}
