import type { Comment } from "../../lib/types";

export const getAllComments = async () => {
  const data = await fetch("http://localhost:3001/api/comments");
  const comments = await data.json();

  return comments;
};

export const getComment = async (id: string) => {
  const data = await fetch(`http://localhost:3001/api/comments/${id}`);
  const res = await data?.json();

  return res;
};

export const resolveComment = async (id: string, resolved: boolean) => {
  const res = await fetch("http://localhost:3001/api/comments/resolve", {
    method: "POST",
    body: JSON.stringify({ id, resolved }),
  });
  const data = await res.json();

  return data;
};

export const createComment = async (comment: Comment) => {
  const res = await fetch("http://localhost:3001/api/comments/create", {
    method: "POST",
    body: JSON.stringify({
      description: comment.description,
      x_cordinate: comment.x_cordinate,
      y_cordinate: comment.y_cordinate,
      url: window.location.href,
      resolved: false,
    }),
  });
  const data = await res?.json();
  return data;
};
