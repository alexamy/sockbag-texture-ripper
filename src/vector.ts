export type Vector = { x: number; y: number };

const Zero = () => ({ x: 0, y: 0 } satisfies Vector);
const Up = () => ({ x: 0, y: -1 } satisfies Vector);
const Down = () => ({ x: 0, y: 1 } satisfies Vector);
const Left = () => ({ x: -1, y: 0 } satisfies Vector);
const Right = () => ({ x: 1, y: 0 } satisfies Vector);

export const v = {
  Zero,
  Up,
  Down,
  Left,
  Right,
  make,
  add,
  subtract,
  fromTo,
  scale,
  negate,
  abs,
  equals,
  dot,
  cross,
  length,
  normalize,
  distance,
  angle,
  rotate,
  project,
  normal,
  reflect,
  lerp,
  clamp,
  average,
};

function make(x: number = 0, y: number = 0): Vector {
  return { x, y };
}

function add(a: Vector, b: Vector): Vector {
  return { x: a.x + b.x, y: a.y + b.y };
}

function subtract(a: Vector, b: Vector): Vector {
  return { x: a.x - b.x, y: a.y - b.y };
}

function fromTo(b: Vector, a: Vector): Vector {
  return subtract(a, b);
}

function scale(a: Vector, b: number): Vector {
  return { x: a.x * b, y: a.y * b };
}

function negate(a: Vector): Vector {
  return scale(a, -1);
}

function abs(a: Vector): Vector {
  return { x: Math.abs(a.x), y: Math.abs(a.y) };
}

function equals(a: Vector, b: Vector): boolean {
  return a.x === b.x && a.y === b.y;
}

// 0 => same direction, 0.5 => orthogonal, 1 => opposite direction
function dot(a: Vector, b: Vector): number {
  return a.x * b.x + a.y * b.y;
}

// > 0 => a is clockwise from b, < 0 => a is counterclockwise from b
function cross(a: Vector, b: Vector): number {
  return a.x * b.y - a.y * b.x;
}

function length(a: Vector): number {
  return Math.sqrt(a.x ** 2 + a.y ** 2);
}

function normalize(a: Vector): Vector {
  return scale(a, 1 / length(a));
}

function distance(a: Vector, b: Vector): number {
  return length(subtract(a, b));
}

function angle(a: Vector, b: Vector): number {
  return Math.acos(dot(a, b) / (length(a) * length(b)));
}

function rotate(a: Vector, angle: number): Vector {
  return {
    x: a.x * Math.cos(angle) - a.y * Math.sin(angle),
    y: a.x * Math.sin(angle) + a.y * Math.cos(angle),
  };
}

function project(a: Vector, b: Vector): Vector {
  return scale(b, dot(a, b) / dot(b, b));
}

function normal(a: Vector): Vector {
  return { x: -a.y, y: a.x };
}

function reflect(a: Vector, normal: Vector): Vector {
  return subtract(a, scale(normal, (2 * dot(a, normal)) / dot(normal, normal)));
}

function lerp(a: Vector, b: Vector, t: number): Vector {
  return add(a, scale(subtract(b, a), t));
}

function clamp(a: Vector, min: Vector, max: Vector): Vector {
  return {
    x: Math.min(Math.max(a.x, min.x), max.x),
    y: Math.min(Math.max(a.y, min.y), max.y),
  };
}

function average(vs: Vector[]): Vector {
  return vs.length === 0
    ? Zero()
    : scale(vs.reduce(add, Zero()), 1 / vs.length);
}
