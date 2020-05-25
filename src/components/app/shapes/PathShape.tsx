/* eslint @typescript-eslint/no-unused-vars: "off" */

import React, { useState, useContext } from 'react';
import { Path, Circle, Line } from 'react-native-svg';

import AppContext from '../../../AppContext';
import Shape from '../../../types/Shape';
import DragHandle from '../../shared/DragHandle';

const PathShape = ({
  shapeId,
  selected,
  properties: {
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
    bezierNodes,
  },
  ...props
}) => {
  const [firstPosition, setFirstPosition] = useState<{ x: number, y: number; }>({ x: 0, y: 0 });
  const [handlePosition, setHandlePosition] = useState<{ x: number, y: number; }>({ x: 0, y: 0 });
  const [dragIndex, setDragIndex] = useState<number>(-1);
  const { options, onShapeUpdate, onPropertyChange } = useContext(AppContext);

  const handleDragStart = (position, index) => {
    setDragIndex(index);

    setFirstPosition({
      x: bezierNodes[index + 0],
      y: bezierNodes[index + 1]
    });
  };

  const handleDragMove = (position, index) => {
    setHandlePosition({
      x: firstPosition.x + position.x,
      y: firstPosition.y + position.y
    });

    bezierNodes[dragIndex + 0] = firstPosition.x + position.x;
    bezierNodes[dragIndex + 1] = firstPosition.y + position.y;

    if (options.snapToGrid) {
      bezierNodes[dragIndex + 0] = Math.round(bezierNodes[dragIndex + 0] / 10) * 10;
      bezierNodes[dragIndex + 1] = Math.round(bezierNodes[dragIndex + 1] / 10) * 10;
    }

    if (dragIndex === bezierNodes.length - 2) {
      bezierNodes[0] = bezierNodes[dragIndex + 0];
      bezierNodes[1] = bezierNodes[dragIndex + 1];
    }

    onShapeUpdate(shapeId, {
      bezierNodes: bezierNodes,
    });
  };

  const handleDragEnd = (position, index) => {
    setDragIndex(-1);
  };

  let d: string[] = [];
  for (let index = 0; index < bezierNodes.length - 1; index += 2) {
    const nodeX = bezierNodes[index], nodeY = bezierNodes[index + 1];

    d.push(`${index === 0 ? 'M ' : index === 2 ? 'C ' : ''}${nodeX},${nodeY}`);
  }

  let lines: JSX.Element[] = [];
  for (let index = -2; index < bezierNodes.length - 3; index += 6) {
    const nodeX = bezierNodes[index + 0], nodeY = bezierNodes[index + 1];
    const nodeX2 = bezierNodes[index + 2], nodeY2 = bezierNodes[index + 3];
    const nodeX3 = bezierNodes[index + 4], nodeY3 = bezierNodes[index + 5];

    if (index >= 4) {
      lines.push(<Line key={index + 0} x1={x + nodeX} y1={y + nodeY} x2={x + nodeX2} y2={y + nodeY2} stroke="black" strokeWidth={1} />);
    }

    if (index < bezierNodes.length - 9) {
      lines.push(<Line key={index + 1} x1={x + nodeX2} y1={y + nodeY2} x2={x + nodeX3} y2={y + nodeY3} stroke="black" strokeWidth={1} />);
    }
  }

  const handles: JSX.Element[] = [];
  for (let index = 0; index < bezierNodes.length - 1; index += 2) {
    const nodeX = bezierNodes[index], nodeY = bezierNodes[index + 1];

    handles.push(
      <DragHandle
        key={index}
        position={index === dragIndex ? { x: x + nodeX, y: y + nodeY } : { x: x + nodeX, y: y + nodeY }}
        index={index}
        solid={index % 3 !== 0}
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
      />
    );
  }

  return (
    <>
      <Path
        transform={`translate(${x}, ${y})`}
        d={d.join() + 'z'}
        fill={`hsl(${hue}, ${saturation}%, ${lightness}%)`}
        opacity={opacity}
        {...props}
      // strokeWidth={5}
      // stroke={'black'}
      />
      {selected && (
        <>
          {lines}
          {handles}
        </>
      )}
    </>
  );
};

export default PathShape;
