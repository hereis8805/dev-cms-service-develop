import { format as dateFormat } from "date-fns";

export function getToday(format) {
  return dateFormat(new Date(), `${format || "yyyy-MM-dd"}`);
}
