/* eslint @typescript-eslint/no-unused-vars: "off" */

import React, { useCallback, useMemo } from 'react';
import { StyleSheet } from 'react-native-web';
import { Svg, G, Rect, Text as SvgText } from 'react-native-svg';

import CanvasShape from './CanvasShape';
import Grid from '../shared/Grid';
import Ruler from '../shared/Ruler';
import State from '../../types/State';
import Properties from '../../types/Properties';

const styles = StyleSheet.create({
  svg: {
    flex: 1,
    touchAction: 'none',
  }
});

type AppCanvasProps = {
  state: State,
  dispatch: React.Dispatch<any>,
  scale?: number,
};

const AppCanvas = ({ state, dispatch, scale = 1.0 }: AppCanvasProps) => {
  console.log('AppCanvas() - scale:', scale);

  const handleSelectShape = useCallback((shapeId) => {
    dispatch({
      type: 'SELECT_SHAPE',
      payload: {
        shapeId,
      }
    });
  }, [dispatch]);

  //

  const handleStartShouldSetResponderCapture = useCallback(event => {
    console.log('AppCanvas.handleStartShouldSetResponderCapture()');
    event.preventDefault();

    return state.currentTool.tool === 'Create';
  }, [state.currentTool.tool]);

  const handleStartShouldSetResponder = useCallback(event => {
    console.log('AppCanvas.handleStartShouldSetResponder()');
    event.preventDefault();

    return state.currentTool.tool === 'Create';
  }, [state.currentTool.tool]);

  const handleResponderGrant = useCallback((event: any) => {
    console.log('AppCanvas.handleResponderGrant()', state.currentTool);
    const rect = event.currentTarget.getBoundingClientRect();

    const [locationX, locationY] = [
      event.nativeEvent.pageX - rect.left - 25,
      event.nativeEvent.pageY - rect.top - 25
    ];

    dispatch({
      type: 'ADD_SHAPE',
      payload: {
        type: state.currentTool.type,
        position: { x: locationX, y: locationY }
      }
    });
  }, [state.currentTool, dispatch]);

  const svgProps = useMemo(() => ({
    style: styles.svg,
    onStartShouldSetResponderCapture: handleStartShouldSetResponderCapture,
    onStartShouldSetResponder: handleStartShouldSetResponder,
    onResponderGrant: handleResponderGrant,
  }), [handleStartShouldSetResponderCapture, handleStartShouldSetResponder, handleResponderGrant]);


  return (
    <Svg {...svgProps}>
      <G
        transform={`${state.options.showRuler ? `translate(30, 30)` : ''} scale(${scale}, ${scale})`}
      >
        {state.options.showGrid && (
          <Grid />
        )}
        {state.allShapes[0].childIds.map(shapeId => {
          const shape = state.allShapes[shapeId];

          return (
            <CanvasShape
              key={shape.id}
              shape={shape}
              selected={state.selectedShapeIds.includes(shape.id)}
              allShapes={state.allShapes}
              selectedShapeIds={state.selectedShapeIds}
              onSelectShape={handleSelectShape}
            />
          );
        })}
      </G>
      {state.options.showRuler && (
        <G>
          <Ruler scale={scale} />
          <Rect width="30" height="30" fill="#f0f0f0" />
          <SvgText x={9} y={18} {...{ fontSize: 12 }} >px</SvgText>
          <Ruler scale={scale} vertical />
        </G>
      )}
    </Svg>
  );
};

export default React.memo(AppCanvas);
