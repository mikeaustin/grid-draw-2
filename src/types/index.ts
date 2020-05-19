import State, { Action } from './State';
import Shape from './Shape';
import Properties from './Properties';

type Size = 'none' | 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';

class _Point {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

const Point = (x, y) => new _Point(x, y);

export type {
  State,
  Action,
  Point,
  Shape,
  Properties,
  Size,
};
