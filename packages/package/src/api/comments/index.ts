import type { Issue, IssueInsert, Comment, CommentInsert } from "@opencomments/types";

// Get the API base URL from window or use default
function getApiBaseUrl(): string {
  if (typeof window !== "undefined" && (window as any).__OPENCOMMENTS_API_URL__) {
    return (window as any).__OPENCOMMENTS_API_URL__;
  }
  return "http://localhost:3001";
}

export const getAllIssues = async (envId?: string): Promise<Issue[]> => {
  const baseUrl = getApiBaseUrl();
  const url = envId 
    ? `${baseUrl}/api/issues?env=${encodeURIComponent(envId)}`
    : `${baseUrl}/api/issues`;
  const data = await fetch(url);
  const issues = await data.json() as Issue[];

  return issues;
};

export const getIssue = async (id: number): Promise<Issue> => {
  const baseUrl = getApiBaseUrl();
  const data = await fetch(`${baseUrl}/api/issues/${id}`);
  const res = await data?.json();

  return res[0];
};

export const resolveIssue = async (id: number, resolved: boolean): Promise<Issue> => {
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/api/issues/resolve`, {
    method: "POST",
    body: JSON.stringify({ id, resolved }),
  });
  const data = await res.json();

  return data;
};

export const createIssue = async (issue: IssueInsert): Promise<Issue> => {
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/api/issues/create`, {
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
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/api/comments/issue/${issueId}`);
  const comments = await res.json() as Comment[];
  return comments;
};

export const createComment = async (comment: CommentInsert): Promise<Comment> => {
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/api/comments/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(comment),
  });
  const data = await res.json();
  return data;
};
