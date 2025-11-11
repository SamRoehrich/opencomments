import type { Comment } from "../lib/types";
export const comment = ({ comment }: { comment: Comment }) => {
  const parent = document.createElement("div");
  const resolveButton = document.createElement("button");
  resolveButton.style.height = "64px";
  resolveButton.style.width = "128px";
  resolveButton.innerHTML = comment.resolved
    ? "<p>Resolved</p>"
    : "<p>Resolve</p>";

  resolveButton.onclick = async () => {
    const res = await fetch("http://localhost:3001/api/comments/resolve", {
      method: "POST",
      body: JSON.stringify({ id: comment.id, resolved: !comment.resolved }),
    });

    const data = await res.json();

    if (data?.resolved) {
      resolveButton.innerHTML = "<p>Resolved</p>";
    }
  };

  parent.appendChild(resolveButton);
  document.body.appendChild(parent);
};
