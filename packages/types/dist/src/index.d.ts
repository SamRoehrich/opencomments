export type Review = {
    id: number;
    name: string;
    description: string | null;
    created_at: Date;
    updated_at: Date;
    user_id: string;
    env_id: string | null;
};
export type ReviewInsert = {
    name: string;
    description?: string;
    user_id: string;
    env_id?: string;
};
export type ReviewUpdate = Partial<Omit<ReviewInsert, "name">> & {
    name?: string;
};
export type Issue = {
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
    user_id: string;
    assigned_to_user_id: string | null;
    env_id: string | null;
    review_id: number | null;
    screenshot?: string | null;
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
    assigned_to_user_id?: string;
    env_id?: string;
    review_id?: number;
    screenshot?: string;
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
