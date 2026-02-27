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
