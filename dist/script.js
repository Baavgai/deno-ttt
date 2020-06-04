// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

// This is a specialised implementation of a System module loader.

// @ts-nocheck
/* eslint-disable */
let System, __instantiateAsync, __instantiate;

(() => {
  const r = new Map();

  System = {
    register(id, d, f) {
      r.set(id, { d, f, exp: {} });
    },
  };

  async function dI(mid, src) {
    let id = mid.replace(/\.\w+$/i, "");
    if (id.includes("./")) {
      const [o, ...ia] = id.split("/").reverse(),
        [, ...sa] = src.split("/").reverse(),
        oa = [o];
      let s = 0,
        i;
      while ((i = ia.shift())) {
        if (i === "..") s++;
        else if (i === ".") break;
        else oa.push(i);
      }
      if (s < sa.length) oa.push(...sa.slice(s));
      id = oa.reverse().join("/");
    }
    return r.has(id) ? gExpA(id) : import(mid);
  }

  function gC(id, main) {
    return {
      id,
      import: (m) => dI(m, id),
      meta: { url: id, main },
    };
  }

  function gE(exp) {
    return (id, v) => {
      v = typeof id === "string" ? { [id]: v } : id;
      for (const [id, value] of Object.entries(v)) {
        Object.defineProperty(exp, id, {
          value,
          writable: true,
          enumerable: true,
        });
      }
    };
  }

  function rF(main) {
    for (const [id, m] of r.entries()) {
      const { f, exp } = m;
      const { execute: e, setters: s } = f(gE(exp), gC(id, id === main));
      delete m.f;
      m.e = e;
      m.s = s;
    }
  }

  async function gExpA(id) {
    if (!r.has(id)) return;
    const m = r.get(id);
    if (m.s) {
      const { d, e, s } = m;
      delete m.s;
      delete m.e;
      for (let i = 0; i < s.length; i++) s[i](await gExpA(d[i]));
      const r = e();
      if (r) await r;
    }
    return m.exp;
  }

  function gExp(id) {
    if (!r.has(id)) return;
    const m = r.get(id);
    if (m.s) {
      const { d, e, s } = m;
      delete m.s;
      delete m.e;
      for (let i = 0; i < s.length; i++) s[i](gExp(d[i]));
      e();
    }
    return m.exp;
  }

  __instantiateAsync = async (m) => {
    System = __instantiateAsync = __instantiate = undefined;
    rF(m);
    return gExpA(m);
  };

  __instantiate = (m) => {
    System = __instantiateAsync = __instantiate = undefined;
    rF(m);
    return gExp(m);
  };
})();

