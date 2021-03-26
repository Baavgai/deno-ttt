import { GameState, Pos, Cell, EmptyCell, toPos, isAvailable } from "./tttEngine.ts";

export const displayGame = (gs:GameState, nums = false) => {
  const pv = (n: Pos, v: Cell) => " " + (nums ? (v === " " ? `${n}` : v) : v) + " ";
  const p = (n: Pos) => pv(n, gs.board[n]);
  const pr = (x: Pos, y: Pos, z: Pos) => `${p(x)}|${p(y)}|${p(z)}`;
  console.log(pr(0, 1, 2));
  console.log("---+---+---");
  console.log(pr(3, 4, 5));
  console.log("---+---+---");
  console.log(pr(6, 7, 8));
  console.log(`Turn: ${gs.turn + 1}`);
  if (gs.done) { console.log(gs.winner === EmptyCell ? "Tie" : `Winner: ${gs.winner}`); }
  // console.log(info);
  // console.log(`Turn: ${turn(b)}`);
  // if (isDone(g)) { console.log(`Winner: ${g.winner}`); }
  console.log();
};

export const getUserPos = (gs:GameState): Pos => {
  let result: Pos | undefined;
  while(result === undefined) {
    const entry = prompt("Next move:");
    result = toPos(entry);
    if (result === undefined) {
      console.log(`"${entry}" is not a valid move.`)
    } else if (!isAvailable(gs, result)) {
      console.log(`"${result}" is not an available.`);
      result = undefined;
    }
  }
  return result;
};
