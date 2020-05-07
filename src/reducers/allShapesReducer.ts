type _State = {
  currentTool: {
    tool: string,
    shape?: string;
  },
  nextShapeId: number,
  selectedShapeIds: number[],
  selectedShapeElements: (SVGElement | null)[],
  options: {
    showRuler: boolean;
  },
  allShapes: {
    [shapeId: string]: {
      id: number,
      type: string,
      position: number[];
      opacity: number,
      childIds: number[],
    };
  };
};

const initialState: State = {
  currentTool: {
    tool: 'GridDraw.Tools.Move',
  },
  nextShapeId: 10,
  selectedShapeIds: [],
  selectedShapeElements: [],
  options: {
    showRuler: true
  },
  allShapes: {
    0: { id: 0, type: 'GridDraw.Group', position: [0, 0], opacity: 1.0, childIds: [1, 2, 3] },
    1: { id: 1, type: 'GridDraw.Ellipse', position: [100, 100], opacity: 0.75, childIds: [] },
    2: { id: 2, type: 'GridDraw.Ellipse', position: [250, 100], opacity: 0.5, childIds: [] },
    3: { id: 3, type: 'GridDraw.Group', position: [400, 100], opacity: 0.25, childIds: [4, 5] },
    4: { id: 4, type: 'GridDraw.Ellipse', position: [0, 0], opacity: 1.0, childIds: [] },
    5: { id: 5, type: 'GridDraw.Ellipse', position: [0, 150], opacity: 0.5, childIds: [] },
  }
};

const allShapesReducer = (allShapes: State['allShapes'], action) => {
  const { type, payload } = action;

  switch (type) {
    case 'set-shape-position': {
      const { shapeId, position } = payload;

      return {
        ...allShapes,
        [shapeId]: {
          ...allShapes[shapeId],
          position: position,
        }
      };
    }
    case 'set-shape-opacity': {
      const { shapeId, opacity } = payload;

      return {
        ...allShapes,
        [shapeId]: {
          ...allShapes[shapeId],
          opacity: opacity,
        }
      };
    }
  }

  return allShapes;
};

const addShape = (allShapes: State['allShapes'], type, shapeId, position) => {
  return {
    ...allShapes,
    [0]: {
      ...allShapes[0],
      childIds: [...allShapes[0].childIds, shapeId]
    },
    [shapeId]: {
      id: shapeId,
      type: type,
      position: [position[0], position[1]],
      opacity: 0.75,
      childIds: [],
    }
  };
};

const stateReducer = (state: State, action): State => {
  const { type, payload } = action;

  switch (type) {
    case 'ADD_SHAPE': {
      const { position } = payload;

      return {
        ...state,
        nextShapeId: state.nextShapeId + 1,
        allShapes: addShape(state.allShapes, payload.shape, state.nextShapeId, position),
      };
    }
    case 'select-tool':
      return {
        ...state,
        currentTool: payload,
      };
    case 'TOGGLE_OPTION':
      const { option } = payload;

      return {
        ...state,
        options: {
          ...state.options,
          [option]: !state.options[option]
        }
      };
    case 'select-shape':
      const { shapeId, element } = payload;

      return {
        ...state,
        selectedShapeIds: [shapeId],
        selectedShapeElements: [element],
      };
    default:
      return {
        ...state,
        allShapes: allShapesReducer(state.allShapes, action)
      };
  };
};

export type State = _State;

export {
  allShapesReducer,
  stateReducer,
  initialState,
};