System.register(
  "https://raw.githubusercontent.com/Baavgai/deno-funcs/master/graph2D/Point",
  [],
  function (exports_1, context_1) {
    "use strict";
    var isPoint, createPoint, addPoint, subPoint, negPoint, eqPoint;
    var __moduleName = context_1 && context_1.id;
    return {
      setters: [],
      execute: function () {
        exports_1(
          "isPoint",
          isPoint = (pt) =>
            pt && pt.x && pt.y && typeof (pt.x) === "number" &&
            typeof (pt.y) === "number",
        );
        exports_1("createPoint", createPoint = (x, y) => ({ x, y }));
        exports_1(
          "addPoint",
          addPoint = (a, b) => createPoint(a.x + b.x, a.y + b.y),
        );
        exports_1(
          "subPoint",
          subPoint = (a, b) => createPoint(a.x - b.x, a.y - b.y),
        );
        exports_1("negPoint", negPoint = (pt) => createPoint(-pt.x, -pt.y));
        exports_1("eqPoint", eqPoint = (a, b) => a.x === b.x && a.y === b.y);
      },
    };
  },
);
System.register(
  "https://raw.githubusercontent.com/Baavgai/deno-funcs/master/graph2D/functions",
  [],
  function (exports_2, context_2) {
    "use strict";
    var degToRad, radToDeg;
    var __moduleName = context_2 && context_2.id;
    return {
      setters: [],
      execute: function () {
        exports_2("degToRad", degToRad = (n) => n * (Math.PI / 180.0));
        exports_2("radToDeg", radToDeg = (n) => n * (180.0 / Math.PI));
      },
    };
  },
);
System.register(
  "https://raw.githubusercontent.com/Baavgai/deno-funcs/master/graph2D/Vector",
  [
    "https://raw.githubusercontent.com/Baavgai/deno-funcs/master/graph2D/Point",
    "https://raw.githubusercontent.com/Baavgai/deno-funcs/master/graph2D/functions",
  ],
  function (exports_3, context_3) {
    "use strict";
    var Point_ts_1,
      functions_ts_1,
      createVector,
      vectorFromMagRad,
      vectorFromMagDeg,
      vectorMag,
      vectorRad,
      vectorDeg,
      getIntersect;
    var __moduleName = context_3 && context_3.id;
    return {
      setters: [
        function (Point_ts_1_1) {
          Point_ts_1 = Point_ts_1_1;
        },
        function (functions_ts_1_1) {
          functions_ts_1 = functions_ts_1_1;
        },
      ],
      execute: function () {
        exports_3("createVector", createVector = Point_ts_1.createPoint);
        exports_3(
          "vectorFromMagRad",
          vectorFromMagRad = (magnitude, rad) =>
            createVector(magnitude * Math.cos(rad), magnitude * Math.sin(rad)),
        );
        exports_3(
          "vectorFromMagDeg",
          vectorFromMagDeg = (magnitude, deg) =>
            vectorFromMagRad(magnitude, functions_ts_1.degToRad(deg)),
        );
        exports_3(
          "vectorMag",
          vectorMag = (vector) =>
            Math.sqrt(vector.x * vector.x + vector.y * vector.y),
        );
        exports_3(
          "vectorRad",
          vectorRad = (vector) => {
            const rad = Math.atan2(vector.y, vector.x);
            return rad < 0 ? 2 * Math.PI + rad : rad;
          },
        );
        exports_3(
          "vectorDeg",
          vectorDeg = (vector) => functions_ts_1.degToRad(vectorRad(vector)),
        );
        exports_3(
          "getIntersect",
          getIntersect = (v1, p1, v2, p2) => {
            const abc1 = posToABC(v1, p1);
            if (v2.x === 0) {
              return Point_ts_1.createPoint(
                (abc1.c - (abc1.b * v2.y)) / abc1.a,
                v2.y,
              );
            } else if (v2.y === 0) {
              return Point_ts_1.createPoint(
                v2.x,
                (abc1.c - (abc1.a * v2.x)) / abc1.b,
              );
            } else {
              const abc2 = posToABC(v2, p2);
              const det = abc1.a * abc2.b - abc2.a * abc1.b;
              return (det === 0) ? Point_ts_1.createPoint(0, 0)
              : Point_ts_1.createPoint(
                (abc2.b * abc1.c - abc1.b * abc2.c) / det,
                (abc1.a * abc2.c - abc2.a * abc1.c) / det,
              );
            }
            function posToABC(v, p) {
              const a = v.y;
              const b = -v.x;
              const c = a * p.x + b * p.y;
              return { a, b, c };
            }
          },
        );
      },
    };
  },
);
System.register(
  "https://raw.githubusercontent.com/Baavgai/deno-funcs/master/graph2D/BoundVector",
  [
    "https://raw.githubusercontent.com/Baavgai/deno-funcs/master/graph2D/Point",
    "https://raw.githubusercontent.com/Baavgai/deno-funcs/master/graph2D/Vector",
  ],
  function (exports_4, context_4) {
    "use strict";
    var Point_ts_2,
      Vector_ts_1,
      createBoundVector,
      translateBoundVector,
      getIntersectVect;
    var __moduleName = context_4 && context_4.id;
    return {
      setters: [
        function (Point_ts_2_1) {
          Point_ts_2 = Point_ts_2_1;
        },
        function (Vector_ts_1_1) {
          Vector_ts_1 = Vector_ts_1_1;
        },
      ],
      execute: function () {
        exports_4(
          "createBoundVector",
          createBoundVector = ({ x, y }, origin) => ({ x, y, origin }),
        );
        exports_4(
          "translateBoundVector",
          translateBoundVector = (v) =>
            createBoundVector(Point_ts_2.addPoint(v, v.origin), v.origin),
        );
        exports_4(
          "getIntersectVect",
          getIntersectVect = (bv, v) =>
            Vector_ts_1.getIntersect(
              bv,
              bv.origin,
              v,
              Point_ts_2.createPoint(0, 0),
            ),
        );
      },
    };
  },
);
System.register(
  "https://raw.githubusercontent.com/Baavgai/deno-funcs/master/graph2D/Size",
  [],
  function (exports_5, context_5) {
    "use strict";
    var isSize, createSize;
    var __moduleName = context_5 && context_5.id;
    return {
      setters: [],
      execute: function () {
        exports_5(
          "isSize",
          isSize = (sz) =>
            sz && sz.width && sz.height && typeof (sz.width) === "number" &&
            typeof (sz.height) === "number",
        );
        exports_5(
          "createSize",
          createSize = (width, height) => ({
            width,
            height: height !== undefined ? height : width,
          }),
        );
      },
    };
  },
);
System.register(
  "https://raw.githubusercontent.com/Baavgai/deno-funcs/master/graph2D/Rect",
  ["https://raw.githubusercontent.com/Baavgai/deno-funcs/master/graph2D/Point"],
  function (exports_6, context_6) {
    "use strict";
    var Point_ts_3, translateRect, inRect;
    var __moduleName = context_6 && context_6.id;
    function createRect(ptOrX, szOrY, w = 0, h = 0) {
      const create = (x, y, width, height) => ({ x, y, width, height });
      if (typeof (ptOrX) === "number" && typeof (szOrY) === "number") {
        return create(ptOrX, szOrY, w, h);
      } else if (typeof (ptOrX) !== "number" && typeof (szOrY) !== "number") {
        return create(ptOrX.x, ptOrX.y, szOrY.width, szOrY.height);
      } else {
        return create(0, 0, w, h);
      }
    }
    exports_6("createRect", createRect);
    return {
      setters: [
        function (Point_ts_3_1) {
          Point_ts_3 = Point_ts_3_1;
        },
      ],
      execute: function () {
        exports_6(
          "translateRect",
          translateRect = (r, p) => createRect(Point_ts_3.addPoint(r, p), r),
        );
        exports_6(
          "inRect",
          inRect = (r, p) => {
            const ps = Point_ts_3.subPoint(p, r);
            return ps.x >= 0 && ps.y >= 0 && ps.x < r.width && ps.y < r.height;
          },
        );
      },
    };
  },
);
System.register(
  "https://raw.githubusercontent.com/Baavgai/deno-funcs/master/graph2D/mod",
  [
    "https://raw.githubusercontent.com/Baavgai/deno-funcs/master/graph2D/BoundVector",
    "https://raw.githubusercontent.com/Baavgai/deno-funcs/master/graph2D/functions",
    "https://raw.githubusercontent.com/Baavgai/deno-funcs/master/graph2D/Point",
    "https://raw.githubusercontent.com/Baavgai/deno-funcs/master/graph2D/Rect",
    "https://raw.githubusercontent.com/Baavgai/deno-funcs/master/graph2D/Size",
    "https://raw.githubusercontent.com/Baavgai/deno-funcs/master/graph2D/Vector",
  ],
  function (exports_7, context_7) {
    "use strict";
    var __moduleName = context_7 && context_7.id;
    function exportStar_1(m) {
      var exports = {};
      for (var n in m) {
        if (n !== "default") exports[n] = m[n];
      }
      exports_7(exports);
    }
    return {
      setters: [
        function (BoundVector_ts_1_1) {
          exportStar_1(BoundVector_ts_1_1);
        },
        function (functions_ts_2_1) {
          exportStar_1(functions_ts_2_1);
        },
        function (Point_ts_4_1) {
          exportStar_1(Point_ts_4_1);
        },
        function (Rect_ts_1_1) {
          exportStar_1(Rect_ts_1_1);
        },
        function (Size_ts_1_1) {
          exportStar_1(Size_ts_1_1);
        },
        function (Vector_ts_2_1) {
          exportStar_1(Vector_ts_2_1);
        },
      ],
      execute: function () {
      },
    };
  },
);
System.register(
  "file:///C:/Users/brett/source/repos/github_baavgai/deno-ttt/app/deps",
  ["https://raw.githubusercontent.com/Baavgai/deno-funcs/master/graph2D/mod"],
  function (exports_8, context_8) {
    "use strict";
    var __moduleName = context_8 && context_8.id;
    function exportStar_2(m) {
      var exports = {};
      for (var n in m) {
        if (n !== "default") exports[n] = m[n];
      }
      exports_8(exports);
    }
    return {
      setters: [
        function (mod_ts_1_1) {
          exportStar_2(mod_ts_1_1);
        },
      ],
      execute: function () {
      },
    };
  },
);
System.register(
  "file:///C:/Users/brett/source/repos/github_baavgai/deno-ttt/app/types",
  [],
  function (exports_9, context_9) {
    "use strict";
    var __moduleName = context_9 && context_9.id;
    return {
      setters: [],
      execute: function () {
      },
    };
  },
);
System.register(
  "file:///C:/Users/brett/source/repos/github_baavgai/deno-ttt/app/tttEngine",
  [],
  function (exports_10, context_10) {
    "use strict";
    var ROWS,
      COLS,
      CELL_COUNT,
      EmptyBoard,
      stateInfo,
      print,
      place,
      move,
      bestMove;
    var __moduleName = context_10 && context_10.id;
    return {
      setters: [],
      execute: function () {
        exports_10("ROWS", ROWS = 3),
          exports_10("COLS", COLS = 3),
          exports_10("CELL_COUNT", CELL_COUNT = 9);
        exports_10(
          "EmptyBoard",
          EmptyBoard = [" ", " ", " ", " ", " ", " ", " ", " ", " "],
        );
        exports_10(
          "stateInfo",
          stateInfo = (b) => {
            const playerCheck = (p) =>
              [
                [0, 1, 2],
                [3, 4, 5],
                [6, 7, 8],
                [0, 3, 6],
                [1, 4, 7],
                [2, 5, 8],
                [0, 4, 8],
                [2, 4, 6],
              ].some(([x, y, z]) => p === b[x] && p === b[y] && p === b[z]);
            const allMoves = b.reduce((acc, x, i) =>
              x === " " ? [...acc, i] : acc, []);
            const winner = playerCheck("O")
              ? "O"
              : playerCheck("X")
              ? "X"
              : " ";
            const turn = CELL_COUNT - allMoves.length;
            const done = (turn === CELL_COUNT) || (winner !== " ");
            const playerTurn = done ? " " : ((turn % 2 === 0) ? "X" : "O");
            const availableMoves = done ? [] : allMoves;
            return {
              availableMoves,
              winner,
              turn,
              done,
              playerTurn,
              validMove: (pos) => availableMoves.some((x) => x === pos),
            };
          },
        );
        exports_10(
          "print",
          print = (b, nums = false) => {
            const info = stateInfo(b);
            const pv = (n, v) =>
              " " + (nums ? (v === " " ? `${n}` : v) : v) + " ";
            const p = (n) => pv(n, b[n]);
            const pr = (x, y, z) => `${p(x)}|${p(y)}|${p(z)}`;
            console.log(pr(0, 1, 2));
            console.log("---+---+---");
            console.log(pr(3, 4, 5));
            console.log("---+---+---");
            console.log(pr(6, 7, 8));
            console.log(`Turn: ${info.turn + 1}`);
            if (info.done) {
              console.log(
                info.winner === " "
                  ? "Tie"
                  : `Winner: ${info.winner}`,
              );
            }
            // console.log(info);
            // console.log(`Turn: ${turn(b)}`);
            // if (isDone(g)) { console.log(`Winner: ${g.winner}`); }
            console.log();
          },
        );
        place = (b, pos, value) => {
          const v = (i) => i === pos ? value : b[i];
          return !(stateInfo(b).validMove(pos)) ? [b, false]
          : [[v(0), v(1), v(2), v(3), v(4), v(5), v(6), v(7), v(8)], true];
        };
        exports_10(
          "move",
          move = (b, pos) => {
            const { playerTurn } = stateInfo(b);
            return playerTurn === " " ? [b, false] : place(b, pos, playerTurn);
          },
        );
        exports_10(
          "bestMove",
          bestMove = (b) => {
            const info = stateInfo(b);
            if (info.done) {
              return undefined;
            } else if (info.turn === 0) {
              return 4;
            } else {
            }
          },
        );
      },
    };
  },
);
System.register(
  "file:///C:/Users/brett/source/repos/github_baavgai/deno-ttt/app/app",
  [
    "file:///C:/Users/brett/source/repos/github_baavgai/deno-ttt/app/deps",
    "file:///C:/Users/brett/source/repos/github_baavgai/deno-ttt/app/tttEngine",
  ],
  function (exports_11, context_11) {
    "use strict";
    var deps_ts_1,
      tttEngine_ts_1,
      calcMetrics,
      addListener,
      initContext,
      fillRect,
      draw,
      createStateContainer,
      createApp;
    var __moduleName = context_11 && context_11.id;
    return {
      setters: [
        function (deps_ts_1_1) {
          deps_ts_1 = deps_ts_1_1;
        },
        function (tttEngine_ts_1_1) {
          tttEngine_ts_1 = tttEngine_ts_1_1;
        },
      ],
      execute: function () {
        calcMetrics = (p) => {
          const boxSize = deps_ts_1.createSize(
            Math.floor((p.size - (p.barSize * 2 + p.gutterSize * 2)) / 3),
          );
          const cells = [{ ...boxSize, x: p.gutterSize, y: p.gutterSize }];
          cells.push(
            deps_ts_1.translateRect(
              cells[0],
              { y: 0, x: p.barSize + boxSize.width },
            ),
          );
          cells.push(
            deps_ts_1.translateRect(
              cells[1],
              { y: 0, x: p.barSize + boxSize.width },
            ),
          );
          for (let i = 0; i < 6; i++) {
            cells.push(
              deps_ts_1.translateRect(
                cells[i],
                { x: 0, y: p.barSize + boxSize.height },
              ),
            );
          }
          return { boxSize, cells };
        };
        addListener = ({ ele, cells, size }, hoverListener, clickListener) => {
          const canPos = deps_ts_1.createPoint(ele.offsetLeft, ele.offsetTop);
          const pagePos = (e) => deps_ts_1.createPoint(e.pageX, e.pageY);
          const transPos = (e) => deps_ts_1.subPoint(pagePos(e), canPos);
          const toCell = (e) =>
            cells.findIndex((cell) => deps_ts_1.inRect(cell, transPos(e)));
          const inCell = (f) => (e) => f(toCell(e));
          ele.addEventListener("mousemove", inCell(hoverListener));
          ele.addEventListener("click", inCell(clickListener));
        };
        initContext = (p) => {
          const ele = document.getElementById(p.canvasId);
          const ctx = ele.getContext("2d");
          ele.width = p.size;
          ele.height = p.size;
          return { ele, ctx };
        };
        fillRect = (ctx, r, fillStyle) => {
          ctx.fillStyle = fillStyle;
          ctx.fillRect(r.x, r.y, r.width, r.height);
        };
        draw = (p) => {
          p.ctx.fillStyle = "#000";
          p.ctx.fillRect(0, 0, p.size, p.size);
          const fontSize = Math.floor(p.boxSize.height * 0.8);
          p.ctx.font = `sans-serif`;
          p.ctx.font = `${fontSize}px bold`;
          p.cells.forEach((cell, idx) => {
            const value = p.board[idx];
            if (value === " ") {
              fillRect(p.ctx, cell, idx === p.hover ? "#f00" : "#0f0");
            } else {
              fillRect(p.ctx, cell, "#000");
              const x = cell.x + Math.floor(cell.width / 2);
              const y = cell.y + Math.floor(cell.height / 2);
              p.ctx.fillStyle = "#00f";
              p.ctx.textBaseline = "middle";
              p.ctx.textAlign = "center";
              p.ctx.fillText(p.board[idx], x, y);
            }
          });
        };
        createStateContainer = (initState) => {
          let state = initState;
          return [
            () => state,
            (f) => {
              // console.log(state);
              state = f(state);
              return state;
            },
          ];
        };
        exports_11(
          "createApp",
          createApp = (cfg) => {
            const p = { ...initContext(cfg), ...calcMetrics(cfg) };
            const [getState, setState] = createStateContainer(
              { hover: -1, board: tttEngine_ts_1.EmptyBoard },
            );
            const refresh = (state) => draw({ ...cfg, ...p, ...state });
            const updateHover = (cell) => {
              if (cell !== getState().hover) {
                refresh(setState((s) => ({ ...s, hover: cell })));
              }
            };
            const select = (cell) => {
              if (cell !== -1) {
                refresh(setState((s) => {
                  const [board] = tttEngine_ts_1.move(s.board, cell);
                  return { ...s, board };
                }));
              }
            };
            addListener({ ...p, ...cfg }, updateHover, select);
            refresh(getState());
          },
        );
      },
    };
  },
);
System.register(
  "file:///C:/Users/brett/source/repos/github_baavgai/deno-ttt/app/index",
  ["file:///C:/Users/brett/source/repos/github_baavgai/deno-ttt/app/app"],
  function (exports_12, context_12) {
    "use strict";
    var app_ts_1;
    var __moduleName = context_12 && context_12.id;
    return {
      setters: [
        function (app_ts_1_1) {
          app_ts_1 = app_ts_1_1;
        },
      ],
      execute: function () {
        app_ts_1.createApp({
          canvasId: "gridCanvas",
          size: 500,
          barSize: 10,
          gutterSize: 20,
        });
      },
    };
  },
);

__instantiate(
  "file:///C:/Users/brett/source/repos/github_baavgai/deno-ttt/app/index",
);
