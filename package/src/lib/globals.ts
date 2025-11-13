import { createCommentForm } from "../ui/comment-form";

const handleMouseDown = (e: MouseEvent) => {
  const clickElement = e.target;
  console.log({ clickElement });

  const selector = [];

  if (clickElement?.id) selector.push(`#id:${clickElement.id}`);
  if (clickElement?.class) selector.push(`class:${clickElement.class}`);
  const relativeX = e.clientX - clickElement.getBoundingClientRect().left;
  const relativeY = e.clientY - clickElement.getBoundingClientRect().top;

  const clickElementWidth = clickElement.offsetWidth;
  const clickElementHeight = clickElement.offsetHeight;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  createCommentForm({
    selector,
    relativeX,
    relativeY,
    clickElementWidth,
    clickElementHeight,
    viewportWidth,
    viewportHeight,
  });
};

export const addCreateCommentFormListener = () =>
  window.addEventListener("mousedown", handleMouseDown);
export const removeCreateCommentFormListener = () =>
  window.removeEventListener("mousedown", handleMouseDown);

window.comments = {
  handleMouseDown,
};
