export class SliderHandle {

  private _x: number;
  private _y: number;
  private _width: number;
  private _height: number;
  private _color: string;

  constructor(x: number, y: number, width: number, height: number, color: string) {
    this._x = x;
    this._y = y;
    this._width = width;
    this._height = height;
    this._color = color;
  }

  set x(value: number) {
    this._x = value;
  }

  get x(): number {
    return this._x;
  }

  set y(value: number) {
    this._y = value;
  }

  get y(): number {
    return this._y;
  }

  set width(value: number) {
    this._width = value;
  }

  get width(): number {
    return this._width;
  }

  set height(value: number) {
    this._height = value;
  }

  get height(): number {
    return this._height;
  }

  set color(value: string) {
    this._color = value;
  }

  get color(): string {
    return this._color;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
