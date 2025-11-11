import { addCreateCommentFormListener } from "../lib/globals";

export const createWidget = () => {
  const widget = document.createElement("div");
  widget.style.height = "48px";
  widget.style.width = "48px";
  widget.style.borderRadius = "100px";
  widget.innerHTML = "C"
  widget.style.position = "absolute";
  widget.style.top = "24px";
  widget.style.left = "24px";
  widget.style.border = "1px solid black"

  widget.onclick = () => addCreateCommentFormListener()

  document.body.appendChild(widget)
}
