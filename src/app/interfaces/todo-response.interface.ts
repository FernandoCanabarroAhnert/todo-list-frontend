export interface ITodoResponse {
    id: string;
    title: string;
    description: string;
    priority: number;
    status: number;
    image: string;
    userId: string;
    createdAt: Date;
    expiresAt: Date;
}