export function padNumberWithZero(number: number, length: number): string {
  return number.toString().padStart(length, "0");
}
