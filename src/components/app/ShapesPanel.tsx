import React from 'react';
import { View, Text, TouchableWithoutFeedback } from 'react-native-web';
import { Svg } from 'react-native-svg';

import shapeRegistry from './ShapeRegistry';
import { List, Spacer, Divider } from '../core';
import Panel from '../shared/Panel';

const ShapeItemList = ({ childIds, allShapes, selectedShapeIds, depth, dispatch, onUpdateShape, ...props }) => {
  return (
    <List {...props}>
      {childIds.slice().reverse().map(childId => {
        const selected = selectedShapeIds.includes(childId);

        return (
          <ShapeItem
            key={childId}
            shapeId={childId}
            allShapes={allShapes}
            selectedShapeIds={selectedShapeIds}
            selected={selected}
            depth={depth}
            dispatch={dispatch}
            onUpdateShape={onUpdateShape}
          />
        );
      })}
    </List>
  );
};

const ShapeItem = ({ shapeId, allShapes, selectedShapeIds, selected, depth, dispatch, onUpdateShape }) => {
  const shape = allShapes[shapeId];

  const handleSelectShape = (shapeId) => {
    onUpdateShape(shapeId, {});

    dispatch({
      type: 'SELECT_SHAPE',
      payload: {
        shapeId,
      }
    });
  };

  const icon = shapeRegistry[shape.type] && shapeRegistry[shape.type].icon;

  return (
    <View>
      <TouchableWithoutFeedback key={shape.id} onPressIn={() => handleSelectShape(shape.id)}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 6,
            paddingHorizontal: 10,
            backgroundColor: selected && '#e8e8e8',
            paddingLeft: depth * 15 + 10,
            cursor: 'pointer',
          }}
        >
          <Svg width="20" height="20" viewBox="0 0 20 20">
            {icon && icon({
              properties: {
                ...shape.properties,
                position: { x: 50, y: 50 },
                angle: 0
              }
            })}
          </Svg>
          <Spacer size="small" />
          <Text style={{ fontWeight: 500, marginTop: -1 }}>{allShapes[shape.id].type}</Text>
        </View>
      </TouchableWithoutFeedback>
      <ShapeItemList
        childIds={shape.childIds}
        allShapes={allShapes}
        selectedShapeIds={selectedShapeIds}
        depth={depth + 1}
        dispatch={dispatch}
        onUpdateShape={onUpdateShape}
      />
    </View>
  );
};

const ShapesPanel = ({ allShapes, selectedShapeIds, dispatch, onUpdateShape }) => {
  console.log('ShapesPanel()');

  return (
    <Panel title="Shapes">
      <ShapeItemList
        childIds={allShapes[0].childIds}
        allShapes={allShapes}
        selectedShapeIds={selectedShapeIds}
        depth={0}
        dispatch={dispatch}
        style={{ paddingVertical: 8 }}
        onUpdateShape={onUpdateShape}
      />
    </Panel>
  );

};

export default React.memo(ShapesPanel);
