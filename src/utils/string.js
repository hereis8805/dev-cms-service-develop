export function formatNumber(value) {
  if (!value) {
    if (value === 0) {
      return "0";
    }
  }

  return value.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}
