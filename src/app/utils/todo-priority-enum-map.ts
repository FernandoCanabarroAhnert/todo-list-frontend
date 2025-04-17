import { TodoPriorityEnum } from "../enums/todo-priority.enum";

export const todoPriorityEnumMap: { [key in TodoPriorityEnum]: string } = {
    [TodoPriorityEnum.EXTREME]: 'Vital',
    [TodoPriorityEnum.MODERATE]: 'Moderada',
    [TodoPriorityEnum.LOW]: 'Baixa'
}