export const pageSizeDefalut = 20;

export const rowsPerPageOptions = [20, 50, 100];
export const rowsPopupPerPageOptions = [5, 10, 20];

export const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

export const formatter1 = new Intl.NumberFormat("ko-KR");

export const formatterKo = new Intl.NumberFormat("ko-KR", {
  maximumFractionDigits: 0
});

export const percentFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 0
});

export const dateFormatter = Intl.DateTimeFormat("kr", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  //   hour12: true,
  formatMatcher: "best fit"
});
