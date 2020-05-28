import React from 'react';
import { Text, G, Line, Rect } from 'react-native-svg';

const rectProps = {
  fill: '#f0f0f0',
};

const textProps = {
  style: {
    fontSize: 10
  }
};

const lineEndForIndex = index => {
  switch (true) {
    case index % 10 === 0:
      return 5;
    case index % 5 === 0:
      return 17;
    default:
      return 23;
  }
};

type RulerProps = {
  vertical?: boolean,
  scale?: number;
};

const Ruler = ({ vertical, scale = 1.0 }: RulerProps) => {
  console.log('Ruler()');

  if (vertical) {
    return (
      <G transform={vertical ? 'translate(30, 0) rotate(90)' : ''}>
        <Rect x={30} y={0} width={10000} height={30} {...rectProps} />
        {Array.from({ length: 101 }, (_, index) => (
          <React.Fragment key={index}>
            <Line
              x1={(index * 10) * scale + 30.5}
              y1={30 - lineEndForIndex(index)}
              x2={(index * 10) * scale + 30.5}
              y2={0}
              stroke="hsl(0, 0%, 80%)"
            />
            {index % 10 === 0 && (
              <Text x={(index * 10) * scale + 35} y={30 - 12 + 7} {...textProps}>{index * 10}</Text>
            )}
          </React.Fragment>
        ))}
        <Line
          x1={30}
          y1={-0.5}
          x2={10030}
          y2={-0.5}
          stroke="#e0e0e0"
        />
      </G>
    );
  }

  return (
    <G>
      <Rect x={30} y={0} width={10000} height={30} {...rectProps} />
      {Array.from({ length: 101 }, (_, index) => (
        <React.Fragment key={index}>
          <Line
            x1={(index * 10) * scale + 30.5}
            y1={lineEndForIndex(index)}
            x2={(index * 10) * scale + 30.5}
            y2={30}
            stroke="hsl(0, 0%, 80%)"
          />
          {index % 10 === 0 && (
            <Text x={(index * 10) * scale + 35} y={12} {...textProps}>{index * 10}</Text>
          )}
        </React.Fragment>
      ))}
      <Line
        x1={30}
        y1={30.5}
        x2={10030}
        y2={30.5}
        stroke="#e8e8e8"
      />
    </G>
  );
};

export default React.memo(Ruler);
