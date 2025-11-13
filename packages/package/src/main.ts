import "./style.css";
import typescriptLogo from "./typescript.svg";
import viteLogo from "/vite.svg";
import { createCommentButton } from "./lib/create-comment-button.ts";
import { getAllComments } from "./api/comments/index.ts";
import { createWidget } from "./ui/widget.ts";

createWidget();

const comments = await getAllComments();
for (const comment of comments) {
  if (
    comment?.["x_cordinate"] &&
    comment?.["y_cordinate"] &&
    !comment?.resolved
  ) {
    createCommentButton(
      {
        x: comment["x_cordinate"],
        y: comment["y_cordinate"],
      },
      comment.id,
    );
  }
}

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <button id="counter" type="button">123456</button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`;
