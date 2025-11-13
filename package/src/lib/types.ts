export type ElementPositionMeta = {
  selector: string[];
  relativeX: number;
  relativeY: number;
  clickElementWidth: number;
  clickElementHeight: number;
  viewportWidth: number;
  viewportHeight: number;
};

export type Comment = {
  id?: string;
  resolved: boolean;
  description: string;
  x_cordinate: string;
  y_cordinate: string;
};
