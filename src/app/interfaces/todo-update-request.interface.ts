import { ITodoRequest } from "./todo-request.interface";

export interface ITodoUpdateRequest extends ITodoRequest {
    status: number;
}