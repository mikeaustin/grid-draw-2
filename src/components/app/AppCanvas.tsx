import React from 'react';
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
  onShapeUpdate: (shapeId: number, shape: Properties) => void,
};

const AppCanvas = ({ state, dispatch, scale = 1.0, onShapeUpdate }: AppCanvasProps) => {
  console.log('AppCanvas()', { scale });

  const handleSetPosition = (shapeId: number, position: { x: number, y: number; }) => {
    if (state.options.snapToGrid) {
      position = {
        x: Math.round((position.x / 10)) * 10,
        y: Math.round(position.y / 10) * 10,
      };
    }

    dispatch({
      type: 'SET_SHAPE_PROPERTY',
      payload: {
        shapeId,
        propertyName: 'position',
        propertyValue: position
      }
    });
  };

  const handleSelectShape = (shapeId) => {
    dispatch({
      type: 'SELECT_SHAPE',
      payload: {
        shapeId,
      }
    });
  };

  //

  const handleStartShouldSetResponderCapture = event => {
    console.log('AppCanvas.handleStartShouldSetResponderCapture()');
    event.preventDefault();

    return state.currentTool.tool === 'Create';
  };

  // const handleMoveShouldSetResponderCapture = event => {
  //   console.log('handleMoveShouldSetResponderCapture', state.currentTool);
  //   // event.preventDefault();

  //   return state.currentTool.tool !== 'GridDraw.Tools.Move';
  // };

  const handleStartShouldSetResponder = event => {
    console.log('AppCanvas.handleStartShouldSetResponder()');
    // event.preventDefault();

    return state.currentTool.tool === 'Create';
  };

  const handleResponderGrant = (event: any) => {
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
        transform={`${state.options.showRuler ? `translate(30, 30)` : ''} scale(${scale}, ${scale})`}
        {...canvasProps}
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
