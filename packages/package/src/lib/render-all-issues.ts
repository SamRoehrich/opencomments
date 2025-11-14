import { getAllIssues } from "../api/comments";
import { createCommentButton } from "./create-comment-button";

export const renderAllIssues = async () => {
  const issues = await getAllIssues();
  console.log({ issues })
  issues.forEach(issue => {
     !issue.resolved && createCommentButton(issue);
  })
}

