// Simple fetch wrapper for tRPC endpoints
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // Browser should use relative URL
    return '';
  }
  // For SSR or server-side, use environment variable or default
  return process.env.API_BASE_URL || 'http://localhost:3002';
};

export const trpc = {
  // Query methods
  reviews: {
    list: async (input?: any) => {
      const response = await fetch(`${getBaseUrl()}/trpc/reviews.list${input ? `?input=${encodeURIComponent(JSON.stringify(input))}` : ''}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      return response.json();
    },
    getById: async (input: { id: string }) => {
      const response = await fetch(`${getBaseUrl()}/trpc/reviews.getById?input=${encodeURIComponent(JSON.stringify(input))}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      return response.json();
    },
    getIssues: async (input: { id: string }) => {
      const response = await fetch(`${getBaseUrl()}/trpc/reviews.getIssues?input=${encodeURIComponent(JSON.stringify(input))}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      return response.json();
    },
  },
  comments: {
    getByIssueId: async (input: { issueId: string }) => {
      const response = await fetch(`${getBaseUrl()}/trpc/comments.getByIssueId?input=${encodeURIComponent(JSON.stringify(input))}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      return response.json();
    },
  },
  issues: {
    list: async (input?: any) => {
      const response = await fetch(`${getBaseUrl()}/trpc/issues.list${input ? `?input=${encodeURIComponent(JSON.stringify(input))}` : ''}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      return response.json();
    },
  },

  // Mutation methods
  mutations: {
    reviews: {
      create: async (input: any) => {
        const response = await fetch(`${getBaseUrl()}/trpc/reviews.create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(input),
        });
        return response.json();
      },
    },
    comments: {
      create: async (input: any) => {
        const response = await fetch(`${getBaseUrl()}/trpc/comments.create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(input),
        });
        return response.json();
      },
    },
    issues: {
      resolve: async (input: { id: string; resolved: boolean }) => {
        const response = await fetch(`${getBaseUrl()}/trpc/issues.resolve`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(input),
        });
        return response.json();
      },
      assign: async (input: { id: string; assigned_to_user_id?: string }) => {
        const response = await fetch(`${getBaseUrl()}/trpc/issues.assign`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(input),
        });
        return response.json();
      },
    },
  },
};