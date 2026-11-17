import { createContext, useCallback, useContext, useMemo, useState } from "react";

const ToastContext = createContext(null);
let nextId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const push = useCallback(
    (message, { tone = "info" } = {}) => {
      const id = ++nextId;
      setToasts((current) => [...current, { id, message, tone }]);
      if (tone !== "danger") {
        setTimeout(() => dismiss(id), 5000);
      }
      return id;
    },
    [dismiss],
  );

  const value = useMemo(() => ({ push, dismiss }), [push, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="fixed bottom-4 left-1/2 z-[70] flex w-[min(100%-2rem,24rem)] -translate-x-1/2 flex-col gap-2 md:left-auto md:right-4 md:translate-x-0"
        aria-live="polite"
      >
        {toasts.map((toast) => (
          <p
            key={toast.id}
            className={`rounded-lg border px-4 py-3 text-sm shadow-md ${
              toast.tone === "danger"
                ? "border-danger bg-danger-bg text-danger"
                : "border-n-200 bg-n-0 text-n-900"
            }`}
          >
            {toast.message}
          </p>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }
  return context;
}
