import React, { useReducer, useCallback, useMemo, useEffect } from 'react';
import { StyleSheet, View } from 'react-native-web';

import { initialState, stateReducer } from './reducers/allShapesReducer';
import { State, Shape, Properties } from './types';
import ShapeContext from './ShapeContext';

import AppCanvas from './components/app/AppCanvas';
import MainToolbar from './components/app/MainToolbar';
import ShapesPanel from './components/app/ShapesPanel';
import PropertiesPanel from './components/app/PropertiesPanel';
import { EventEmitter } from 'events';

import { List } from './components/core';

const styles = StyleSheet.create({
  app: {
    height: '100vh',
  },
});

const appContext = {
  eventEmitter: new EventEmitter()
};

function App() {
  console.log('App()', appContext);

  const [state, dispatch] = useReducer(stateReducer, initialState);

  const stateView = useMemo(() => ({ ...state }), [state]);

  useEffect(() => {
    const selectedShape = state.allShapes[state.selectedShapeIds[0]];

    if (selectedShape) {
      Object.keys(selectedShape.properties).forEach(propertyName => (
        appContext.eventEmitter.emit(propertyName, selectedShape)
      ));
    }
  }, [appContext, state.allShapes, state.selectedShapeIds]);

  const handleShapeUpdate = useCallback((shapeId: number, shapeProperties: Properties) => {
    const updatedShape = {
      ...state.allShapes[shapeId],
      properties: {
        ...state.allShapes[shapeId].properties,
        ...shapeProperties,
      }
    };

    Object.keys(shapeProperties).forEach(eventType => {
      appContext.eventEmitter.emit(eventType, updatedShape);
    });
  }, [state.allShapes]);

  return (
    <ShapeContext.Provider value={appContext}>
      <View style={styles.app}>
        <MainToolbar currentTool={state.currentTool} state={state} dispatch={dispatch} />
        <List divider dividerColor="#e0e0e0" style={{ flex: 1, flexDirection: 'row' }}>
          <ShapesPanel
            allShapes={state.allShapes}
            selectedShapeIds={state.selectedShapeIds}
            dispatch={dispatch}
            onUpdateShape={handleShapeUpdate}
          />
          <List divider dividerColor="#e0e0e0" style={{ flex: 1 }}>
            <List horizontal divider dividerColor="#e0e0e0" style={{ flex: 1 }}>
              <AppCanvas state={state} dispatch={dispatch} onShapeUpdate={handleShapeUpdate} />
              {state.options.showSecondCanvas && (
                <AppCanvas state={state} dispatch={dispatch} scale={0.5} onShapeUpdate={handleShapeUpdate} />
              )}
            </List>
            {state.options.showThirdCanvas && (
              <AppCanvas state={state} dispatch={dispatch} scale={2.0} onShapeUpdate={handleShapeUpdate} />
            )}
          </List>
          <PropertiesPanel
            selectedShapeId={state.selectedShapeIds[0]}
            dispatch={dispatch}
            onShapeUpdate={handleShapeUpdate}
          />
        </List>
      </View >
    </ShapeContext.Provider>
  );
}

export default App;
