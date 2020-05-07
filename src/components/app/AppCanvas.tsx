import React, { useState, useReducer, useRef, useMemo, SyntheticEvent, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableWithoutFeedback } from 'react-native-web';
import { Svg, G, Rect, Text as SvgText } from 'react-native-svg';

import CanvasShape from '../CanvasShape';
import Ruler from '../shared/Ruler';

const styles = StyleSheet.create({
  svg: {
    flex: 1,
    touchAction: 'none',
  }
});

const AppCanvas = ({ state, dispatch, scale = 1.0, onShapeUpdate }) => {
  console.log('AppCanvas()');

  const handleSetPosition = (shapeId, position) => {
    dispatch({ type: 'set-shape-position', payload: { shapeId, position } });
  };

  const handleSelectShape = (shapeId, element) => {
    dispatch({ type: 'select-shape', payload: { shapeId, element } });
  };

  //

  const handleStartShouldSetResponderCapture = event => {
    console.log('handleStartShouldSetResponderCapture', state.currentTool);
    event.preventDefault();

    return state.currentTool.tool !== 'GridDraw.Tools.Move';
  };

  const handleMoveShouldSetResponderCapture = event => {
    console.log('handleMoveShouldSetResponderCapture', state.currentTool);
    // event.preventDefault();

    return state.currentTool.tool !== 'GridDraw.Tools.Move';
  };

  const handleStartShouldSetResponder = event => {
    console.log('handleStartShouldSetResponder', state.currentTool);
    // event.preventDefault();

    return state.currentTool.tool !== 'GridDraw.Tools.Move';
  };

  const handleResponderGrant = (event: any) => {
    console.log('handleResponderGrant', state.currentTool);
    const rect = event.currentTarget.getBoundingClientRect();

    const [locationX, locationY] = [
      event.nativeEvent.pageX - rect.left - 25,
      event.nativeEvent.pageY - rect.top - 25
    ];

    dispatch({
      type: 'ADD_SHAPE',
      payload: {
        shape: state.currentTool.shape,
        position: [locationX, locationY]
      }
    });
  };

  const svgProps = {
    style: styles.svg,
    onStartShouldSetResponderCapture: handleStartShouldSetResponderCapture,
    onStartShouldSetResponder: handleStartShouldSetResponder,
    // onMoveShouldSetResponderCapture: handleMoveShouldSetResponderCapture,
    onResponderGrant: handleResponderGrant,
  };

  const canvasProps = {
  };

  return (
    <Svg {...svgProps}>
      <G
        transform={state.options.showRuler ? `scale(${scale}, ${scale}) translate(30, 30)` : ''}
        {...canvasProps}
      >
        {state.allShapes[0].childIds.map(shapeId => {
          const shape = state.allShapes[shapeId];

          return (
            <CanvasShape
              key={shape.id}
              shape={shape}
              selected={state.selectedShapeIds.includes(shape.id)}
              allShapes={state.allShapes}
              selectedShapeIds={state.selectedShapeIds}
              onSetPosition={handleSetPosition}
              onSelectShape={handleSelectShape}
              onShapeUpdate={onShapeUpdate}
            />
          );
        })}
      </G>
      {state.options.showRuler && (
        <G>
          <Ruler />
          <Rect width="30" height="30" fill="#e8e8e8" />
          <SvgText x={9} y={18} {...{ fontSize: 12 }} >px</SvgText>
          <Ruler vertical />
        </G>
      )}
    </Svg>
  );
};

export default React.memo(AppCanvas);
