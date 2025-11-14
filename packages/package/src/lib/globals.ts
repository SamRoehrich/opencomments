import { createCommentForm } from "../ui/comment-form";
import { getXPath } from "./get-xpath";

const handleMouseDown = (e: MouseEvent) => {
  e.stopPropagation(); // Stop propagation to prevent immediate close
  const clickElement = e.target;
  if (!clickElement) {
    console.error("idk what you clicked but you can't leave a comment on it");
    return;
  }

  const selector = [];

  if (clickElement?.id) selector.push(`#id:${clickElement.id}`);
  if (clickElement?.class) selector.push(`class:${clickElement.class}`);
  if (clickElement) selector.push(getXPath(clickElement));
  const relativeX = e.clientX - clickElement.getBoundingClientRect().left;
  const relativeY = e.clientY - clickElement.getBoundingClientRect().top;

  const clickElementWidth = clickElement.offsetWidth;
  const clickElementHeight = clickElement.offsetHeight;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Get click position for form placement
  const clickX = e.clientX;
  const clickY = e.clientY;

  createCommentForm({
    selector,
    relativeX,
    relativeY,
    clickElementWidth,
    clickElementHeight,
    viewportWidth,
    viewportHeight,
    clickPosition: { x: clickX, y: clickY }
  });
};

export const addCreateCommentFormListener = () => {
  window.addEventListener("mousedown", handleMouseDown);
  // Change cursor to pointer to indicate comment mode
  document.body.style.cursor = "pointer";
};

export const removeCreateCommentFormListener = () => {
  window.removeEventListener("mousedown", handleMouseDown);
  // Reset cursor to normal
  document.body.style.cursor = "default";
};

window.comments = {
  handleMouseDown,
};
