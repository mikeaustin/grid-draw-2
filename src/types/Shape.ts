type Shape = {
  id: number,
  type: string,
  childIds: number[],
  properties: {
    position: number[],
    fill: {
      hue: number,
      saturation: number,
      lightness: number,
    },
    opacity: number,
    angle: number,
  };
};

export default Shape;
