const BASE_LINE_WIDTH = 448;

export const GetScaleFactor = (width: number) => {
  return width / BASE_LINE_WIDTH;
};

export const GetNormalizedSize = (size: number, width: number) => {
  return size * GetScaleFactor(width);
};
