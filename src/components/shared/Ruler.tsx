import React from 'react';
import { Text, G, Line, Rect } from 'react-native-svg';

const rectProps = {
  fill: '#f0f0f0',
};

const textProps = {
  style: {
    fontSize: 10,
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
      <G transform={vertical ? 'translate(31, 0) rotate(90)' : ''}>
        <Rect x={30} y={0} width={10000} height={31} {...rectProps} />
        {Array.from({ length: 101 }, (_, index) => (
          <React.Fragment key={index}>
            <Line
              x1={(index * 10) * scale + 30.5}
              y1={31 - lineEndForIndex(index)}
              x2={(index * 10) * scale + 30.5}
              y2={0}
              stroke="#d0d0d0"
            />
            {index % 10 === 0 && (
              <Text x={(index * 10) * scale + 35} y={31 - 12 + 7} {...textProps}>{index * 10}</Text>
            )}
          </React.Fragment>
        ))}
      </G>
    );
  }

  return (
    <G>
      <Rect x={30} y={0} width={10000} height={31} {...rectProps} />
      {Array.from({ length: 101 }, (_, index) => (
        <React.Fragment key={index}>
          <Line
            x1={(index * 10) * scale + 30.5}
            y1={lineEndForIndex(index)}
            x2={(index * 10) * scale + 30.5}
            y2={31}
            stroke="hsl(0, 0%, 80%)"
          />
          {index % 10 === 0 && (
            <Text x={(index * 10) * scale + 35} y={12} {...textProps}>{index * 10}</Text>
          )}
        </React.Fragment>
      ))}
    </G>
  );
};

export default React.memo(Ruler);
