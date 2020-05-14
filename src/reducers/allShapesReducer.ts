import expr from 'property-expr';

import initialState from './initialState';
import { State, Action } from '../types';

const clone = value => {
  if (Array.isArray(value)) {
    return value.map(item => clone(item));
  }

  if (typeof value === 'object') {
    return Object.entries(value).reduce((acc, [key, value]) => ({
      ...acc,
      [key]: clone(value)
    }), {});
  }

  return value;
};

const allShapesReducer = (allShapes: State['allShapes'], action: Action) => {
  const { type, payload } = action;

  switch (type) {
    case 'SET_SHAPE_PROPERTY': {
      const { shapeId, propertyName, index, propertyValue } = payload;

      console.log('SET_SHAPE_PROPERTY', shapeId, propertyName, index, propertyValue);

      let updatedProperties = clone(allShapes[shapeId].properties);
      expr.setter(propertyName)(updatedProperties, propertyValue);

      return {
        ...allShapes,
        [shapeId]: {
          ...allShapes[shapeId],
          properties: {
            ...allShapes[shapeId].properties,
            ...updatedProperties,
          }
        }
      };
    }
  }

  return allShapes;
};

type AddShapeFunc = (
  allShapes: State['allShapes'],
  type: string,
  shapeId: number,
  position: number[]
) => State['allShapes'];

const addShape: AddShapeFunc = (allShapes, type, shapeId, position) => {
  return {
    ...allShapes,
    [0]: {
      ...allShapes[0],
      childIds: [...allShapes[0].childIds, shapeId]
    },
    [shapeId]: {
      id: shapeId,
      type: type,
      childIds: [],
      properties: {
        position: [position[0], position[1]],
        hue: 0,
        opacity: 0.75,
        angle: 0,
      }
    }
  };
};

const stateReducer = (state: State, action: Action): State => {
  const { type, payload } = action;

  switch (type) {
    case 'ADD_SHAPE': {
      const { position } = payload;

      return {
        ...state,
        nextShapeId: state.nextShapeId + 1,
        allShapes: addShape(state.allShapes, payload.type, state.nextShapeId, position),
      };
    }
    case 'SELECT_TOOL':
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
    case 'SELECT_SHAPE':
      const { shapeId } = payload;

      return {
        ...state,
        selectedShapeIds: [shapeId],
      };
    default:
      return {
        ...state,
        allShapes: allShapesReducer(state.allShapes, action)
      };
  };
};

export {
  allShapesReducer,
  stateReducer,
  initialState,
};
