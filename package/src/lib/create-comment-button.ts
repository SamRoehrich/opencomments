import { comment } from "../ui/comment";
import type { Comment } from "./types";

export type Cordinates = {
  x: number;
  y: number;
};
export const createCommentButton = (cordinates: Cordinates, id: string) => {
  if (cordinates?.x && cordinates?.y) {
    const dialogEl = document.createElement("div");
    dialogEl.id = id;
    dialogEl.style.height = "16px";
    dialogEl.style.position = "absolute";
    dialogEl.style.width = "16px";
    dialogEl.style.borderRadius = "100px";
    dialogEl.style.backgroundColor = "red";
    dialogEl.style.top = `${cordinates.y}px`;
    dialogEl.style.left = `${cordinates.x}px`;

    dialogEl.onclick = (_e) => handleCommentIconClick(id);

    document.body.appendChild(dialogEl);
  }
};

async function handleCommentIconClick(id: string) {
  const commentData = await fetch(`http://localhost:3001/api/comments/${id}`);
  console.log({ commentData });
  const data = (await commentData.json()) as Comment;
  console.log({ data });
  comment({ comment: data[0] });
}
