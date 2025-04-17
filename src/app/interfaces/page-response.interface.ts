export interface IPageResponse <T> {
    content: T;
    number: number; // => índice da página atual
    totalPages: number; // -> quantidade total de páginas
    totalElements: number; // -> quantidade total de itens
    numberOfElements: number; // -> quantidade de itens na página
}