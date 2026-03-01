import {
    NotFoundException,
    AlreadyExistsException,
    InvalidDataException,
    InsufficientResourceException,
} from '../../../../common/exceptions/domain.exception';

export class LoanNotFoundException extends NotFoundException {
    constructor(id: string) {
        super(`Loan with id ${id} not found`);
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


export class LoanInsufficientStockException extends Error {
    constructor(available: number, requested: number) {
        super(
            `Stock insuficiente. Disponible: ${available}, solicitado: ${requested}.`,
        );
        this.name = 'LoanInsufficientStockException';
    }
}

export class LoanInvalidDateRangeException extends Error {
    constructor(message?: string) {
        super(message ?? 'La fecha de fin debe ser posterior a la fecha de inicio.');
        this.name = 'LoanInvalidDateRangeException';
    }
}

export class LoanAlreadyReturnedException extends Error {
    constructor(id: string) {
        super(`El préstamo "${id}" ya fue marcado como entregado.`);
        this.name = 'LoanAlreadyReturnedException';
    }
}

export class LoanAlreadyDeletedException extends Error {
    constructor(id: string) {
        super(`El préstamo con ID "${id}" ya fue eliminado.`);
        this.name = 'LoanAlreadyDeletedException';
    }
}

export class LoanCannotBeReturnedException extends Error {
    constructor(status: string) {
        super(`Un préstamo en estado "${status}" no puede ser marcado como entregado.`);
        this.name = 'LoanCannotBeReturnedException';
    }
}