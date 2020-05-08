import React, { useState, useReducer, useCallback, useMemo, useEffect } from 'react';
import { StyleSheet, View } from 'react-native-web';

import { State, initialState, stateReducer } from './reducers/allShapesReducer';
import ShapeContext from './ShapeContext';

import AppCanvas from './components/app/AppCanvas';
import MainToolbar from './components/app/MainToolbar';
import ShapesPanel from './components/app/ShapesPanel';
import PropertiesPanel from './components/app/PropertiesPanel';

const styles = StyleSheet.create({
  app: {
    height: '100vh',
  },
});

function App() {
  console.log('App()');

  const [state, dispatch] = useReducer(stateReducer, initialState);
  const [selectedShape, setSelectedShape] = useState<State['allShapes'][0] | null>(null);

  const stateView = useMemo(() => ({ ...state }), [state]);

  useEffect(() => {
    const newSelectedShape = state.allShapes[state.selectedShapeIds[0]];

    if (newSelectedShape) {
      setSelectedShape(newSelectedShape);
    }
  }, [state.allShapes]);

  const handleShapeUpdate = useCallback((shapeId, newSelectedShape) => {
    setSelectedShape({
      ...state.allShapes[shapeId],
      ...newSelectedShape
    });
  }, [state.allShapes]);

  return (
    <ShapeContext.Provider value={selectedShape}>
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
