import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableWithoutFeedback } from 'react-native-web';

import Toolbar from '../shared/Toolbar';
import { NumericInput, Field } from '../core';

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
          <Toolbar.Button icon="037-cursor" value={{ tool: 'GridDraw.Tools.Move' }} />
          {/* <Toolbar.Button icon="008-resize" value="GridDraw.Tools.Move" /> */}
        </Toolbar.Group>
        <Toolbar.Group title="Shapes" name="SELECT_TOOL" selectedValue={currentTool}>
          <Toolbar.Button icon="009-rectangle" value={{ tool: 'Create', type: 'GridDraw.Shape.Rect' }} />
          <Toolbar.Button icon="025-ellipse" value={{ tool: 'Create', type: 'GridDraw.Shape.Ellipse' }} />
          {/* <Toolbar.Button icon="001-star" />
          <Toolbar.Button icon="007-pen-tool" /> */}
        </Toolbar.Group>
        {/* <Toolbar.Group title="Arrange" name="ORDER_SHAPE">
          <Toolbar.Button icon="foreground" value={{ order: 'foreground ' }} />
          <Toolbar.Button icon="background" />
        </Toolbar.Group> */}
        <Toolbar.Group title="Guides" name="TOGGLE_OPTION">
          <Toolbar.Button icon="ruler" value={{ option: 'showRuler' }} selected={state.options.showRuler} />
          <Toolbar.Button icon="square-20" value={{ option: 'showGrid' }} selected={state.options.showGrid} />
        </Toolbar.Group>
        <Toolbar.Group title="Canvas" name="TOGGLE_OPTION">
          <Toolbar.Button icon="003-object-alignment-1" value={{ option: 'showSecondCanvas' }} selected={state.options.showSecondCanvas} />
          <Toolbar.Button icon="004-object-alignment-2" value={{ option: 'showThirdCanvas' }} selected={state.options.showThirdCanvas} />
        </Toolbar.Group>
      </Toolbar>
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
    </View>
  );
};

export default React.memo(MainToolbar);

/*

Tools

GridDraw.Tool.Select
GridDraw.Shape.Ellipse

*/
