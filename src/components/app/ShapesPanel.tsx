import React from 'react';
import { StyleSheet, View, Text, TouchableWithoutFeedback } from 'react-native-web';

import Panel from '../shared/Panel';

const ShapeItemList = ({ childIds, allShapes, selectedShapeIds, depth, dispatch, onUpdateShape, ...props }) => {
  return (
    <View {...props}>
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
    </View>
  );
};

const ShapeItem = ({ shapeId, allShapes, selectedShapeIds, selected, depth, dispatch, onUpdateShape }) => {
  const shape = allShapes[shapeId];

  const handleSelectShape = (shapeId, element) => {
    onUpdateShape(shapeId, {});

    dispatch({ type: 'select-shape', payload: { shapeId, element } });
  };

  return (
    <View>
      <TouchableWithoutFeedback key={shape.id} onPressIn={() => handleSelectShape(shape.id, null)}>
        <View
          style={{
            paddingVertical: 6,
            paddingHorizontal: 20,
            // backgroundColor: selected && 'hsl(210, 90%, 55%)',
            backgroundColor: selected && 'hsl(210, 0%, 88%)',
            paddingLeft: depth * 15 + 15,
            cursor: 'pointer',
          }}
        >
          <Text style={{ fontWeight: 500, color: selected && 'xwhite' }}>{allShapes[shape.id].type}</Text>
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
