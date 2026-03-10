export interface Page<T> {
    "content": T[];
    "empty": boolean;
    "first": boolean;
    "last": boolean;
    "number": number;
    "numberOfElements": number;
    "pageable": {
        "offset": number;
        "pageNumber": number;
        "pageSize": number;
        "paged": boolean;
        "sort": any[];
        "unpaged": boolean;
    };
    "size": number;
    "sort": any[];
    "totalElements": number;
    "totalPages": number;
}