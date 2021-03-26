export * from "https://raw.githubusercontent.com/Baavgai/deno-funcs/master/graph2D/mod.ts";
// export * from "https://raw.githubusercontent.com/Baavgai/deno-funcs/master/core/mod.ts";

export const randInt = (n: number, endRange?: number): number =>
  endRange === undefined
    ? Math.floor(Math.random() * n)
    : (n + randInt((endRange - n) + 1))
  ;

export const randPick = <T>(xs: T[]): T =>
  xs[randInt(xs.length)];
