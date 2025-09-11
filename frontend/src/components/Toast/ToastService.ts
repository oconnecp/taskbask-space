const handlers: ((actionType:ActionTypeEnum, toast: ToastType) => void)[] = [];

export enum ActionTypeEnum {
  ADD = 'add',
  REMOVE = 'remove'
}

export const registerToastHandler = (callback: (actionType:ActionTypeEnum, toast: ToastType) => void) =>{ 
  handlers.push(callback);
  return callback;
}

export const unregisterToastHandler = (callback: (actionType:ActionTypeEnum, toast: ToastType) => void) => {
  const index = handlers.indexOf(callback);
  if (index !== -1) {
    handlers.splice(index, 1);
  }
}

export enum ToastTypeEnum {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  OVERWRITE = 'overwrite'
}

export interface ToastType {
  message: string;
  duration: number;  // in milliseconds if passed 0, it will not auto dismiss
  type: ToastTypeEnum;
  id?: string;
}

export const triggerToast = (toast: ToastType) => {
  // Generate an id for the toast so that removal collisions can be avoided
  toast.id = Math.random().toString(36).substr(2, 9);
  handlers.forEach(handler => handler(ActionTypeEnum.ADD, toast));
  
  // If the duration is not 0, remove the toast after the duration
  if (toast.duration !== 0) {
    setTimeout(() => {
      removeToast(toast);
    }, toast.duration);
  }
}

export const removeToast = (toast:ToastType) => {
  handlers.forEach(handler => {handler(ActionTypeEnum.REMOVE, toast)});
}
