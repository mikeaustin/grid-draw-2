type Shape = {
  id: number,
  type: string,
  childIds: number[],
  parentId: number,
  properties: {
    [property: string]: any;
  };
};

export default Shape;

/*

  properties: {
    position: {
      x: number,
      y: number,
    },
    fill: {
      hue: number,
      saturation: number,
      lightness: number,
    },
    opacity: number,
    angle: number,
    cornerRadius: number,
  };
};

*/
