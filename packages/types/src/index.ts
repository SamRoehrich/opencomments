// Database row type (what you get from SELECT queries)
export type Comment = {
  id: number;
  url: string | null;
  description: string | null;
  created_at: Date;
  resolved: boolean | null;
  selector: string[];
  relative_x: number;
  relative_y: number;
  element_height: number;
  element_width: number;
  viewport_height: number;
  viewport_width: number;
};

// Insert type (what you pass to INSERT queries)
export type CommentInsert = {
  url?: string;
  description?: string;
  resolved?: boolean;
  selector: string[];
  relative_x: number;
  relative_y: number;
  element_height: number;
  element_width: number;
  viewport_height: number;
  viewport_width: number;
};

// Update type (all fields optional)
export type CommentUpdate = Partial<Omit<CommentInsert, "selector">> & {
  selector?: string[];
};

