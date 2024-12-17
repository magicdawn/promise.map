export function approximateCostTime(time: number, tolerance: number) {
  return function satisfy(val: number) {
    return val >= time && val - time <= Math.abs(tolerance)
  }
}
