/* eslint @typescript-eslint/no-unused-vars: "off" */

import React, { useReducer, useCallback, useRef, useMemo, useEffect } from 'react';
import { StyleSheet, View } from 'react-native-web';

import { initialState, stateReducer } from './reducers/allShapesReducer';
import { State, Shape, Properties } from './types';
import { AppContext, AllShapesContext, SelectedShapeContext } from './AppContext';

import AppCanvas from './components/app/AppCanvas';
import MainToolbar from './components/app/MainToolbar';
import ShapesPanel from './components/app/ShapesPanel';
import PropertiesPanel from './components/app/PropertiesPanel';
import Palette from './components/shared/Palette';
import { EventEmitter } from 'events';

import { List } from './components/core';

const styles = StyleSheet.create({
  app: {
    height: '100vh',
  },
});

const eventEmitter = new EventEmitter();

const useSelf = (props) => {
  const self = useRef({ ...props });

  useEffect(() => {
    self.current = { ...self.current, ...props };
  }, [props]);

  return self;
};

function App() {
  console.log('App()');

  const [state, dispatch] = useReducer(stateReducer, initialState);
  const allShapes = useRef({ ...state.allShapes });

  useEffect(() => {
    allShapes.current = Object.assign(allShapes.current, state.allShapes);
  }, [state.allShapes]);

  const handleShapeUpdate = useCallback((shapeId: number, shapeProperties: Properties) => {
    if (state.options.snapToGrid && shapeProperties.position) {
      shapeProperties.position = {
        x: Math.round((shapeProperties.position.x / 10)) * 10,
        y: Math.round(shapeProperties.position.y / 10) * 10,
      };
    }

    const updatedShape = {
      ...allShapes.current[shapeId],
      properties: {
        ...allShapes.current[shapeId].properties,
        ...shapeProperties,
      }
    };

    Object.keys(shapeProperties).forEach(eventType => {
      eventEmitter.emit(eventType, updatedShape);
    });
  }, [allShapes, state.options]);

  const handlePropertyChange = useCallback((shapeId: number, name: string, value: any) => {
    if (state.options.snapToGrid && name === 'position') {
      value = {
        x: Math.round((value.x / 10)) * 10,
        y: Math.round(value.y / 10) * 10,
      };
    }

    dispatch({
      type: 'SET_SHAPE_PROPERTY',
      payload: {
        shapeId: shapeId,
        propertyName: name,
        propertyValue: value,
      }
    });
  }, [state.options.snapToGrid, dispatch]);

  const appContext = useMemo(() => ({
    currentTool: state.currentTool,
    options: state.options,
    eventEmitter: eventEmitter,
  }), [state.currentTool, state.options]);

  const selectedShapeContext = useMemo(() => ({
    selectedShapeIds: state.selectedShapeIds,
    onShapeUpdate: handleShapeUpdate,
    onPropertyChange: handlePropertyChange,
  }), [state.selectedShapeIds, handleShapeUpdate, handlePropertyChange]);

  const stateView = useMemo(() => ({ ...state }), [state]);

  useEffect(() => {
    const selectedShape = state.allShapes[state.selectedShapeIds[0]];

    if (selectedShape) {
      Object.keys(selectedShape.properties).forEach(propertyName => (
        appContext.eventEmitter.emit(propertyName, selectedShape)
      ));
    }
  }, [appContext, state.allShapes, state.selectedShapeIds]);

  return (
    <AppContext.Provider value={appContext}>
      <AllShapesContext.Provider value={state.allShapes}>
        <SelectedShapeContext.Provider value={selectedShapeContext}>
          <View style={styles.app}>
            <MainToolbar currentTool={state.currentTool} dispatch={dispatch} />
            <List divider dividerColor="#d0d0d0" style={{ flex: 1, flexDirection: 'row' }}>
              <ShapesPanel
                allShapes={state.allShapes}
                dispatch={dispatch}
              />
              <List divider dividerColor="#d0d0d0" style={{ flex: 1 }}>
                <List horizontal divider dividerColor="#d0d0d0" style={{ flex: 1 }}>
                  <AppCanvas state={state} dispatch={dispatch} />
                  {state.options.showSecondCanvas && (
                    <AppCanvas state={state} dispatch={dispatch} scale={0.5} />
                  )}
                </List>
                {state.options.showThirdCanvas && (
                  <AppCanvas state={state} dispatch={dispatch} scale={2.0} />
                )}
                <Palette selectedShapeId={state.selectedShapeIds[0]} />
              </List>
              <PropertiesPanel
                selectedShape={state.allShapes[state.selectedShapeIds[0]]}
                dispatch={dispatch}
              />
            </List>
          </View>
        </SelectedShapeContext.Provider>
      </AllShapesContext.Provider>
    </AppContext.Provider>
  );
}

// const sub = (a: number, b: number) => a - b;
// const sub = (a: string, b: string) => a;

function add(a: number, b: number): number;
function add(a: string, b: string): string;

function add(a: any, b: any): any {
  return a + b;
}

// console.log(add(3, 2));

function method(types: any[], f: Function, cont?: Function) {
  return (...args) => {
    if (args.every((arg, index) => (
      arg.valueOf() === types[index].valueOf() || arg.constructor === types[index]
    ))) {
      return f(...args);
    }

    if (cont) {
      return cont(...args);
    }

    throw new Error('No match');
  };
}

function method2(types: any[], f: Function) {
  return (...args) => {
    if (args.every((arg, index) => (
      arg.valueOf() === types[index].valueOf() || arg.constructor === types[index]
    ))) {
      return f(...args);
    }

    // throw new Error('No match');
    return null;
  };
}

function multi2(method, delegate) {
  return (...args) => {
    const result = method(...args);

    if (result !== null) {
      return result;
    }

    if (delegate) {
      return delegate(...args);
    }

    throw new Error('No match');
  };
}

const add2 = method([Number, Number], (a, b) => a + b);
const add3 = method([1, 2], () => 3, add2);
const add4 = method([String, Number], (a, b) => 100, add3);

// console.log('>>>', add3(1, 2));
// console.log('>>>', add3(2, 3));
// console.log('>>>', add4('x', 3));

const add5 = method([Number, Number], (a, b) => a + b);
const add6 = multi2(method([1, 2], () => 3), add5);


// function add<T>(a: T, b: T): T {
//   return a + b;
// }

export default App;
