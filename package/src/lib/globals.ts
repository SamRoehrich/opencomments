import { createCommentForm } from "../ui/comment-form";

const handleMouseDown = (e: MouseEvent) => {
  createCommentForm({ x: e.pageX, y: e.pageY });
}

export const addCreateCommentFormListener = () => window.addEventListener('mousedown', handleMouseDown)
export const removeCreateCommentFormListener = () => window.removeEventListener('mousedown', handleMouseDown)

window.comments = {
  handleMouseDown
}
