import React, { useState, useReducer, useRef, useMemo, SyntheticEvent, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableWithoutFeedback } from 'react-native-web';

import Toolbar from '../shared/Toolbar';

const MainToolbar = ({ state, currentTool, dispatch }) => {
  console.log('MainToolbar()');

  const handleButtonPress = (name, value) => {
    dispatch({
      type: name,
      payload: value,
    });
  };

  return (
    <Toolbar onButtonPress={handleButtonPress}>
      <Toolbar.Group title="Tools" name="select-tool" selectedValue={currentTool}>
        <Toolbar.Button icon="037-cursor" value={{ tool: 'GridDraw.Tools.Move' }} />
        <Toolbar.Button icon="008-resize" />
      </Toolbar.Group>
      <Toolbar.Group title="Shapes" name="select-tool" selectedValue={currentTool}>
        <Toolbar.Button icon="009-rectangle" value={{ tool: 'Create', shape: 'GridDraw.Rect' }} />
        <Toolbar.Button icon="025-ellipse" value={{ tool: 'Create', shape: 'GridDraw.Ellipse' }} />
        <Toolbar.Button icon="001-star" />
        <Toolbar.Button icon="007-pen-tool" />
      </Toolbar.Group>
      <Toolbar.Group title="Arrange" name="ORDER_SHAPE">
        <Toolbar.Button icon="foreground" value={{ order: 'foreground ' }} />
        <Toolbar.Button icon="background" />
      </Toolbar.Group>
      <Toolbar.Group title="Guides" name="TOGGLE_OPTION">
        <Toolbar.Button icon="ruler" value={{ option: 'showRuler' }} selected={state.options.showRuler} />
        <Toolbar.Button icon="background" value={{ option: 'showGrid' }} />
      </Toolbar.Group>
    </Toolbar>
  );
};

export default React.memo(MainToolbar);

/*

Tools

GridDraw.Tool.Select
GridDraw.Shape.Ellipse

*/
