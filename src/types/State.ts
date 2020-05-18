import Shape from './Shape';

type State = {
  currentTool: {
    tool: string,
    type?: string;
  },
  nextShapeId: number,
  selectedShapeIds: number[],
  options: {
    showRuler: boolean,
    showGrid: boolean,
    snapToGrid: boolean,
    showSecondCanvas: boolean,
    showThirdCanvas: boolean,
  },
  allShapes: {
    [shapeId: number]: Shape;
  };
};

type Action = {
  type: string,
  payload: any,
};

export default State;

export type {
  Action
};
