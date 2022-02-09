import toast from "react-hot-toast";

export const show = (message: string) => toast(message);

export const infinite = (message: string) =>
  toast(message, { duration: 9999999999 });
