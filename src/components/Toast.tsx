// ToastContainer.tsx
import { useEffect, useState } from "react";
import { PiX } from "react-icons/pi";

type ToastType = "success" | "error" | "info" | "loading";

type Toast = {
  id: number;
  message: string;
  type: ToastType;
};

let showToastFunc: (type: ToastType, message: string, id?: number) => number;
let updateToastFunc: (id: number, type: ToastType, message: string) => void;
let dismissToastFunc: (id: number) => void;

export const toast = {
  success: (msg: string, id?: number) => showToastFunc?.("success", msg, id),
  error: (msg: string, id?: number) => showToastFunc?.("error", msg, id),
  info: (msg: string, id?: number) => showToastFunc?.("info", msg, id),
  loading: (msg: string) => showToastFunc?.("loading", msg),
  dismiss: (id: number) => dismissToastFunc?.(id),
  update: (id: number, type: ToastType, message: string) =>
    updateToastFunc?.(id, type, message),
};

const ToastContainer = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    showToastFunc = (type, message, id = Date.now()) => {
      const toast: Toast = { id, type, message };

      setToasts((prev) => [...prev.filter((t) => t.id !== id), toast]);

      if (type !== "loading") {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 5000);
      }

      return id;
    };

    updateToastFunc = (id, type, message) => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, type, message } : t))
      );

      if (type !== "loading") {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 4000);
      }
    };

    dismissToastFunc = (id) => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    };
  }, []);

  const handleClose = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const getBgClass = (type: ToastType) => {
    switch (type) {
      case "success":
        return "bg-green-50 text-green-900";
      case "error":
        return "bg-red-100 text-red-800";
      case "info":
        return "bg-blue-100 text-blue-800";
      case "loading":
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="fixed bottom-5 right-1/2 flex flex-col gap-2 translate-x-1/2 z-50 ">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`min-w-[200px] max-w-xs flex items-center justify-between gap-x-6 px-4 py-2 rounded shadow ${getBgClass(t.type)}`}
        >
          <div className="flex items-center gap-2">
            {t.type === "loading" && (
              <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
            )}
            <span>{t.message}</span>
          </div>
          {t.type !== "loading" && 
          <PiX
          size={20}
            className="cursor-pointer text-lg"
            onClick={() => handleClose(t.id)}
          />
          }
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
