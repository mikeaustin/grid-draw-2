import React, { useState, useRef, useContext, useEffect, useCallback } from 'react';
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
      childIds,
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
      angle,
      opacity,
      childIds,
      ...props
    }) => {
      return (
        <Rect
          x={x - 50}
          y={y - 50}
          width={100}
          height={100}
          transform={`rotate(${angle} ${(x - 50) + 100 / 2} ${(y - 50) + 100 / 2})`}
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
              cx={ x }
              cy={ y }
              rx={ rx }
              ry={ ry }
              onPress={ test }
            />
          `}
        />
      );
    }
  },
  'GridDraw.Shape.Group': {
    render: ({ position, opacity, childIds, ...props }) => {
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

type CanvasShapeProps = {
  selectedShape?: any,
  shape: any,
  selected: boolean,
  allShapes: any,
  selectedShapeIds: number[],
  onSetPosition: Function,
  onSelectShape: Function,
  onShapeUpdate: Function,
};

const CanvasShape = ({
  // selectedShape,
  shape,
  selected,
  allShapes,
  selectedShapeIds,
  onSetPosition,
  onSelectShape,
  onShapeUpdate
}: CanvasShapeProps) => {
  console.log('CanvasShape()', shape.id);

  const [firstPosition, setFirstPosition] = useState<number[]>([0, 0]);
  const [selectedShape, setSelectedShape] = useState<any | null>(null);
  const lastTap = useRef<number>(Date.now());

  useEffect(() => {
    if (selected) {
      document.addEventListener('position', handleShapeMove);
    } else {
      setSelectedShape(null);
      document.removeEventListener('position', handleShapeMove);
    }
  }, [selected]);

  const handleShapeMove = useCallback(event => {
    // console.log('handleShapeMove()', shape.id, event);

    setSelectedShape(event.detail);
  }, []);

  const handleStartShouldSetResponder = event => {
    event.preventDefault();

    const tap = !(Date.now() - lastTap.current < 300);
    lastTap.current = Date.now();

    return tap;
  };

  const handleResponderGrant = (event: any) => {
    console.log('setFirstPosition()');
    setFirstPosition([event.nativeEvent.pageX, event.nativeEvent.pageY]);
    console.log('onSelectShape()');
    onSelectShape(shape.id);

    setTimeout(() => {
      console.log('onShapeUpdate()');
      onShapeUpdate(shape.id, {
        position: shape.position,
      });
    }, 0);
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
    console.log('----------');

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
    <Component
      {...(selectedShape ? selectedShape : shape)}
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
  );
};

export default React.memo(CanvasShape);;
