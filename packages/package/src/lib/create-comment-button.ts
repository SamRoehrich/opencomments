import type { Issue } from "@opencomments/types";
import { getIssue } from "../api/comments";
import { comment } from "../ui/comment";
import { getElementByXPath } from "./get-element-by-xpath";

// Create comment icon SVG (same as widget)
const createCommentIconSVG = () => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "14");
  svg.setAttribute("height", "14");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "2");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");

  const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path1.setAttribute(
    "d",
    "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
  );
  svg.appendChild(path1);

  return svg;
};

// Store resize handler to avoid multiple listeners
let resizeHandler: (() => void) | null = null;
const iconElements = new Map<
  number,
  { element: HTMLElement; issue: Issue; parent: HTMLElement }
>();

function updateIconPosition(iconData: {
  element: HTMLElement;
  issue: Issue;
  parent: HTMLElement;
}) {
  const { element, issue, parent } = iconData;
  const currentWidth = parent.offsetWidth || parent.clientWidth;
  const currentHeight = parent.offsetHeight || parent.clientHeight;

  // Calculate scale factors based on current vs original element size
  const widthScale =
    issue.element_width > 0 ? currentWidth / issue.element_width : 1;
  const heightScale =
    issue.element_height > 0 ? currentHeight / issue.element_height : 1;

  // Scale the position based on element size changes
  const scaledX = issue.relative_x * widthScale;
  const scaledY = issue.relative_y * heightScale;

  element.style.left = `${scaledX}px`;
  element.style.top = `${scaledY}px`;
}

function setupResizeListener() {
  if (resizeHandler) return; // Already set up

  resizeHandler = () => {
    iconElements.forEach(updateIconPosition);
  };

  window.addEventListener("resize", resizeHandler);
}

export const clearAllIcons = () => {
  iconElements.forEach(({ element }) => {
    element.remove();
  });
  iconElements.clear();
};

export const createCommentButton = (issue: Issue) => {
  if (issue) {
    console.log({ issue });
    let parent: Element | null = null;

    // Try to find element by ID selector first (#id:...)
    const idSelector = issue.selector.find((s) => s && s.startsWith("#id:"));
    if (idSelector) {
      const id = idSelector.replace("#id:", "");
      parent = document.getElementById(id);
    }

    // If not found by ID, try XPath selector
    if (!parent) {
      // Find XPath selector - it might be wrapped in quotes
      const xpathSelector = issue.selector.find((s) => {
        if (!s) return false;
        // Remove quotes to check if it's an XPath
        const cleaned = s.replace(/^["']+|["']+$/g, "");
        return cleaned.startsWith("/") || cleaned.includes("[@id=");
      });

      if (xpathSelector) {
        // Remove surrounding quotes and unescape any escaped quotes within the XPath
        let xpath = xpathSelector.trim();

        // Remove quotes from start and end (handle multiple quote types)
        while (
          (xpath.startsWith('"') && xpath.endsWith('"')) ||
          (xpath.startsWith("'") && xpath.endsWith("'"))
        ) {
          xpath = xpath.slice(1, -1);
        }

        // Unescape any escaped quotes within the XPath
        xpath = xpath.replace(/\\"/g, '"').replace(/\\'/g, "'");

        console.log("Cleaned XPath:", xpath, "from original:", xpathSelector);
        parent = getElementByXPath(xpath);
      }
    }

    if (!parent) {
      console.warn(
        `Could not find element for issue ${issue.id}. Selectors:`,
        issue.selector,
      );
      return;
    }

    // Ensure parent has position: relative so absolute positioning works relative to it
    const parentElement = parent as HTMLElement;
    const computedStyle = window.getComputedStyle(parentElement);
    if (computedStyle.position === "static") {
      parentElement.style.position = "relative";
    }

    // Remove existing icon if it exists
    const existingIcon = document.getElementById(issue.id.toString());
    if (existingIcon) {
      existingIcon.remove();
      iconElements.delete(issue.id);
    }

    const dialogEl = document.createElement("div");
    dialogEl.id = issue.id.toString();
    dialogEl.className = "opencomments-comment-icon";

    // Create and append the comment icon SVG (same as widget)
    const iconSvg = createCommentIconSVG();
    dialogEl.appendChild(iconSvg);

    dialogEl.onclick = (e) => handleCommentIconClick(issue.id, e);

    parentElement.appendChild(dialogEl);

    // Store icon data for resize updates
    iconElements.set(issue.id, {
      element: dialogEl,
      issue,
      parent: parentElement,
    });

    // Set initial position
    updateIconPosition({ element: dialogEl, issue, parent: parentElement });

    // Setup resize listener if not already done
    setupResizeListener();
  }
};

async function handleCommentIconClick(id: number, e: MouseEvent) {
  e.stopPropagation(); // Prevent event bubbling
  const commentData = await getIssue(id);

  // Get the icon container (div), not the SVG
  const iconElement = (e.target as HTMLElement).closest(
    ".opencomments-comment-icon",
  ) as HTMLElement;
  if (!iconElement) return;

  const iconRect = iconElement.getBoundingClientRect();

  // Get icon position relative to viewport
  const iconX = iconRect.left;
  const iconY = iconRect.top + iconRect.height; // Position below the icon

  comment({
    issue: commentData,
    commentElementId: iconElement.id,
    position: { x: iconX, y: iconY },
  });
}
