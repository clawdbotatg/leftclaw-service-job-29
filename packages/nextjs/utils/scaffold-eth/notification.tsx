import { createContext, useContext, ReactNode } from "react";

interface NotificationType {
  success?: (message: string) => void;
  error?: (message: string) => void;
  warning?: (message: string) => void;
}

const NotificationContext = createContext<NotificationType>({});

export const notification = {
  success: (message: string) => console.log("[SUCCESS]", message),
  error: (message: string) => console.error("[ERROR]", message),
  warning: (message: string) => console.warn("[WARNING]", message),
};

export function NotificationProvider({ children }: { children: ReactNode }) {
  return (
    <NotificationContext.Provider value={notification}>
      {children}
    </NotificationContext.Provider>
  );
}