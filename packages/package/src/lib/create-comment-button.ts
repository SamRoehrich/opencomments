import type { Issue } from "@opencomments/types";
import { getIssue } from "../api/comments";
import { comment } from "../ui/comment";

export type Cordinates = {
  x: number;
  y: number;
};
export const createCommentButton = (issue: Issue) => {
  if (issue) {
    const dialogEl = document.createElement("div");
    dialogEl.id = issue.id.toString();
    dialogEl.style.height = "16px";
    dialogEl.style.position = "absolute";
    dialogEl.style.width = "16px";
    dialogEl.style.borderRadius = "100px";
    dialogEl.style.backgroundColor = "red";
    dialogEl.style.top = `${issue.relative_y}px`;
    dialogEl.style.left = `${issue.relative_x}px`;

    dialogEl.onclick = (e) => handleCommentIconClick(issue.id, e);

    document.body.appendChild(dialogEl);
  }
};

async function handleCommentIconClick(id: number, e: MouseEvent) {
  const commentData = await getIssue(id);
  comment({ issue: commentData, commentElementId:  e?.target?.id});
}
