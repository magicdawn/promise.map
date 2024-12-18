export function approximateCostTime(time: number, tolerance: number) {
  return function satisfy(val: number) {
    // GitHub Actions 会出现比预期还小的 time, 差 0.5ms, 这里给 1ms 误差
    return (val >= time || (process.env.CI && val >= time - 1)) && val - time <= Math.abs(tolerance)
  }
}
