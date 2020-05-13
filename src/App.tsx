import React, { useState, useReducer, useCallback, useMemo, useEffect } from 'react';
import { StyleSheet, View } from 'react-native-web';

import { State, initialState, stateReducer } from './reducers/allShapesReducer';
import ShapeContext from './ShapeContext';

import AppCanvas from './components/app/AppCanvas';
import MainToolbar from './components/app/MainToolbar';
import ShapesPanel from './components/app/ShapesPanel';
import PropertiesPanel from './components/app/PropertiesPanel';
import { EventEmitter } from 'events';

const styles = StyleSheet.create({
  app: {
    height: '100vh',
  },
});

const appContext = {
  eventEmitter: new EventEmitter()
};

const setSelectedShape = (state, selectedShape, eventType) => {
  appContext.eventEmitter.emit(eventType, {
    ...state.allShapes[state.selectedShapeIds[0]],
    ...selectedShape
  });
};

function App() {
  console.log('App()', appContext);

  const [state, dispatch] = useReducer(stateReducer, initialState);

  const stateView = useMemo(() => ({ ...state }), [state]);

  useEffect(() => {
    const newSelectedShape = state.allShapes[state.selectedShapeIds[0]];

    if (newSelectedShape) {
      setSelectedShape(state, newSelectedShape, 'position');
    }
  }, [state.allShapes]);

  const handleShapeUpdate = useCallback((shapeId, newSelectedShape) => {
    const shape = {
      ...state.allShapes[shapeId],
      ...newSelectedShape
    };

    Object.keys(newSelectedShape).forEach(eventType => {
      setSelectedShape(state, shape, eventType);
    });
  }, [state.allShapes]);

  return (
    <ShapeContext.Provider value={appContext}>
      <View style={styles.app}>
        <MainToolbar currentTool={state.currentTool} state={state} dispatch={dispatch} />
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <ShapesPanel
            allShapes={state.allShapes}
            selectedShapeIds={state.selectedShapeIds}
            dispatch={dispatch}
            onUpdateShape={handleShapeUpdate}
          />
          <View style={{ background: '#d0d0d0', minWidth: 1 }} />
          <AppCanvas state={state} dispatch={dispatch} onShapeUpdate={handleShapeUpdate} />
          <View style={{ background: '#d0d0d0', minWidth: 1 }} />
          <AppCanvas state={state} dispatch={dispatch} scale={0.5} onShapeUpdate={handleShapeUpdate} />
          <View style={{ background: '#d0d0d0', minWidth: 1 }} />
          <PropertiesPanel
            selectedShapeId={state.selectedShapeIds[0]}
            dispatch={dispatch}
            onShapeUpdate={handleShapeUpdate}
          />
        </View>
      </View >
    </ShapeContext.Provider>
  );
}

export default App;
