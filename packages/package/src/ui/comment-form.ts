import { createIssue } from "../api/comments";
import {
  addCreateCommentFormListener,
  removeCreateCommentFormListener,
} from "../lib/globals";
import { renderAllIssues } from "../lib/render-all-issues";
import type { ElementPositionMeta } from "../lib/types";

export const createCommentForm = (args: ElementPositionMeta) => {
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
  button.onclick = (e) => handleButtonClick(e, input, args, parent);

  form.appendChild(input);
  form.appendChild(button);
  parent.appendChild(form);
  document.body.appendChild(parent);
};

async function handleButtonClick(
  e: PointerEvent,
  input: HTMLTextAreaElement,
  elementInfo: ElementPositionMeta,
  parent: HTMLDivElement,
) {
  e.preventDefault();
  const comment = input.value;
  const data = await createIssue({
    relative_x: elementInfo.relativeX,
    relative_y: elementInfo.relativeY,
    element_width: elementInfo.clickElementWidth,
    element_height: elementInfo.clickElementHeight,
    selector: elementInfo.selector,
    viewport_width: elementInfo.viewportWidth,
    viewport_height: elementInfo.viewportHeight,
    resolved: false,
    description: comment,
    url: window.location.href,
    user_id: "sam-test",
    env_id: "sam-test"
  });

  if (data.id) {
    document.body.removeChild(parent);
    addCreateCommentFormListener();
    await renderAllIssues();
  }
}
