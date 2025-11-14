import { resolveIssue } from "../api/comments";
import type { Issue } from "@opencomments/types";
export const comment = ({ issue }: { issue: Issue }) => {
  const parent = document.createElement("div");
  const resolveButton = document.createElement("button");
  resolveButton.style.height = "64px";
  resolveButton.style.width = "128px";
  resolveButton.innerHTML = issue.resolved
    ? "<p>Resolved</p>"
    : "<p>Resolve</p>";

  resolveButton.onclick = async () => {
    const res = await resolveIssue(issue.id, issue.resolved);

    if (res?.resolved) {
      resolveButton.innerHTML = "<p>Resolved</p>";
    }
  };

  parent.appendChild(resolveButton);
  document.body.appendChild(parent);
};
