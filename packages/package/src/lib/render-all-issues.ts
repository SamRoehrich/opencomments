import { getAllIssues } from "../api/comments";
import { createCommentButton } from "./create-comment-button";
import { getUserSettings } from "../ui/widget";

export const renderAllIssues = async () => {
  const settings = getUserSettings();
  const envId = settings?.env;
  
  const issues = await getAllIssues(envId);
  console.log({ issues, envId })
  issues.forEach(issue => {
     !issue.resolved && createCommentButton(issue);
  })
}

