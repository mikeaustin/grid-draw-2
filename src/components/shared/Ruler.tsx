import React from 'react';
import { Text, G, Line, Rect } from 'react-native-svg';

const textProps = {
  style: {
    fontSize: 12
  }
};

const Ruler = ({ vertical }: { vertical?: boolean; }) => {
  if (vertical) {
    return (
      <G transform={vertical ? 'translate(30, 0) rotate(90)' : ''}>
        <Rect x={30} y={0} width={1000} height={30} fill="#e8e8e8" />
        {Array.from({ length: 101 }, (_, index) => (
          <React.Fragment key={index}>
            <Line
              x1={index * 10 + 30.5}
              y1={30 - (index % 5 === 0 ? (index % 10 === 0 ? 0 : 10) : 20)}
              x2={index * 10 + 30.5}
              y2={0}
              stroke="hsl(0, 0%, 80%)"
            />
            {index % 10 === 0 && (
              <Text x={index * 10 + 35} y={30 - 14 + 8} {...textProps}>{index * 10}</Text>
            )}
          </React.Fragment>
        ))}
        <Line
          x1={30}
          y1={-0.5}
          x2={1030}
          y2={-0.5}
          stroke="hsl(0, 0%, 80%)"
        />
      </G>
    );
  }

  return (
    <G>
      <Rect x={30} y={0} width={1000} height={30} fill="#e8e8e8" />
      {Array.from({ length: 101 }, (_, index) => (
        <React.Fragment key={index}>
          <Line
            x1={index * 10 + 30.5}
            y1={index % 5 === 0 ? (index % 10 === 0 ? 0 : 10) : 20}
            x2={index * 10 + 30.5}
            y2={30}
            stroke="hsl(0, 0%, 80%)"
          />
          {index % 10 === 0 && (
            <Text x={index * 10 + 35} y={14} {...textProps}>{index * 10}</Text>
          )}
        </React.Fragment>
      ))}
      <Line
        x1={30}
        y1={30.5}
        x2={1030}
        y2={30.5}
        stroke="hsl(0, 0%, 80%)"
      />
    </G>
  );
};

export default Ruler;
