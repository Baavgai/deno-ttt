export const ROWS = 3, COLS = 3, CELL_COUNT = 9;

export type EmptyCell = " ";
export type Player = "X" | "O";
export type Cell = Player | EmptyCell;
// export type Board = readonly Cell[];
export type Board = readonly [Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell];


export const EmptyBoard: Board =
    [" ", " ", " ", " ", " ", " ", " ", " ", " "];


export const stateInfo = (b: Board) => {
    const playerCheck = (p: Player) =>
        [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ].some(([x, y, z]) => p === b[x] && p === b[y] && p === b[z]);
    const allMoves = b.reduce((acc: number[], x, i) => x === " " ? [...acc, i] : acc, []);
    const winner = playerCheck("O") ? "O" : playerCheck("X") ? "X" : " ";
    const turn = CELL_COUNT - allMoves.length;
    const done = (turn === CELL_COUNT) || (winner !== " ");
    const playerTurn: Cell = done ? " " : ((turn % 2 === 0) ? "X" : "O");
    const availableMoves = done ? [] : allMoves;
    return {
        availableMoves, winner, turn, done, playerTurn,
        validMove: (pos: number) => availableMoves.some(x => x === pos)
    };
}



export const print = (b: Board, nums = false) => {
    const info = stateInfo(b);
    const pv = (n: number, v: Cell) => " " + (nums ? (v === " " ? `${n}` : v) : v) + " ";
    const p = (n: number) => pv(n, b[n]);
    const pr = (x: number, y: number, z: number) => `${p(x)}|${p(y)}|${p(z)}`;
    console.log(pr(0, 1, 2));
    console.log("---+---+---");
    console.log(pr(3, 4, 5));
    console.log("---+---+---");
    console.log(pr(6, 7, 8));
    console.log(`Turn: ${info.turn + 1}`);
    if (info.done) { console.log(info.winner === " " ? "Tie" : `Winner: ${info.winner}`); }
    // console.log(info);
    // console.log(`Turn: ${turn(b)}`);
    // if (isDone(g)) { console.log(`Winner: ${g.winner}`); }
    console.log();
};


const place = (b: Board, pos: number, value: Player): [Board, boolean] => {
    const v = (i: number): Cell => i === pos ? value : b[i];
    return !(stateInfo(b).validMove(pos))
        ? [b, false]
        : [[v(0), v(1), v(2), v(3), v(4), v(5), v(6), v(7), v(8)], true];
};


export const move = (b: Board, pos: number): [Board, boolean] => {
    const { playerTurn } = stateInfo(b);
    return playerTurn === " " ? [b, false] : place(b, pos, playerTurn);
};

export const bestMove = (b: Board): number | undefined => {
    const info = stateInfo(b);
    if (info.done) {
        return undefined;
    } else if (info.turn === 0) {
        return 4;
    } else {
        
    }
}
