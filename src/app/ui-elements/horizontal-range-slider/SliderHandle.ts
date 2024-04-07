export class SliderHandle {

  private _x: number;
  private readonly _y: number;
  private _width: number;
  private _height: number;
  private readonly _baseColor: string;
  private readonly _activeColor: string;
  private readonly _hoverColor: string;
  private _valueRef: string;
  public hover: boolean = false;
  public active: boolean = false;

  constructor(x: number, y: number, width: number, height: number, valueRef:string, baseColor: string = '#ffffff', hoverColor: string = '#cccccc', activeColor: string =  '#9c9c9c') {
    this._x = x;
    this._y = y;
    this._width = width;
    this._height = height;
    this._baseColor = baseColor;
    this._activeColor = activeColor;
    this._hoverColor = hoverColor;
    this._valueRef = valueRef;
  }

  set x(value: number) {
    this._x = value;
  }

  get x(): number {
    return this._x;
  }

  get valueRef(): string
  {
    return this._valueRef
  }

  set valueRef(value: string)
  {
    this._valueRef = value;
  }

  /*set y(value: number) {
    this._y = value;
  }*/

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

  /*set color(value: string) {
    this._color = value;
  }

  get color(): string {
    return this._color;
  }*/

  hitTest(point: [number, number]) {
    return (point[0] >= this.x &&        // right of the left edge AND
      point[0] <= this.x + this.width &&   // left of the right edge AND
      point[1] >= this.y &&        // below the top AND
      point[1] <= this.y + this.height)
  }

  draw(ctx: CanvasRenderingContext2D) {
    let fillColor: string = this._baseColor;
    if(this.active) fillColor = this._activeColor;
    if(this.hover && !this.active) fillColor = this._hoverColor;
    ctx.fillStyle = fillColor;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
