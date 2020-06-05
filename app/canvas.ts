import { Rect, Size, createSize, subPoint, createPoint, inRect, translateRect } from "./deps.ts";
import { Config } from "./types.ts";
import { Board, EmptyBoard, move } from "./tttEngine.ts";


export const fillRect = (ctx: CanvasRenderingContext2D, r: Rect, fillStyle: string | CanvasGradient | CanvasPattern) => {
  ctx.fillStyle = fillStyle;
  ctx.fillRect(r.x, r.y, r.width, r.height);
};

export const textCenter = (ctx: CanvasRenderingContext2D, r: Rect, text: string) => {
  const x = r.x + Math.floor(r.width / 2);
  const y = r.y + Math.floor(r.height / 2);
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.fillText(text, x, y);
};
