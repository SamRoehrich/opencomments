export type Issue = {
    id: number;
    url: string | null;
    description: string | null;
    created_at: Date;
    resolved: boolean;
    selector: string[];
    relative_x: number;
    relative_y: number;
    element_height: number;
    element_width: number;
    viewport_height: number;
    viewport_width: number;
    user_id: string;
    env_id: string;
};
export type IssueInsert = {
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
    user_id: string;
    env_id: string;
};
export type IssueUpdate = Partial<Omit<IssueInsert, "selector">> & {
    selector?: string[];
};
export type Comment = {
    id: number;
    comment: string;
    issue_id: number;
    user_id: string;
    created_at: Date;
    updated_at: Date;
};
export type CommentInsert = {
    comment: string;
    issue_id: number;
    user_id: string;
};
export type CommentUpdate = Partial<Omit<CommentInsert, "comment">> & {
    comment?: string;
};
