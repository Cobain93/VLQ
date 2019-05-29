const intToCharMap = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");

const encode = (num: number) => {
  if (0 <= num && num < intToCharMap.length) {
    return intToCharMap[num];
  }
  throw new TypeError("Must be between 0 and 63: " + num);
};

export { encode };
