type Shape = {
  id: number,
  type: string,
  childIds: number[],
  properties: {
    position: number[],
    hue: number,
    opacity: number,
    angle: number,
  };
};

export default Shape;
