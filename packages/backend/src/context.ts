export interface CreateContextOptions {
  req: Request;
}

export interface Context {
  req: Request;
}

export async function createContext({ req }: CreateContextOptions): Promise<Context> {
  return {
    req,
  };
}