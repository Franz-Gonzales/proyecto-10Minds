import {
    AlreadyExistsException,
    InvalidDataException,
    NotFoundException,
} from "../../../../common/exceptions/domain.exception";

export class ClientNotFoundException extends NotFoundException {
    constructor(id: string) {
        super(`Client with id "${id}" not found`);
    }
}

export class ClientAlreadyExistsException extends AlreadyExistsException {
    constructor(field: string) {
        super(`Client with value "${field}" already exists`);
    }
}

export class InvalidClientDataException extends InvalidDataException {
    constructor(message: string) {
        super(message);
    }
}

export class ClientInactiveException extends InvalidDataException {
    constructor(id: string) {
        super(`Client with id "${id}" is inactive`);
    }
}
