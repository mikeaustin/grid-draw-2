import React, { useState, useReducer, useRef, useMemo, useEffect } from 'react';
import { View } from 'react-native-web';
import { G, Ellipse, Rect } from 'react-native-svg';
import JsxParser from 'react-jsx-parser';

const Ellipse2 = ({ ...props }) => {
  return <View accessibilityLabel="ellipse" {...props} />;
};

class Ellipse3 extends View {
  render() {
    return <ellipse />;
  }
}

const shapeRegistry = {
  'GridDraw.Ellipse': {
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
  'GridDraw.Rect': {
    render: ({
      position: [x, y],
      opacity,
      ...props
    }) => {
      return (
        <Rect
          x={x}
          y={y}
          width={100}
          height={100}
          opacity={opacity}
          {...props}
        />
      );
    }
  },
  'GridDraw.Ellipse2': {
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
  'GridDraw.Group': {
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
  const target = useRef<SVGElement | null>(null);

  const handleStartShouldSetResponder = event => {
    event.preventDefault();

    const tap = !(Date.now() - lastTap.current < 300);

    lastTap.current = Date.now();

    return tap;
  };

  const handleResponderGrant = (event: any) => {
    if (shape.type === 'GridDraw.Group') {
      target.current = event.target.parentElement;
    } else {
      target.current = event.target;
    }

    setFirstPosition([event.nativeEvent.pageX, event.nativeEvent.pageY]);
    onSelectShape(shape.id, target.current);
  };

  const handleResponderMove = event => {
    if (target.current) {
      onShapeUpdate({
        position: [
          shape.position[0] + event.nativeEvent.pageX - firstPosition[0],
          shape.position[1] + event.nativeEvent.pageX - firstPosition[1],
        ]
      });

      if (shape.type === 'GridDraw.Group') {
        target.current.setAttribute('transform', `
          translate(
            ${shape.position[0] + event.nativeEvent.pageX - firstPosition[0]},
            ${shape.position[1] + event.nativeEvent.pageY - firstPosition[1]}
          )
        `);
      } else {
        target.current.setAttribute('cx', `${shape.position[0] + event.nativeEvent.pageX - firstPosition[0]}`);
        target.current.setAttribute('cy', `${shape.position[1] + event.nativeEvent.pageY - firstPosition[1]}`);
      }
    }
  };

  const handleResponseRelease = event => {
    target.current?.setAttribute('x', '');
    target.current?.setAttribute('y', '');

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

  if (selected) {
    target.current?.setAttribute('stroke', 'hsl(210, 90%, 55%)');
    target.current?.setAttribute('stroke-width', '3');
  } else {
    target.current?.setAttribute('stroke', '');
    target.current?.setAttribute('stroke-width', '');
  }

  const Component = shapeRegistry[shape.type].render;

  return (
    <Component position={shape.position} opacity={shape.opacity} {...shapeProps}>
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
  );

  // return shapeRegistry[type].render({ position, opacity, ...shapeProps });
};

export default React.memo(CanvasShape);
