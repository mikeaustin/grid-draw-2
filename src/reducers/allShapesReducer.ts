/* eslint @typescript-eslint/no-unused-vars: "off" */

import expr from 'property-expr';

import initialState from './initialState';
import { State, Action } from '../types';

const clone = value => {
  if (Array.isArray(value) || value instanceof Int16Array) {
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
      const { shapeId, propertyName, propertyValue } = payload;

      console.log('SET_SHAPE_PROPERTY', shapeId, propertyName, propertyValue);

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
  position: { x: number, y: number; },
) => State['allShapes'];

const addShape: AddShapeFunc = (allShapes, type, shapeId, position) => {
  return {
    ...allShapes,
    0: {
      ...allShapes[0],
      childIds: [...allShapes[0].childIds, shapeId]
    },
    [shapeId]: {
      id: shapeId,
      type: type,
      childIds: [],
      properties: {
        position: position,
        fill: {
          hue: 0,
          saturation: 100,
          lightness: 50,
        },
        opacity: 1.0,
        angle: 0,
        cornerRadius: 10,
        bezierNodes: new Int16Array([
          0, 0,
          100, 100, 250, -100,
          200, 0,
          250, 100, 100, -100,
          0, 0,
        ]),
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
