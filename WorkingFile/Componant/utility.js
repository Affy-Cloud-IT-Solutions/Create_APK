// utility.js
export const enforceMaxLength = (text, maxLength = 10) => {
  if (text.length > maxLength) {
    return text.slice(0, maxLength);
  }
  return text;
};
