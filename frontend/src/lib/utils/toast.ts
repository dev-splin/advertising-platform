import toast from "react-hot-toast";
import type { ToastOptions } from "react-hot-toast";

/**
 * Toast 기본 옵션
 */
const defaultOptions: ToastOptions = {
  duration: 3000,
  position: "bottom-center",
};

/**
 * 성공 Toast
 * @param message - 표시할 메시지
 * @param options - 추가 옵션 (기본 옵션과 병합됨)
 */
export const toastSuccess = (
  message: string,
  options?: ToastOptions,
): string => {
  return toast.success(message, { ...defaultOptions, ...options });
};

/**
 * 에러 Toast
 * @param message - 표시할 메시지
 * @param options - 추가 옵션 (기본 옵션과 병합됨)
 */
export const toastError = (message: string, options?: ToastOptions): string => {
  return toast.error(message, { ...defaultOptions, ...options });
};

/**
 * 정보 Toast
 * @param message - 표시할 메시지
 * @param options - 추가 옵션 (기본 옵션과 병합됨)
 */
export const toastInfo = (message: string, options?: ToastOptions): string => {
  return toast(message, { ...defaultOptions, ...options });
};

/**
 * 경고 Toast
 * @param message - 표시할 메시지
 * @param options - 추가 옵션 (기본 옵션과 병합됨)
 */
export const toastWarning = (
  message: string,
  options?: ToastOptions,
): string => {
  return toast(message, {
    ...defaultOptions,
    ...options,
    icon: "⚠️",
  });
};
