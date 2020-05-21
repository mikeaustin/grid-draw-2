type Shape = {
  id: number,
  type: string,
  childIds: number[],
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

export default Shape;
