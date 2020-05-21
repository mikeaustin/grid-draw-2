import React from 'react';
import { View } from 'react-native-web';
import { G, Ellipse, Rect } from 'react-native-svg';
// import JsxParser from 'react-jsx-parser';

import Shape from '../../types/Shape';
import RectShape from './shapes/RectShape';

const shapeRegistry = {
  'GridDraw.Shape.Ellipse': {
    icon: ({
      fill: {
        hue,
        saturation,
        lightness,
      },
      opacity
    }: Shape['properties']) => {
      return (
        <Ellipse
          cx={10}
          cy={10}
          rx={10}
          ry={10}
          fill={`hsl(${hue}, ${saturation}%, ${lightness}%)`}
          opacity={opacity}
        />
      );
    },
    render: ({
      position: {
        x,
        y,
      },
      fill: {
        hue,
        saturation,
        lightness,
      },
      opacity,
      ...props
    }: Shape['properties']) => {
      return (
        <Ellipse
          cx={x}
          cy={y}
          rx={50}
          ry={50}
          fill={`hsl(${hue}, ${saturation}%, ${lightness}%)`}
          opacity={opacity}
          {...props}
        />
      );
    }
  },
  'GridDraw.Shape.Rect': {
    icon: ({
      fill: {
        hue,
        saturation,
        lightness,
      },
      opacity
    }: Shape['properties']) => {
      return (
        <Rect
          x={0}
          y={0}
          width={20}
          height={20}
          fill={`hsl(${hue}, ${saturation}%, ${lightness}%)`}
          opacity={opacity}
        />
      );
    },
    render: RectShape,
  },
  'GridDraw.Shape.Group': {
    icon: ({ }) => {
      return (
        <Rect width={20} height={20} fill="transparent" stroke="black" strokeWidth="2"
          strokeDasharray={'3 1'}
        />
      );
    },
    render: ({
      position: {
        x,
        y,
      },
      fill: {
        hue,
        saturation,
        lightness,
      },
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

/*

  'GridDraw.Shape.Ellipse2': {
    render: ({
      position: {
        x,
        y,
      },
      fill: {
        hue,
        saturation,
        lightness,
      },
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

*/
