import {
    AlreadyExistsException,
    InvalidDataException,
    NotFoundException,
} from "../../../../common/exceptions/domain.exception";

export class CategoryNotFoundException extends NotFoundException {
    constructor(id: string) {
        super(`Category with id "${id}" not found`);
    }
}

export class CategoryAlreadyExistsException extends AlreadyExistsException {
    constructor(field: string) {
        super(`Category with value "${field}" already exists`);
    }
}

export class InvalidCategoryDataException extends InvalidDataException {
    constructor(message: string) {
        super(message);
    }
}

export class CategoryInactiveException extends InvalidDataException {
    constructor(id: string) {
        super(`Category with id "${id}" is inactive`);
    }
}
