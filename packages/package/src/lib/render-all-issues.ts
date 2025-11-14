import { getAllIssues } from "../api/comments";
import { createCommentButton } from "./create-comment-button";

export const renderAllIssues = async () => {
  const issues = await getAllIssues();
  for (const issue of issues) {
    if(!issue.resolved) {
     createCommentButton(issue);
    }
  }
}

