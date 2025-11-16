import type { Review, ReviewInsert, ReviewUpdate } from "@opencomments/types";

// Get the API base URL from window or use default
function getApiBaseUrl(): string {
  if (
    typeof window !== "undefined" &&
    (window as any).__OPENCOMMENTS_API_URL__
  ) {
    return (window as any).__OPENCOMMENTS_API_URL__;
  }
  return "http://localhost:3001";
}

export const createReview = async (review: ReviewInsert): Promise<Review> => {
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/api/reviews/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(review),
  });
  const data = await res.json();
  return data.review;
};

export const getReview = async (id: number): Promise<Review> => {
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/api/reviews/${id}`);
  const data = await res.json();
  return data;
};

export const updateReview = async (
  id: number,
  review: ReviewUpdate,
): Promise<Review> => {
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/api/reviews/${id}/update`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(review),
  });
  const data = await res.json();
  return data;
};

export const getReviews = async (envId?: string): Promise<Review[]> => {
  const baseUrl = getApiBaseUrl();
  const url = envId
    ? `${baseUrl}/api/reviews?env=${encodeURIComponent(envId)}`
    : `${baseUrl}/api/reviews`;
  const res = await fetch(url);
  const data = await res.json();
  return data;
};

