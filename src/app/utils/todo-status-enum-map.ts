import { TodoStatusEnum } from "../enums/todo-status.enum";

export const todoStatusEnumMap: { [key in TodoStatusEnum]: string } = {
    [TodoStatusEnum.COMPLETED]: 'Concluída',
    [TodoStatusEnum.IN_PROGRESS]: 'Em andamento',
    [TodoStatusEnum.NOT_STARTED]: 'Não iniciada',
}