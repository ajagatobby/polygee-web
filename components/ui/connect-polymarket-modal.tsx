"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Eye, EyeOff, Key, Shield, Wallet } from "lucide-react";
import { easing, duration } from "@/lib/animations";

interface ConnectPolymarketModalProps {
  open: boolean;
  onClose: () => void;
}

const fields = [
  {
    name: "apiKey",
    label: "API Key",
    placeholder: "Enter your API key",
    icon: Key,
  },
  {
    name: "secretKey",
    label: "Secret Key",
    placeholder: "Enter your secret key",
    icon: Shield,
  },
  {
    name: "passphrase",
    label: "Passphrase",
    placeholder: "Enter your passphrase",
    icon: Shield,
  },
  {
    name: "funderAddress",
    label: "Funder Address",
    placeholder: "0x...",
    icon: Wallet,
  },
  {
    name: "privateKey",
    label: "Private Key",
    placeholder: "Enter your private key",
    icon: Key,
  },
] as const;

type FieldName = (typeof fields)[number]["name"];

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: duration.normal, ease: easing.easeOut },
  },
  exit: {
    opacity: 0,
    transition: { duration: duration.fast, ease: easing.easeOut },
  },
};

const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    filter: "blur(4px)",
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: duration.medium,
      ease: easing.easeOut,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    y: 6,
    filter: "blur(4px)",
    transition: {
      duration: duration.fast,
      ease: easing.easeOut,
    },
  },
};


export function ConnectPolymarketModal({
  open,
  onClose,
}: ConnectPolymarketModalProps) {
  const [values, setValues] = useState<Record<FieldName, string>>({
    apiKey: "",
    secretKey: "",
    passphrase: "",
    funderAddress: "",
    privateKey: "",
  });

  const [visibility, setVisibility] = useState<Record<FieldName, boolean>>({
    apiKey: false,
    secretKey: false,
    passphrase: false,
    funderAddress: false,
    privateKey: false,
  });

  const [focusedField, setFocusedField] = useState<FieldName | null>(null);

  const handleChange = (name: FieldName, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const toggleVisibility = (name: FieldName) => {
    setVisibility((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const allFilled = Object.values(values).every((v) => v.trim().length > 0);

  const handleSubmit = () => {
    if (!allFilled) return;
    // TODO: handle submission
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-[440px] mx-4 bg-white rounded-[16px] shadow-xl overflow-hidden"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4">
              <div>
                <h2 className="text-[18px] font-bold text-[#1a1a2e] tracking-[-0.02em]">
                  Connect Polymarket
                </h2>
                <p className="text-[13px] text-[#808080] mt-0.5">
                  Enter your API credentials to connect
                </p>
              </div>
              <button
                onClick={onClose}
                className="flex items-center justify-center w-[30px] h-[30px] rounded-[8px] text-[#999] hover:text-[#1a1a2e] hover:bg-[#f5f5f5] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Divider */}
            <div className="h-px bg-[#f0f0f0] mx-6" />

            {/* Fields */}
            <div className="px-6 py-5 flex flex-col gap-3.5">
              {fields.map((field) => {
                const Icon = field.icon;
                const isFocused = focusedField === field.name;
                const isSecret = field.name !== "funderAddress";
                const isVisible = visibility[field.name];

                return (
                  <div key={field.name}>
                    <label className="block text-[12px] font-medium text-[#666] mb-1.5">
                      {field.label}
                    </label>
                    <div
                      className={`
                        flex items-center gap-2 h-[40px] px-3 rounded-[10px] border transition-all
                        ${
                          isFocused
                            ? "border-[#1552f0] ring-1 ring-[#1552f0]/20 bg-white"
                            : "border-[#e8e8e8] bg-[#fafafa] hover:border-[#ddd]"
                        }
                      `}
                    >
                      <Icon
                        className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                          isFocused ? "text-[#1552f0]" : "text-[#bbb]"
                        }`}
                      />
                      <input
                        type={isSecret && !isVisible ? "password" : "text"}
                        placeholder={field.placeholder}
                        value={values[field.name]}
                        onChange={(e) =>
                          handleChange(field.name, e.target.value)
                        }
                        onFocus={() => setFocusedField(field.name)}
                        onBlur={() => setFocusedField(null)}
                        className="flex-1 text-[13px] text-[#1a1a2e] placeholder:text-[#bbb] bg-transparent outline-none"
                      />
                      {isSecret && (
                        <button
                          type="button"
                          onClick={() => toggleVisibility(field.name)}
                          className="shrink-0 p-0.5 text-[#bbb] hover:text-[#808080] transition-colors cursor-pointer"
                        >
                          {isVisible ? (
                            <EyeOff className="w-3.5 h-3.5" />
                          ) : (
                            <Eye className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="px-6 pb-6 pt-1 flex gap-2.5">
              <button
                onClick={onClose}
                className="flex-1 h-[40px] text-[13px] font-medium text-[#666] bg-[#f5f5f5] rounded-[10px] hover:bg-[#ebebeb] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!allFilled}
                className={`
                  flex-1 h-[40px] text-[13px] font-bold text-white rounded-[10px] transition-all cursor-pointer
                  ${
                    allFilled
                      ? "bg-[#1552f0] hover:bg-[#1247d6]"
                      : "bg-[#1552f0]/40 cursor-not-allowed"
                  }
                `}
              >
                Connect
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
