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
export type CommentUpdate = Partial<Omit<CommentInsert, "selector">> & {
    selector?: string[];
};
