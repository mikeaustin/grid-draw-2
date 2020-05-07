import React, { useState, useRef } from 'react';
import { View } from 'react-native-web';
import { G, Ellipse, Rect } from 'react-native-svg';
import JsxParser from 'react-jsx-parser';

import ShapeContext from '../ShapeContext';

const Ellipse2 = ({ ...props }) => {
  return <View accessibilityLabel="ellipse" {...props} />;
};

class Ellipse3 extends View {
  render() {
    return <ellipse />;
  }
}

const shapeRegistry = {
  'GridDraw.Shape.Ellipse': {
    render: ({
      position: [x, y],
      opacity,
      ...props
    }) => {
      return (
        <Ellipse
          cx={x}
          cy={y}
          rx={50}
          ry={50}
          opacity={opacity}
          {...props}
        />
      );
    }
  },
  'GridDraw.Shape.Rect': {
    render: ({
      position: [x, y],
      opacity,
      ...props
    }) => {
      return (
        <Rect
          x={x - 50}
          y={y - 50}
          width={100}
          height={100}
          opacity={opacity}
          {...props}
        />
      );
    }
  },
  'GridDraw.Shape.Ellipse2': {
    render: ({
      position: [x, y],
    }) => {
      return (
        <JsxParser
          bindings={{
            x, y, rx: 50, ry: 50, test: () => alert('here')
          }}
          components={{ Ellipse }}
          renderInWrapper={false}
          showWarnings={true}
          jsx={`
            <Ellipse
              cx={x}
              cy={y}
              rx={rx}
              ry={ry}
              onPress={test}
            />
          `}
        />
      );
    }
  },
  'GridDraw.Shape.Group': {
    render: ({ position, opacity, ...props }) => {
      const groupProps = {
        style: {
          pointerEvents: 'visiblePainted'
        }
      };

      return (
        <G
          x={position[0]}
          y={position[1]}
          opacity={opacity}
          {...groupProps}
          {...props}
        />
      );
    }
  }
};

const CanvasShape = ({ shape, selected, allShapes, selectedShapeIds, onSetPosition, onSelectShape, onShapeUpdate }) => {
  const [firstPosition, setFirstPosition] = useState<number[]>([0, 0]);
  const lastTap = useRef<number>(Date.now());

  const handleStartShouldSetResponder = event => {
    event.preventDefault();

    const tap = !(Date.now() - lastTap.current < 300);
    lastTap.current = Date.now();

    return tap;
  };

  const handleResponderGrant = (event: any) => {
    setFirstPosition([event.nativeEvent.pageX, event.nativeEvent.pageY]);
    onSelectShape(shape.id);

    onShapeUpdate(shape.id, {});
  };

  const handleResponderMove = event => {
    onShapeUpdate(shape.id, {
      position: [
        shape.position[0] + event.nativeEvent.pageX - firstPosition[0],
        shape.position[1] + event.nativeEvent.pageY - firstPosition[1],
      ]
    });
  };

  const handleResponseRelease = event => {
    onSetPosition(shape.id, [
      shape.position[0] + (event.nativeEvent.pageX - firstPosition[0]),
      shape.position[1] + (event.nativeEvent.pageY - firstPosition[1]),
    ]);
  };

  const shapeProps = {
    // onLayout: event => console.log(event),
    onStartShouldSetResponder: handleStartShouldSetResponder,
    onStartShouldSetResponderCapture: handleStartShouldSetResponder,
    onResponderGrant: handleResponderGrant,
    onResponderMove: handleResponderMove,
    onResponderRelease: handleResponseRelease,
  };

  const Component = shapeRegistry[shape.type].render;

  return (
    <ShapeContext.Consumer>
      {selectedShape => (
        <Component
          position={selected ? selectedShape.position : shape.position}
          opacity={selected ? selectedShape.opacity : shape.opacity}
          stroke={selected ? 'hsl(210, 90%, 55%)' : undefined}
          strokeWidth={selected ? 5 : undefined}
          {...shapeProps}
        >
          {shape.childIds.map(childId => {
            const shape = allShapes[childId];
            const selected = selectedShapeIds.includes(childId);

            return (
              <CanvasShape
                key={childId}
                shape={shape}
                selected={selected}
                allShapes={allShapes}
                selectedShapeIds={selectedShapeIds}
                onSetPosition={onSetPosition}
                onSelectShape={onSelectShape}
                onShapeUpdate={onShapeUpdate}
              />
            );
          })}
        </Component>
      )}
    </ShapeContext.Consumer>
  );
};

export default React.memo(CanvasShape);
