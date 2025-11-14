import type { IssueInsert } from "@opencomments/types";

export const getAllIssues = async () => {
  const data = await fetch("http://localhost:3001/api/issues");
  const issues = await data.json();

  return issues;
};

export const getIssue = async (id: string) => {
  const data = await fetch(`http://localhost:3001/api/issues/${id}`);
  const res = await data?.json();

  return res;
};

export const resolveIssue = async (id: number, resolved: boolean) => {
  const res = await fetch("http://localhost:3001/api/issues/resolve", {
    method: "POST",
    body: JSON.stringify({ id, resolved }),
  });
  const data = await res.json();

  return data;
};

export const createIssue = async (issue: IssueInsert) => {
  const res = await fetch("http://localhost:3001/api/issues/create", {
    method: "POST",
    body: JSON.stringify({
      ...issue,
    }),
  });
  const data = await res?.json();
  return data;
};
