import React, { useEffect, CSSProperties, useCallback } from "react";
import { ActionTypeEnum, registerToastHandler, ToastType, ToastTypeEnum, unregisterToastHandler } from "./ToastService";

export const ToastHandler = React.memo(() => {
  const [toastQueue, setToastQueue] = React.useState<ToastType[]>([]);

  const handleToast = useCallback((actionType: ActionTypeEnum, toast: ToastType) => {
    setToastQueue(prevQueue => {
      if (actionType === ActionTypeEnum.REMOVE) {
        return prevQueue.filter(t => t.id !== toast.id);
      }

      if (toast.type === ToastTypeEnum.OVERWRITE) {
        return [toast];
      }

      return [...prevQueue, toast];
    });
  }, []);

  useEffect(() => {
    // Register the toast handler
    registerToastHandler(handleToast);

    return () => {
      // Unregister the toast handler
      unregisterToastHandler(handleToast);
    };
  }, [handleToast]);

  const toastStyle: CSSProperties = {
    position: 'fixed',
    top: '1rem',
    right: '1rem',
    zIndex: 1000,
  };


  return (
    <div style={toastStyle}>
      {toastQueue.map((toast) => (
        <div key={toast.id} style={{ backgroundColor: '#1f1919', padding: '1rem', margin: '1rem', borderRadius: '5px' }}>
          {toast.message}
        </div>
      ))}
    </div>
  );
});