import type { Issue, IssueInsert, Comment, CommentInsert } from "@opencomments/types";

export const getAllIssues = async (envId?: string): Promise<Issue[]> => {
  const url = envId 
    ? `http://localhost:3001/api/issues?env=${encodeURIComponent(envId)}`
    : "http://localhost:3001/api/issues";
  const data = await fetch(url);
  const issues = await data.json() as Issue[];

  return issues;
};

export const getIssue = async (id: number): Promise<Issue> => {
  const data = await fetch(`http://localhost:3001/api/issues/${id}`);
  const res = await data?.json();

  return res[0];
};

export const resolveIssue = async (id: number, resolved: boolean): Promise<Issue> => {
  const res = await fetch("http://localhost:3001/api/issues/resolve", {
    method: "POST",
    body: JSON.stringify({ id, resolved }),
  });
  const data = await res.json();

  return data;
};

export const createIssue = async (issue: IssueInsert): Promise<Issue> => {
  const res = await fetch("http://localhost:3001/api/issues/create", {
    method: "POST",
    body: JSON.stringify({
      ...issue,
    }),
  });
  const data = await res?.json();
  return data;
};

// Comment API functions
export const getComments = async (issueId: number): Promise<Comment[]> => {
  const res = await fetch(`http://localhost:3001/api/comments/issue/${issueId}`);
  const comments = await res.json() as Comment[];
  return comments;
};

export const createComment = async (comment: CommentInsert): Promise<Comment> => {
  const res = await fetch("http://localhost:3001/api/comments/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(comment),
  });
  const data = await res.json();
  return data;
};
