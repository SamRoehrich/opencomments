import { createComment } from "../api/comments";
import type { Cordinates } from "../lib/create-comment-button";
import {
  addCreateCommentFormListener,
  removeCreateCommentFormListener,
} from "../lib/globals";

export const createCommentForm = (cordinates: Cordinates) => {
  removeCreateCommentFormListener();
  const parent = document.createElement("div");
  parent.style.border = "1px solid black";
  parent.style.borderRadius = "8px";

  const form = document.createElement("form");
  form.style.height = "100%";
  form.style.padding = "8px";
  form.style.display = "flex";
  form.style.flexDirection = "column";

  const input = document.createElement("textarea");
  input.style.borderRadius = "8px";
  input.style.margin = "0 auto";
  input.style.height = "150px";

  const button = document.createElement("button");
  button.innerHTML = "Comment";
  button.onclick = (e) => handleButtonClick(e, input, cordinates, parent);

  form.appendChild(input);
  form.appendChild(button);
  parent.appendChild(form);
  document.body.appendChild(parent);
};

async function handleButtonClick(
  e: PointerEvent,
  input: HTMLTextAreaElement,
  cordinates: Cordinates,
  parent: HTMLDivElement,
) {
  e.preventDefault();
  const comment = input.value;
  const data = await createComment({
    description: comment,
    resolved: false,
    x_cordinate: cordinates.x.toString(),
    y_cordinate: cordinates.y.toString(),
  });

  if (data.id) {
    document.body.removeChild(parent);
    addCreateCommentFormListener();
  }
}
