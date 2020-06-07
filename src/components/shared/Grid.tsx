import React from 'react';
import { G, Line } from 'react-native-svg';

const Grid = () => {
  console.log('Grid()');

  return (
    <G>
      {Array.from({ length: 50 }, (_, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <Line
              x1={-0.5}
              y1={index * 50 - 0.0}
              x2={10000}
              y2={index * 50 - 0.0}
              stroke={index % 2 === 0 ? 'hsl(0, 0%, 50%)' : 'hsl(0, 0%, 75%)'}
              strokeDasharray={'1 9'}
            />
          )}
          {index > 0 && (
            <Line
              x1={index * 50 - 0.0}
              y1={-0.5}
              x2={index * 50 - 0.0}
              y2={10000}
              stroke={index % 2 === 0 ? 'hsl(0, 0%, 50%)' : 'hsl(0, 0%, 75%)'}
              strokeDasharray={'1 9'}
            />
          )}
        </React.Fragment>
      ))}
    </G>
  );
};

export default React.memo(Grid);
