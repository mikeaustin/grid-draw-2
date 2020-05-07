import React, { useState, useReducer, useCallback, useRef, useMemo, SyntheticEvent, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableWithoutFeedback } from 'react-native-web';

import { initialState, stateReducer } from './reducers/allShapesReducer';
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
  const [state, dispatch] = useReducer(stateReducer, initialState);
  const [data, setData] = useState({});

  const stateView = useMemo(() => ({ ...state }), [state]);

  const handleShapeUpdate = useCallback((data) => {
    setData(data);
  }, []);

  return (
    <ShapeContext.Provider value={data}>
      <View style={styles.app}>
        <MainToolbar currentTool={state.currentTool} state={state} dispatch={dispatch} />
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <ShapesPanel
            allShapes={state.allShapes}
            selectedShapeIds={state.selectedShapeIds}
            dispatch={dispatch}
          />
          <AppCanvas state={state} dispatch={dispatch} onShapeUpdate={handleShapeUpdate} />
          <View style={{ background: '#d0d0d0', minWidth: 1 }} />
          <AppCanvas state={state} dispatch={dispatch} scale={0.5} onShapeUpdate={handleShapeUpdate} />
          <PropertiesPanel
            allShapes={state.allShapes}
            selectedShapeId={state.selectedShapeIds[0]}
            selectedShapeElement={state.selectedShapeElements[0]}
            dispatch={dispatch}
          />
        </View>
      </View >
    </ShapeContext.Provider>
  );
}

export default App;
