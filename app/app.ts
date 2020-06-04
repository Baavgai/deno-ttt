import { Rect, Size, createSize, subPoint, createPoint, inRect, translateRect } from "./deps.ts";
import { Config } from "./types.ts";
import { Board, EmptyBoard, move } from "./tttEngine.ts";

interface Props {
  ele: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  boxSize: Size;
  cells: Rect[];
}

interface State {
  hover: number;
  board: Board
}

type AppProps = Config & Props & State;

const calcMetrics = (p: Config) => {
  const boxSize = createSize(Math.floor((p.size - (p.barSize * 2 + p.gutterSize * 2)) / 3));
  const cells: Rect[] = [{ ...boxSize, x: p.gutterSize, y: p.gutterSize }];
  cells.push(translateRect(cells[0], { y: 0, x: p.barSize + boxSize.width }));
  cells.push(translateRect(cells[1], { y: 0, x: p.barSize + boxSize.width }));
  for (let i = 0; i < 6; i++) { cells.push(translateRect(cells[i], { x: 0, y: p.barSize + boxSize.height })); }
  return { boxSize, cells };
};

const addListener = ({ ele, cells, size }: Config & Props, hoverListener: (cell: number) => void, clickListener: (cell: number) => void) => {
  const canPos = createPoint(ele.offsetLeft, ele.offsetTop);
  const pagePos = (e: MouseEvent) => createPoint(e.pageX, e.pageY);
  const transPos = (e: MouseEvent) => subPoint(pagePos(e), canPos);
  const toCell = (e: MouseEvent) => cells.findIndex(cell => inRect(cell, transPos(e)));
  const inCell = (f: (cell: number) => void) => (e: MouseEvent) => f(toCell(e));
  ele.addEventListener("mousemove", inCell(hoverListener));
  ele.addEventListener("click", inCell(clickListener));
};

const initContext = (p: Config) => {
  const ele = document.getElementById(p.canvasId) as HTMLCanvasElement;
  const ctx = ele.getContext("2d")!;
  ele.width = p.size;
  ele.height = p.size;
  return { ele, ctx };
};


const fillRect = (ctx: CanvasRenderingContext2D, r: Rect, fillStyle: string | CanvasGradient | CanvasPattern) => {
  ctx.fillStyle = fillStyle;
  ctx.fillRect(r.x, r.y, r.width, r.height);
};


const draw = (p: AppProps) => {
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
}

const createStateContainer = <TState>(initState: TState): [() => TState, (f: (state: TState) => TState) => TState] => {
  let state = initState;
  return [
    () => state,
    (f: (state: TState) => TState) => {
      // console.log(state);
      state = f(state);
      return state;
    }];
};

export const createApp = (cfg: Config) => {
  const p: Props = { ...initContext(cfg), ...calcMetrics(cfg) } as const;
  const [getState, setState] = createStateContainer<State>({ hover: -1, board: EmptyBoard });
  const refresh = state => draw({...cfg, ...p, ...state })

  const updateHover = (cell: number) => {
    if (cell !== getState().hover) {
      refresh(setState(s => ({ ...s, hover: cell })));
    }
  };
  const select = (cell: number) => {
    if (cell !== -1) {
      refresh(setState(s => {
        const [board] = move(s.board, cell);
        return { ...s, board };
      }));
    }
  };
  addListener({...p, ...cfg}, updateHover, select);
  refresh(getState());
};
