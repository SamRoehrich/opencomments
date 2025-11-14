import type { Issue, IssueInsert } from "@opencomments/types";

export const getAllIssues = async (): Promise<Issue[]> => {
  const data = await fetch("http://localhost:3001/api/issues");
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
