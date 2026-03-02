import {
    NotFoundException,
    AlreadyExistsException,
    InvalidDataException,
    InsufficientResourceException,
} from '../../../../common/exceptions/domain.exception';

export class LoanNotFoundException extends NotFoundException {
    constructor(id: string) {
        super(`Loan with id "${id}" not found`);
    }
}

export class LoanAlreadyExistsException extends AlreadyExistsException {
    constructor(entityId: string) {
        super(`Loan with entityId "${entityId}" already exists`);
    }
}

export class InvalidLoanDataException extends InvalidDataException {
    constructor(message: string) {
        super(message);
    }
}

export class LoanInsufficientStockException extends InsufficientResourceException {
    constructor(available: number, requested: number) {
        super(
            `Insufficient stock. Available: ${available}, requested: ${requested}`,
        );
    }
}

export class LoanInvalidDateRangeException extends InvalidDataException {
    constructor(message?: string) {
        super(message ?? 'End date must be after start date');
    }
}

export class LoanAlreadyReturnedException extends InvalidDataException {
    constructor(id: string) {
        super(`Loan "${id}" has already been returned`);
    }
}

export class LoanAlreadyDeletedException extends InvalidDataException {
    constructor(id: string) {
        super(`Loan with id "${id}" has already been deleted`);
    }
}

export class LoanCannotBeReturnedException extends InvalidDataException {
    constructor(status: string) {
        super(`A loan with status "${status}" cannot be marked as returned`);
    }
}