import React from 'react';
import { View } from 'react-native-web';
import { G, Ellipse, Rect } from 'react-native-svg';
import JsxParser from 'react-jsx-parser';
import Shape from '../../types/Shape';
import State from '../../types/State';

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
      hue,
      opacity,
      ...props
    }: Shape['properties']) => {
      return (
        <Ellipse
          cx={x}
          cy={y}
          rx={50}
          ry={50}
          fill={`hsl(${hue}, 100%, 50%)`}
          opacity={opacity}
          {...props}
        />
      );
    }
  },
  'GridDraw.Shape.Rect': {
    render: ({
      position: [x, y],
      hue,
      opacity,
      angle,
      ...props
    }: Shape['properties']) => {
      return (
        <Rect
          x={x - 50}
          y={y - 50}
          width={100}
          height={100}
          transform={`rotate(${angle} ${(x - 50) + 100 / 2} ${(y - 50) + 100 / 2})`}
          fill={`hsl(${hue}, 100%, 50%)`}
          opacity={opacity}
          {...props}
        />
      );
    }
  },
  'GridDraw.Shape.Ellipse2': {
    render: ({
      position: [x, y],
    }: Shape['properties']) => {
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
    render: ({
      position: [x, y],
      opacity,
      ...props
    }: Shape['properties']) => {
      const groupProps = {
        style: {
          pointerEvents: 'visiblePainted'
        }
      };

      return (
        <G
          x={x}
          y={y}
          opacity={opacity}
          {...groupProps}
          {...props}
        />
      );
    }
  }
};

export default shapeRegistry;
