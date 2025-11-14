import { resolveIssue } from "../api/comments";
import type { Issue } from "@opencomments/types";
import { renderAllIssues } from "../lib/render-all-issues";
export const comment = ({ issue, commentElementId }: { issue: Issue; commentElementId: string; }) => {
  const parent = document.createElement("div");
  const resolveButton = document.createElement("button");
  resolveButton.style.height = "64px";
  resolveButton.style.width = "128px";
  resolveButton.innerHTML = issue.resolved
    ? "<p>Resolved</p>"
    : "<p>Resolve</p>";

  resolveButton.onclick = async () => {
    const res = await resolveIssue(issue.id, !issue.resolved);

    if (res?.resolved) {
      resolveButton.style.display = "none";
      if (typeof document.getElementById(commentElementId) !== 'undefined') {
       document.getElementById(commentElementId)!.style.display = "none";
      }
    }
    await renderAllIssues();
  };

  parent.appendChild(resolveButton);
  document.body.appendChild(parent);
};
