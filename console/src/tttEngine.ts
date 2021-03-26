import { randPick } from "./deps.ts";

export const ROWS = 3, COLS = 3, CELL_COUNT = 9;

export type Player = "X" | "O";
export type Cell = Player | " ";
export const EmptyCell = ' ';
// export type Pos = number;

export type Pos = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type Board = readonly [Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell];

export interface PlayerEngine {
  getMove: (board: Board) => Promise<Pos>;
}

export interface GameState {
  board: Board;
  turn: number;
  playerTurn: Cell;
  winner: Cell;
  availableMoves: Pos[];
  done: boolean;
}


export const toPos = (x: any): Pos | undefined => {
  const n = Number.parseInt(x);
  return (Number.isInteger(n) && n>=0 && n<9)
    ? (n as Pos)
    : undefined;
};


export const isPos = (x: any): x is Pos =>
  toPos(x) !== undefined;



const nextGameState = (b: Board): GameState => {
  const playerCheck = (p: Player) =>
    [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ].some(([x, y, z]) => p === b[x] && p === b[y] && p === b[z]);
  const availableMoves = b.reduce((acc: number[], x, i) => x === EmptyCell ? [...acc, i] : acc, []);
  const winner = playerCheck("O") ? "O" : playerCheck("X") ? "X" : EmptyCell;
  const turn = CELL_COUNT - availableMoves.length;
  const done = (turn === CELL_COUNT) || (winner !== EmptyCell);
  return {
    availableMoves: done ? [] : (availableMoves as Pos[]),
    turn, done, winner,
    board: b, playerTurn: done ? EmptyCell : ((turn % 2 === 0) ? "X" : "O")
  };
};


export const initGame = (): GameState =>
  nextGameState([EmptyCell, EmptyCell, EmptyCell, EmptyCell, EmptyCell, EmptyCell, EmptyCell, EmptyCell, EmptyCell]);

export const isAvailable = (state: GameState, p: Pos) => state.board[p] === EmptyCell;

const place = (state: GameState, pos: Pos, value: Player): GameState => {
  const v = (i: Pos): Cell => i === pos ? value : state.board[i];
  return !state.done && !isAvailable(state, pos)
    ? state
    : nextGameState([v(0), v(1), v(2), v(3), v(4), v(5), v(6), v(7), v(8)]);
};

export const move = (state: GameState, pos: Pos) =>
  state.playerTurn === EmptyCell ? state : place(state, pos, state.playerTurn);

export const getBestMove = (state: GameState): number | undefined => {
  if (state.playerTurn !== EmptyCell) {
    if (state.turn === 0) {
      return 4;
    } else {
      const forPlayer = (player: Player) => state.availableMoves
        .find(pos => place(state, pos, player).winner === player);
      return forPlayer(state.playerTurn)
        || forPlayer(state.playerTurn === "X" ? "O" : "X")
        || randPick(state.availableMoves);
    }
  }
  return undefined;
};

/*

export const isPos = (x: any): x is Pos => {
  const n = Number.parseInt(x);
  return Number.isInteger(n) && n>=0 && n<9;
};

*/