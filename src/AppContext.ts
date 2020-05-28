import React from 'react';

const AppContext = React.createContext<any>(null);
const AllShapesContext = React.createContext<any>(null);
const SelectedShapeContext = React.createContext<any>(null);

export {
  AppContext,
  AllShapesContext,
  SelectedShapeContext,
};
