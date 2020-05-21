import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableWithoutFeedback } from 'react-native-web';

import Toolbar from '../shared/Toolbar';
import { NumericInput, Field, Divider } from '../core';

const MainToolbar = ({ state, currentTool, dispatch }) => {
  console.log('MainToolbar()', currentTool);

  const handleButtonPress = (name, value) => {
    dispatch({
      type: name,
      payload: value,
    });
  };

  return (
    <View>
      <Toolbar onButtonPress={handleButtonPress}>
        <Toolbar.Group title="Tools" name="SELECT_TOOL" selectedValue={currentTool}>
          <Toolbar.Button icon="mike-pointer-solid.png" value={{ tool: 'GridDraw.Tools.Move' }} />
          <Toolbar.Button icon="mike-pointer.png" value={{ tool: 'GridDraw.Tools.Edit' }} />
        </Toolbar.Group>
        <Toolbar.Group title="Shapes" name="SELECT_TOOL" selectedValue={currentTool}>
          <Toolbar.Button icon="mike-square.png" value={{ tool: 'Create', type: 'GridDraw.Shape.Rect' }} />
          <Toolbar.Button icon="mike-circle.png" value={{ tool: 'Create', type: 'GridDraw.Shape.Ellipse' }} />
          {/* <Toolbar.Button icon="001-star" />
          <Toolbar.Button icon="007-pen-tool" /> */}
        </Toolbar.Group>
        {/* <Toolbar.Group title="Arrange" name="ORDER_SHAPE">
          <Toolbar.Button icon="foreground" value={{ order: 'foreground ' }} />
          <Toolbar.Button icon="background" />
        </Toolbar.Group> */}
        <Toolbar.Group title="Guides" name="TOGGLE_OPTION">
          <Toolbar.Button icon="mike-ruler.png" value={{ option: 'showRuler' }} selected={state.options.showRuler} />
          <Toolbar.Button icon="mike-grid.png" value={{ option: 'showGrid' }} selected={state.options.showGrid} />
          <Toolbar.Button icon="mike-magnet.png" value={{ option: 'snapToGrid' }} selected={state.options.snapToGrid} />
        </Toolbar.Group>
        <Toolbar.Group title="Canvas" name="TOGGLE_OPTION">
          <Toolbar.Button icon="mike-horizontal.png" value={{ option: 'showSecondCanvas' }} selected={state.options.showSecondCanvas} />
          <Toolbar.Button icon="mike-vertical.png" value={{ option: 'showThirdCanvas' }} selected={state.options.showThirdCanvas} />
        </Toolbar.Group>
        <Toolbar.Group title="Arange" name="TOGGLE_OPTION" disabled>
          <Toolbar.Button icon="mike-group.png" value={{ option: 'showSecondCanvas' }} />
          <Toolbar.Button icon="mike-bring-forward.png" value={{ option: 'showThirdCanvas' }} />
          <Toolbar.Button icon="mike-send-backward.png" value={{ option: 'showThirdCanvas' }} />
        </Toolbar.Group>
        <Toolbar.Group title="Combine" name="TOGGLE_OPTION" disabled>
          <Toolbar.Button icon="mike-combine-union.png" value={{ option: 'showSecondCanvas' }} />
          <Toolbar.Button icon="mike-combine-subtraction.png" value={{ option: 'showThirdCanvas' }} />
          <Toolbar.Button icon="mike-combine-intersection.png" value={{ option: 'showThirdCanvas' }} />
          <Toolbar.Button icon="mike-combine-division.png" value={{ option: 'showThirdCanvas' }} />
        </Toolbar.Group>
      </Toolbar>
      <Divider color="#d8d8d8" />
      <Toolbar>
        {currentTool.tool === "Create" && (
          <Toolbar.Group>
            <Text>Tool Options</Text>
            <NumericInput value={0} />
          </Toolbar.Group>
        )}
        {currentTool.type === "GridDraw.Shape.Rect" && (
          <Toolbar.Group>
            <Field Component={NumericInput} label="Corner Radius" value={10} />
          </Toolbar.Group>
        )}
      </Toolbar>
      <Divider color="#d0d0d0" />
    </View>
  );
};

export default React.memo(MainToolbar);

/*

Tools

GridDraw.Tool.Select
GridDraw.Shape.Ellipse

*/
