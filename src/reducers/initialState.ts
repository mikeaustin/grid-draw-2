/* eslint @typescript-eslint/no-unused-vars: "off" */

import { State, Point } from '../types';

const initialState: State = {
  currentTool: {
    tool: 'GridDraw.Tools.Move',
  },
  nextShapeId: 10,
  selectedShapeIds: [],
  options: {
    showRuler: true,
    showGrid: true,
    snapToGrid: false,
    showSecondCanvas: false,
    showThirdCanvas: false,
  },
  allShapes: {
    0: {
      id: 0,
      type: 'GridDraw.Shape.Group',
      childIds: [1, 2, 3, 6, 7],
      parentId: -1,
      properties: {
        position: {
          x: 0,
          y: 0,
        },
        fill: {
          hue: 0,
          saturation: 100,
          lightness: 50,
        },
        opacity: 1.0,
        angle: 0,
        cornerRadius: 0,
      }
    },
    1: {
      id: 1,
      type: 'GridDraw.Shape.Rect',
      childIds: [],
      parentId: 0,
      properties: {
        position: {
          x: 100,
          y: 100,
        },
        fill: {
          hue: 340,
          saturation: 100,
          lightness: 60,
        },
        opacity: 1.0,
        angle: 15,
        cornerRadius: 20,
      }
    },
    2: {
      id: 2,
      type: 'GridDraw.Shape.Ellipse',
      childIds: [],
      parentId: 0,
      properties: {
        position: {
          x: 400,
          y: 100,
        },
        fill: {
          hue: 90,
          saturation: 100,
          lightness: 50,
        },
        opacity: 1.0,
        angle: 0,
        cornerRadius: 0,
      }
    },
    3: {
      id: 3,
      type: 'GridDraw.Shape.Group',
      childIds: [4, 5],
      parentId: 0,
      properties: {
        position: {
          x: 600,
          y: 100,
        },
        fill: {
          hue: 0,
          saturation: 100,
          lightness: 50,
        },
        opacity: 1.0,
        angle: 0,
        cornerRadius: 0,
      }
    },
    4: {
      id: 4,
      type: 'GridDraw.Shape.Ellipse',
      childIds: [],
      parentId: 3,
      properties: {
        position: {
          x: 0,
          y: 0,
        },
        fill: {
          hue: 180,
          saturation: 100,
          lightness: 50,
        },
        opacity: 1.0,
        angle: 0,
        cornerRadius: 0,
      }
    },
    5: {
      id: 5,
      type: 'GridDraw.Shape.Ellipse',
      childIds: [],
      parentId: 3,
      properties: {
        position: {
          x: 0,
          y: 150,
        },
        fill: {
          hue: 60,
          saturation: 95,
          lightness: 50,
        },
        opacity: 1.0,
        angle: 0,
        cornerRadius: 0,
      }
    },
    6: {
      id: 6,
      type: 'GridDraw.Shape.Path',
      childIds: [],
      parentId: 0,
      properties: {
        position: {
          x: 100,
          y: 500,
        },
        fill: {
          hue: 190,
          saturation: 100,
          lightness: 50,
        },
        opacity: 1.0,
        angle: 0,
        cornerRadius: 0,
        bezierNodes: new Int16Array([
          0, 0,
          100, 100, 250, -100,
          200, 0,
          250, 100, 100, -100,
          0, 0,
        ]),
      }
    },
    7: {
      id: 7,
      type: 'GridDraw.Shape.Text',
      childIds: [],
      parentId: 0,
      properties: {
        position: {
          x: 400,
          y: 500,
        },
        fill: {
          hue: 0,
          saturation: 100,
          lightness: 0,
        },
        opacity: 1.0,
        angle: 0,
      }
    }
  }
};

export default initialState;
