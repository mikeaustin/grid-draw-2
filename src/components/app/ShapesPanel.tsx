/* eslint @typescript-eslint/no-unused-vars: "off" */

import React, { useContext, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableWithoutFeedback } from 'react-native-web';
import { Svg } from 'react-native-svg';

import shapeRegistry from './ShapeRegistry';
import { List, Spacer, Divider } from '../core';
import Panel from '../shared/Panel';
import { AllShapesContext, SelectedShapeContext } from '../../AppContext';

const styles = StyleSheet.create({
  itemList: {
    paddingVertical: 8,
  }
});

type ShapeItemListProps = {
  childIds: number[],
  depth: number,
  style?: any,
  dispatch: Function,
};

const ShapeItemList = React.memo(({ childIds, depth, dispatch, ...props }: ShapeItemListProps) => {
  const allShapes = useContext(AllShapesContext);
  const { selectedShapeIds } = useContext(SelectedShapeContext);

  return (
    <List {...props}>
      {childIds.slice().reverse().map(childId => {
        const selected = selectedShapeIds.includes(childId);

        return (
          <ShapeItem
            key={childId}
            shape={allShapes[childId]}
            selected={selected}
            depth={depth}
            dispatch={dispatch}
          />
        );
      })}
    </List>
  );
});

type ShapeItemProps = {
  shape: any,
  selected: boolean,
  depth: number,
  dispatch: Function,
};

const ShapeItem = React.memo(({ shape, selected, depth, dispatch }: ShapeItemProps) => {
  console.log(`ShapeItem() – shapeId: ${shape.id}`);

  const handleSelectShape = useCallback((shapeId) => {
    dispatch({
      type: 'SELECT_SHAPE',
      payload: {
        shapeId,
      }
    });
  }, [dispatch]);

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
            backgroundColor: selected && '#e0e0e0',
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
          <Text style={{ fontWeight: 500, marginTop: -1 }}>{shape.type}</Text>
        </View>
      </TouchableWithoutFeedback>
      {shape.childIds.length > 0 && (
        <ShapeItemList
          childIds={shape.childIds}
          depth={depth + 1}
          dispatch={dispatch}
        />
      )}
    </View>
  );
});

const ShapesPanel = ({ allShapes, dispatch }) => {
  console.log('ShapesPanel()');

  return (
    <Panel title="Shapes">
      <ShapeItemList
        childIds={allShapes[0].childIds}
        depth={0}
        dispatch={dispatch}
        style={styles.itemList}
      />
    </Panel>
  );

};

export default React.memo(ShapesPanel);
