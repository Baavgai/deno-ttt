import { Rect, Size, createSize, subPoint, createPoint, inRect, translateRect, createRect } from "./deps.ts";
import { Config } from "./types.ts";
import { Board, EmptyBoard, move } from "./tttEngine.ts";
import { fillRect, textCenter } from "./canvas.ts";

interface Metrics {
  boxSize: Size;
  viewPort: Rect;
  boardBounds: Rect;
  cells: Rect[];
  fontSize: number;
}

interface Props extends Metrics {
  ele: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
}

interface State {
  hover: number;
  board: Board
}

type AppProps = Props & State;

const Color = {
  Background: "#000",
  Hover: "#004",
  Line: "#0ff",
  Player: "#00f",
}


const calcMetrics = (p: Config): Metrics => {
  const boxSize = createSize(Math.floor((p.size - (p.barSize * 2 + p.gutterSize * 2)) / 3));
  const cells: Rect[] = [{ ...boxSize, x: p.gutterSize, y: p.gutterSize }];
  cells.push(translateRect(cells[0], { y: 0, x: p.barSize + boxSize.width }));
  cells.push(translateRect(cells[1], { y: 0, x: p.barSize + boxSize.width }));
  for (let i = 0; i < 6; i++) { cells.push(translateRect(cells[i], { x: 0, y: p.barSize + boxSize.height })); }
  // const viewPort: Size;
  // const boardBounds = createRect(cells[0].x, cells[0].y, cells[8].x + cells[8].width, cells[8].y + cells[8].height);
  // const boardBounds = createRect(cells[0].x, cells[0].y, cells[8].x, cells[8].y);
  const boardBounds = createRect(cells[0].x, cells[0].y, cells[8].x + cells[8].width - cells[0].x, cells[8].y + cells[8].height - cells[0].y);
  const viewPort = createRect(0, 0, boardBounds.width + p.gutterSize * 2, boardBounds.height + p.gutterSize * 2);
  const fontSize = Math.floor(boxSize.height * 0.8);
  return { boxSize, cells, boardBounds, viewPort, fontSize };
};

const addListener = ({ ele, cells }: Config & Props, hoverListener: (cell: number) => void, clickListener: (cell: number) => void) => {
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


const draw = (p: AppProps) => {
  fillRect(p.ctx, p.viewPort, Color.Background);
  fillRect(p.ctx, p.boardBounds, Color.Line);
  p.ctx.font = `${p.fontSize}px bold sans-serif`;

  p.cells.forEach((cell, idx) => {
    const value = p.board[idx];
    if (value === " ") {
      fillRect(p.ctx, cell, idx === p.hover ? Color.Hover : Color.Background);

    } else {
      fillRect(p.ctx, cell, Color.Background);
      p.ctx.fillStyle = Color.Player;
      textCenter(p.ctx, cell, p.board[idx])
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
  const refresh = state => draw({ ...cfg, ...p, ...state })

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
  addListener({ ...p, ...cfg }, updateHover, select);
  refresh(getState());
};
