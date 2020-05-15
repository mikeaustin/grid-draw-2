import { State } from '../types';

const initialState: State = {
  currentTool: {
    tool: 'GridDraw.Tools.Move',
  },
  nextShapeId: 10,
  selectedShapeIds: [],
  options: {
    showRuler: true,
    showGrid: true,
    showSecondCanvas: true,
    showThirdCanvas: true,
  },
  allShapes: {
    0: {
      id: 0,
      type: 'GridDraw.Shape.Group',
      childIds: [1, 2, 3],
      properties: {
        position: [0, 0],
        fill: {
          hue: 0,
          saturation: 100,
          lightness: 50,
        },
        opacity: 1.0,
        angle: 0,
      }
    },
    1: {
      id: 1,
      type: 'GridDraw.Shape.Rect',
      childIds: [],
      properties: {
        position: [100, 100],
        fill: {
          hue: 0,
          saturation: 100,
          lightness: 50,
        },
        opacity: 1.0,
        angle: 45,
      }
    },
    2: {
      id: 2,
      type: 'GridDraw.Shape.Ellipse',
      childIds: [],
      properties: {
        position: [250, 100],
        fill: {
          hue: 90,
          saturation: 100,
          lightness: 50,
        },
        opacity: 0.75,
        angle: 0,
      }
    },
    3: {
      id: 3,
      type: 'GridDraw.Shape.Group',
      childIds: [4, 5],
      properties: {
        position: [400, 100],
        fill: {
          hue: 0,
          saturation: 100,
          lightness: 50,
        },
        opacity: 0.5,
        angle: 0,
      }
    },
    4: {
      id: 4,
      type: 'GridDraw.Shape.Ellipse',
      childIds: [],
      properties: {
        position: [0, 0],
        fill: {
          hue: 180,
          saturation: 100,
          lightness: 50,
        },
        opacity: 1.0,
        angle: 0,
      }
    },
    5: {
      id: 5,
      type: 'GridDraw.Shape.Ellipse',
      childIds: [],
      properties: {
        position: [0, 150],
        fill: {
          hue: 270,
          saturation: 100,
          lightness: 50,
        },
        opacity: 0.5,
        angle: 0,
      }
    },
  }
};

export default initialState;
