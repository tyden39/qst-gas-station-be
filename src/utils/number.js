function formatNumber(num) {
  // Convert the number to a string with two decimal places
  let parts = num.toFixed(2).split(".");
  // Format the integer part with commas
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  // Join the integer part and the decimal part with a dot
  let formatted = parts.join(".");
  // Remove trailing zeroes if any
  formatted = formatted.replace(/\.?0+$/, "");
  return formatted;
}

module.exports = {
  formatNumber
}