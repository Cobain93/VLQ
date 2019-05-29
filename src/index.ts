import { IVLQ } from "./../index.d";
import * as base64 from "./utils/base64";

import { VLQ_BASE, VLQ_BASE_MASK, VLQ_BASE_SHIFT, VLQ_CONTINUATION_BIT } from "./config";

function toVLQSigned (aValue: number) {
  return aValue < 0 ? ((-aValue) << 1) + 1 : (aValue << 1) + 0;
}

function fromVLQSigned (aValue: number): number {
  const isNegative = (aValue & 1) === 1;
  const shifted = aValue >> 1;
  return isNegative ? -shifted : shifted;
}

function base64VLQ_encode (aValue: number): string {
  let encoded = "";
  let digit;
  let vlq = toVLQSigned(aValue);
  do {
    digit = vlq & VLQ_BASE_MASK;
    vlq >>>= VLQ_BASE_SHIFT;
    if (vlq > 0) {
      digit |= VLQ_CONTINUATION_BIT;
    }
    encoded += base64.encode(digit);
  } while (vlq > 0);
  return encoded;
}

const VLQ: IVLQ = {
  encode: base64VLQ_encode,
};
export { VLQ };

export default window;
