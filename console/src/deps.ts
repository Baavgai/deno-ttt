export const randInt = (n: number, endRange?: number): number =>
  endRange === undefined
    ? Math.floor(Math.random() * n)
    : (n + randInt((endRange - n) + 1))
  ;

export const randPick = <T>(xs: T[]): T =>
  xs[randInt(xs.length)];
