export interface IconOptions {
  width?: string;
  height?: string;
  viewBox?: string;
  className?: string | string[];
  fill?: string;
  stroke?: string;
  strokeWidth?: string;
  strokeLinecap?: string;
  strokeLinejoin?: string;
}

const createSVG = (options: IconOptions = {}): SVGElement => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  
  svg.setAttribute("width", options.width || "24");
  svg.setAttribute("height", options.height || "24");
  svg.setAttribute("viewBox", options.viewBox || "0 0 24 24");
  svg.setAttribute("fill", options.fill || "none");
  
  if (options.stroke) {
    svg.setAttribute("stroke", options.stroke);
  }
  
  if (options.strokeWidth) {
    svg.setAttribute("stroke-width", options.strokeWidth);
  }
  
  if (options.strokeLinecap) {
    svg.setAttribute("stroke-linecap", options.strokeLinecap);
  }
  
  if (options.strokeLinejoin) {
    svg.setAttribute("stroke-linejoin", options.strokeLinejoin);
  }
  
  if (options.className) {
    const classes = Array.isArray(options.className) 
      ? options.className 
      : [options.className];
    svg.setAttribute("class", classes.filter(Boolean).join(" "));
  }
  
  return svg;
};

const createSVGPath = (d: string, fill?: string): SVGPathElement => {
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", d);
  if (fill) {
    path.setAttribute("fill", fill);
  }
  return path;
};

const createSVGCircle = (cx: string, cy: string, r: string): SVGCircleElement => {
  const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("cx", cx);
  circle.setAttribute("cy", cy);
  circle.setAttribute("r", r);
  return circle;
};

const createSVGRect = (
  x: string,
  y: string,
  width: string,
  height: string,
  rx?: string,
  ry?: string
): SVGRectElement => {
  const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rect.setAttribute("x", x);
  rect.setAttribute("y", y);
  rect.setAttribute("width", width);
  rect.setAttribute("height", height);
  if (rx) rect.setAttribute("rx", rx);
  if (ry) rect.setAttribute("ry", ry);
  return rect;
};

export const createCommentIcon = (options: IconOptions = {}): SVGElement => {
  const svg = createSVG({
    width: options.width || "14",
    height: options.height || "14",
    stroke: options.stroke || "currentColor",
    strokeWidth: options.strokeWidth || "2",
    strokeLinecap: options.strokeLinecap || "round",
    strokeLinejoin: options.strokeLinejoin || "round",
    className: options.className,
  });
  
  const path = createSVGPath(
    "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
  );
  svg.appendChild(path);
  
  return svg;
};

export const createSettingsIcon = (options: IconOptions = {}): SVGElement => {
  const svg = createSVG({
    width: options.width || "14",
    height: options.height || "14",
    stroke: options.stroke || "currentColor",
    strokeWidth: options.strokeWidth || "2",
    strokeLinecap: options.strokeLinecap || "round",
    strokeLinejoin: options.strokeLinejoin || "round",
    className: options.className,
  });
  
  const path = createSVGPath(
    "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
  );
  svg.appendChild(path);
  
  const circle = createSVGCircle("12", "12", "3");
  svg.appendChild(circle);
  
  return svg;
};

export const createRefreshIcon = (options: IconOptions = {}): SVGElement => {
  const svg = createSVG({
    width: options.width || "14",
    height: options.height || "14",
    stroke: options.stroke || "currentColor",
    strokeWidth: options.strokeWidth || "2",
    strokeLinecap: options.strokeLinecap || "round",
    strokeLinejoin: options.strokeLinejoin || "round",
    className: options.className,
  });
  
  const path1 = createSVGPath("M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8");
  svg.appendChild(path1);
  
  const path2 = createSVGPath("M21 3v5h-5");
  svg.appendChild(path2);
  
  const path3 = createSVGPath("M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16");
  svg.appendChild(path3);
  
  const path4 = createSVGPath("M3 21v-5h5");
  svg.appendChild(path4);
  
  return svg;
};

export const createScreenshotIcon = (options: IconOptions = {}): SVGElement => {
  const svg = createSVG({
    width: options.width || "20",
    height: options.height || "20",
    stroke: options.stroke || "currentColor",
    strokeWidth: options.strokeWidth || "2",
    strokeLinecap: options.strokeLinecap || "round",
    strokeLinejoin: options.strokeLinejoin || "round",
    className: options.className,
  });
  
  const rect = createSVGRect("3", "3", "18", "18", "2", "2");
  svg.appendChild(rect);
  
  const circle = createSVGCircle("9", "9", "2");
  svg.appendChild(circle);
  
  const path = createSVGPath("M21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21");
  svg.appendChild(path);
  
  return svg;
};

export const createCheckmarkIcon = (options: IconOptions & { fill?: string } = {}): SVGElement => {
  const svg = createSVG({
    width: options.width || "20",
    height: options.height || "20",
    className: options.className,
  });
  
  const path = createSVGPath(
    "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z",
    options.fill || "#4caf50"
  );
  svg.appendChild(path);
  
  return svg;
};

export const createCloseIcon = (options: IconOptions = {}): SVGElement => {
  const svg = createSVG({
    width: options.width || "14",
    height: options.height || "14",
    stroke: options.stroke || "currentColor",
    strokeWidth: options.strokeWidth || "2",
    strokeLinecap: options.strokeLinecap || "round",
    strokeLinejoin: options.strokeLinejoin || "round",
    className: options.className,
  });
  
  const path1 = createSVGPath("M18 6L6 18");
  const path2 = createSVGPath("M6 6l12 12");
  svg.appendChild(path1);
  svg.appendChild(path2);
  
  return svg;
};

