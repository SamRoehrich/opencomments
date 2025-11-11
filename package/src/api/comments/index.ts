export const getAllComments = async () => {
  const data = await fetch("http://localhost:3001/api/comments");
  const comments = await data.json();

  return comments;
};
