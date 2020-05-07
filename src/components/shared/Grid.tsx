import React from 'react';
import { G, Line } from 'react-native-svg';

const Grid = ({ }) => {
  return (
    <G>
      {Array.from({ length: 50 }, (_, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <Line
              x1={-0.5}
              y1={index * 50 - 0.0}
              x2={'100%'}
              y2={index * 50 - 0.0}
              stroke="hsl(0, 0%, 50%)"
              strokeDasharray={'1 9'}
            />
          )}
          {index > 0 && (
            <Line
              x1={index * 50 - 0.0}
              y1={-0.5}
              x2={index * 50 - 0.0}
              y2={'100%'}
              stroke="hsl(0, 0%, 50%)"
              strokeDasharray={'1 9'}
            />
          )}
        </React.Fragment>
      ))}
    </G>
  );
};

export default React.memo(Grid);
