export type Vector = { x: number; y: number };

export function add(a: Vector, b: Vector): Vector {
  return { x: a.x + b.x, y: a.y + b.y };
}

export function subtract(a: Vector, b: Vector): Vector {
  return { x: a.x - b.x, y: a.y - b.y };
}

export function fromTo(b: Vector, a: Vector): Vector {
  return subtract(a, b);
}

export function scale(a: Vector, b: number): Vector {
  return { x: a.x * b, y: a.y * b };
}

export function negate(a: Vector): Vector {
  return scale(a, -1);
}

export function dot(a: Vector, b: Vector): number {
  return a.x * b.x + a.y * b.y;
}

export function cross(a: Vector, b: Vector): number {
  return a.x * b.y - a.y * b.x;
}

export function magnitude(a: Vector): number {
  return Math.sqrt(a.x ** 2 + a.y ** 2);
}

export function normalize(a: Vector): Vector {
  return scale(a, 1 / magnitude(a));
}

export function distance(a: Vector, b: Vector): number {
  return magnitude(subtract(a, b));
}

export function angle(a: Vector, b: Vector): number {
  return Math.acos(dot(a, b) / (magnitude(a) * magnitude(b)));
}

export function rotate(a: Vector, angle: number): Vector {
  return {
    x: a.x * Math.cos(angle) - a.y * Math.sin(angle),
    y: a.x * Math.sin(angle) + a.y * Math.cos(angle),
  };
}

export function project(a: Vector, b: Vector): Vector {
  return scale(b, dot(a, b) / dot(b, b));
}

export function normal(a: Vector): Vector {
  return { x: -a.y, y: a.x };
}

export function reflect(a: Vector, normal: Vector): Vector {
  return subtract(a, scale(normal, (2 * dot(a, normal)) / dot(normal, normal)));
}

export function lerp(a: Vector, b: Vector, t: number): Vector {
  return add(a, scale(subtract(b, a), t));
}

export function clamp(a: Vector, min: Vector, max: Vector): Vector {
  return {
    x: Math.min(Math.max(a.x, min.x), max.x),
    y: Math.min(Math.max(a.y, min.y), max.y),
  };
}
