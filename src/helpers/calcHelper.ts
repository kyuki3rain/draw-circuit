export const greatestCommonDivisor = (value1: number, value2: number): number =>
  value2 === 0 ? value1 : greatestCommonDivisor(value2, value1 % value2);
export const leastCommonMultiple = (value1: number, value2: number) =>
  (value1 * value2) / greatestCommonDivisor(value1, value2);
