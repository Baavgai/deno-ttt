const createPoint1 = (x, y)=>({
        x,
        y
    })
;
const subPoint1 = (a, b)=>createPoint1(a.x - b.x, a.y - b.y)
;
const vectorRad = (vector)=>{
    const rad = Math.atan2(vector.y, vector.x);
    return rad < 0 ? 2 * Math.PI + rad : rad;
};
const getIntersect = (v1, p1, v2, p2)=>{
    const abc1 = posToABC(v1, p1);
    if (v2.x === 0) {
        return createPoint1((abc1.c - abc1.b * v2.y) / abc1.a, v2.y);
    } else if (v2.y === 0) {
        return createPoint1(v2.x, (abc1.c - abc1.a * v2.x) / abc1.b);
    } else {
        const abc2 = posToABC(v2, p2);
        const det = abc1.a * abc2.b - abc2.a * abc1.b;
        return det === 0 ? createPoint1(0, 0) : createPoint1((abc2.b * abc1.c - abc1.b * abc2.c) / det, (abc1.a * abc2.c - abc2.a * abc1.c) / det);
    }
    function posToABC(v, p) {
        const a = v.y;
        const b = -v.x;
        const c = a * p.x + b * p.y;
        return {
            a,
            b,
            c
        };
    }
};
const inRect1 = (r, p)=>{
    const ps = subPoint1(p, r);
    return ps.x >= 0 && ps.y >= 0 && ps.x < r.width && ps.y < r.height;
};
const randInt = (n, endRange)=>endRange === undefined ? Math.floor(Math.random() * n) : n + randInt(endRange - n + 1)
;
const randPick = (xs)=>xs[randInt(xs.length)]
;
const EmptyBoard = [
    " ",
    " ",
    " ",
    " ",
    " ",
    " ",
    " ",
    " ",
    " "
];
const stateInfo = (b)=>{
    const findWinningPositions = (p)=>[
            [
                0,
                1,
                2
            ],
            [
                3,
                4,
                5
            ],
            [
                6,
                7,
                8
            ],
            [
                0,
                3,
                6
            ],
            [
                1,
                4,
                7
            ],
            [
                2,
                5,
                8
            ],
            [
                0,
                4,
                8
            ],
            [
                2,
                4,
                6
            ]
        ].find(([x, y, z])=>p === b[x] && p === b[y] && p === b[z]
        )
    ;
    const win = findWinningPositions("O") || findWinningPositions("X");
    const allMoves = b.reduce((acc, x, i)=>x === " " ? [
            ...acc,
            i
        ] : acc
    , []);
    const turn = 9 - allMoves.length;
    const done = turn === 9 || win !== undefined;
    const winner = done ? win ? b[win[0]] : " " : undefined;
    const playerTurn = done ? undefined : turn % 2 === 0 ? "X" : "O";
    const availableMoves = done ? [] : allMoves;
    const validMove = (pos)=>availableMoves.some((x)=>x === pos
        )
    ;
    return {
        availableMoves,
        win,
        winner,
        turn,
        done,
        playerTurn,
        validMove
    };
};
const print = (b, nums = false)=>{
    const info = stateInfo(b);
    const pv = (n, v)=>" " + (nums ? v === " " ? `${n}` : v : v) + " "
    ;
    const p = (n)=>pv(n, b[n])
    ;
    const pr = (x, y, z)=>`${p(x)}|${p(y)}|${p(z)}`
    ;
    console.log(pr(0, 1, 2));
    console.log("---+---+---");
    console.log(pr(3, 4, 5));
    console.log("---+---+---");
    console.log(pr(6, 7, 8));
    console.log(`Turn: ${info.turn + 1}`);
    if (info.done) {
        console.log(info.winner === " " ? "Tie" : `Winner: ${info.winner}`);
    }
    console.log();
};
const place = (b, pos, value)=>{
    const v = (i)=>i === pos ? value : b[i]
    ;
    return !stateInfo(b).validMove(pos) ? [
        b,
        false
    ] : [
        [
            v(0),
            v(1),
            v(2),
            v(3),
            v(4),
            v(5),
            v(6),
            v(7),
            v(8)
        ],
        true
    ];
};
const move = (b, pos)=>{
    const { playerTurn  } = stateInfo(b);
    return playerTurn === undefined ? [
        b,
        false
    ] : place(b, pos, playerTurn);
};
const bestMove = (b)=>{
    const info = stateInfo(b);
    if (info.playerTurn) {
        if (info.turn === 0) {
            return 4;
        }
        const forPlayer = (player)=>info.availableMoves.find((pos)=>stateInfo(move(b, pos)[0]).winner === player
            )
        ;
        return forPlayer(info.playerTurn) || forPlayer(info.playerTurn === "X" ? "O" : "X") || randPick(info.availableMoves);
    }
    return undefined;
};
const fillRect = (ctx, r, fillStyle)=>{
    ctx.fillStyle = fillStyle;
    ctx.fillRect(r.x, r.y, r.width, r.height);
};
const textCenter = (ctx, r, text)=>{
    const x = r.x + Math.floor(r.width / 2);
    const y = r.y + Math.floor(r.height / 2);
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillText(text, x, y);
};
const Color = {
    Background: "#000",
    Hover: "#004",
    Line: "#0ff",
    Player: "#00f"
};
const calcMetrics = (p)=>{
    const boxSize = createSize(Math.floor((p.size - (p.barSize * 2 + p.gutterSize * 2)) / 3));
    const cells = [
        {
            ...boxSize,
            x: p.gutterSize,
            y: p.gutterSize
        }
    ];
    cells.push(translateRect(cells[0], {
        y: 0,
        x: p.barSize + boxSize.width
    }));
    cells.push(translateRect(cells[1], {
        y: 0,
        x: p.barSize + boxSize.width
    }));
    for(let i = 0; i < 6; i++){
        cells.push(translateRect(cells[i], {
            x: 0,
            y: p.barSize + boxSize.height
        }));
    }
    const boardBounds = createRect(cells[0].x, cells[0].y, cells[8].x + cells[8].width - cells[0].x, cells[8].y + cells[8].height - cells[0].y);
    const viewPort = createRect(0, 0, boardBounds.width + p.gutterSize * 2, boardBounds.height + p.gutterSize * 2);
    const fontSize = Math.floor(boxSize.height * 0.8);
    return {
        boxSize,
        cells,
        boardBounds,
        viewPort,
        fontSize
    };
};
const addListener = ({ ele , cells  }, hoverListener, clickListener)=>{
    const canPos = createPoint(ele.offsetLeft, ele.offsetTop);
    const pagePos = (e)=>createPoint(e.pageX, e.pageY)
    ;
    const transPos = (e)=>subPoint(pagePos(e), canPos)
    ;
    const toCell = (e)=>cells.findIndex((cell)=>inRect(cell, transPos(e))
        )
    ;
    const inCell = (f)=>(e)=>f(toCell(e))
    ;
    ele.addEventListener("mousemove", inCell(hoverListener));
    ele.addEventListener("click", inCell(clickListener));
};
const initContext = (p)=>{
    const ele = document.getElementById(p.canvasId);
    const ctx = ele.getContext("2d");
    ele.width = p.size;
    ele.height = p.size;
    return {
        ele,
        ctx
    };
};
const draw = (p)=>{
    fillRect(p.ctx, p.viewPort, Color.Background);
    fillRect(p.ctx, p.boardBounds, Color.Line);
    p.ctx.font = `${p.fontSize}px bold sans-serif`;
    p.cells.forEach((cell, idx)=>{
        const value = p.board[idx];
        if (value === " ") {
            fillRect(p.ctx, cell, idx === p.hover ? Color.Hover : Color.Background);
        } else {
            fillRect(p.ctx, cell, Color.Background);
            p.ctx.fillStyle = Color.Player;
            textCenter(p.ctx, cell, p.board[idx]);
        }
    });
};
const createStateContainer = (initState)=>{
    let state = initState;
    return [
        ()=>state
        ,
        (f)=>{
            state = f(state);
            return state;
        }
    ];
};
const createApp = (cfg)=>{
    const p = {
        ...initContext(cfg),
        ...calcMetrics(cfg)
    };
    const [getState, setState] = createStateContainer({
        hover: -1,
        board: EmptyBoard
    });
    const refresh = (state)=>draw({
            ...cfg,
            ...p,
            ...state
        })
    ;
    const updateHover = (cell)=>{
        if (cell !== getState().hover) {
            refresh(setState((s)=>({
                    ...s,
                    hover: cell
                })
            ));
        }
    };
    const select = (cell)=>{
        if (cell !== -1) {
            refresh(setState((s)=>{
                const [board] = move(s.board, cell);
                return {
                    ...s,
                    board
                };
            }));
        }
    };
    addListener({
        ...p,
        ...cfg
    }, updateHover, select);
    refresh(getState());
};
createApp({
    canvasId: "gridCanvas",
    size: 500,
    barSize: 10,
    gutterSize: 20
});
