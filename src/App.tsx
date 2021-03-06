/* eslint @typescript-eslint/no-unused-vars: "off" */

import React, { useReducer, useCallback, useRef, useMemo, useEffect } from 'react';
import { StyleSheet, View } from 'react-native-web';
import { GlobalHotKeys } from "react-hotkeys";
import expr from 'property-expr';

import { initialState, stateReducer } from './reducers/allShapesReducer';
import { State, Shape, Properties } from './types';
import { AppContext, AllShapesContext, SelectedShapeContext } from './AppContext';
import { useEvent } from './utilities/hooks';

import AppCanvas from './components/app/AppCanvas';
import MainToolbar from './components/app/MainToolbar';
import ShapesPanel from './components/app/ShapesPanel';
import PropertiesPanel from './components/app/PropertiesPanel';
import ColorPalette from './components/shared/ColorPalette';
import { EventEmitter } from 'events';

import { List } from './components/core';

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

const styles = StyleSheet.create({
  app: {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },
});

const eventEmitter = new EventEmitter();

const updateShapeProperties = (state, shapeId, properties) => {
  const selectedShape = state.allShapes[state.selectedShapeIds[0]];

  return ({
    ...state.allShapes[shapeId],
    properties: {
      ...state.allShapes[shapeId].properties,
      ...Object.entries(properties).reduce((acc, [propertyName, propertyValue]) => {
        const index = propertyName.indexOf('.');

        if (index >= 0) {
          const rootPropertyName = propertyName.slice(0, index);
          const branchPropertyNames = propertyName.slice(index);

          let updatedPropertyValue = clone(selectedShape.properties[rootPropertyName]);
          expr.setter(branchPropertyNames)(updatedPropertyValue, propertyValue);

          return {
            ...acc,
            [rootPropertyName]: updatedPropertyValue
          };
        }

        return {
          ...acc,
          [propertyName]: propertyValue
        };
      }, {}),
    }
  });
};

const keyMap = {
  SNAP_LEFT: "command+left",
  DELETE_SHAPE: ["del", "backspace"]
};

function App() {
  console.log('App()');

  const [state, dispatch] = useReducer(stateReducer, initialState);

  const handleShapeUpdate = useEvent((shapeId: number, shapeProperties: Properties, [state]) => {
    // console.log('handleShapeUpdate()');

    if (state.options.snapToGrid && shapeProperties.position) {
      shapeProperties.position = {
        x: Math.round((shapeProperties.position.x / 10)) * 10,
        y: Math.round(shapeProperties.position.y / 10) * 10,
      };
    }

    const updatedShape = updateShapeProperties(state, shapeId, shapeProperties);

    Object.keys(shapeProperties).forEach(eventType => {
      const rootProperty = eventType.split('.')[0];

      eventEmitter.emit(rootProperty, updatedShape);
    });
  }, [state]);

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
          <GlobalHotKeys
            key={Math.random()}
            keyMap={keyMap}
            handlers={{
              DELETE_SHAPE: () => dispatch({ type: 'DELETE_SHAPE', payload: { shapeId: state.selectedShapeIds[0] } })
            }}
          />
          <View style={styles.app}>
            <MainToolbar currentTool={state.currentTool} dispatch={dispatch} />
            <List divider dividerColor="#d8d8d8" style={{ flex: 1, flexDirection: 'row' }}>
              <ShapesPanel
                allShapes={state.allShapes}
                dispatch={dispatch}
              />
              <List divider dividerColor="#d8d8d8" style={{ flex: 1 }}>
                <List horizontal divider dividerColor="#d8d8d8" style={{ flex: 1 }}>
                  <AppCanvas state={state} dispatch={dispatch} />
                  {state.options.showSecondCanvas && (
                    <AppCanvas state={state} dispatch={dispatch} scale={0.5} />
                  )}
                </List>
                {state.options.showThirdCanvas && (
                  <AppCanvas state={state} dispatch={dispatch} scale={2.0} />
                )}
                <ColorPalette />
              </List>
              <PropertiesPanel
                selectedShapeId={state.selectedShapeIds[0]}
                dispatch={dispatch}
              />
            </List>
          </View>
        </SelectedShapeContext.Provider>
      </AllShapesContext.Provider>
    </AppContext.Provider>
  );
}

export default App;
