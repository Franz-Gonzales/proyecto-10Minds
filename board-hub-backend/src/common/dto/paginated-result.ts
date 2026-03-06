export interface PaginatedResult<T> {
    items: T[];                 // Los registros de ESTA página (máx. 10)
    totalItems: number;         // Número total de registros en la base de datos 
    totalPages: number;         // Número total de páginas (totalItems / itemsPerPage)
    currentPage: number;        // Página actual (1-based)
    itemsPerPage: number;       // Items por página (ej: 10)
    hasNextPage: boolean;       // Si hay una página siguiente
    hasPreviousPage: boolean;   // Si hay una página anterior
}

export function buildPaginatedResult<T>(
    items: T[],
    totalItems: number,
    page: number,
    limit: number,
): PaginatedResult<T> {
    const totalPages = Math.ceil(totalItems / limit);
    return {
        items,
        totalItems,
        totalPages,
        currentPage: page,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
    };
}