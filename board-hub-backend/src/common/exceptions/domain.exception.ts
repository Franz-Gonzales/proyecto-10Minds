export class DomainException extends Error {
    readonly code: string;
    readonly statusCode: number;

    constructor(message: string, code: string, statusCode: number) {
        super(message);
        this.name = this.constructor.name;
        this.code = code;
        this.statusCode = statusCode;
    }
}

export class NotFoundException extends DomainException {
    constructor(message: string) {
        super(message, 'NOT_FOUND', 404);
    }
}

export class AlreadyExistsException extends DomainException {
    constructor(message: string) {
        super(message, 'ALREADY_EXISTS', 409);
    }
}

export class InvalidDataException extends DomainException {
    constructor(message: string) {
        super(message, 'INVALID_DATA', 400);
    }
}

export class InsufficientResourceException extends DomainException {
    constructor(message: string) {
        super(message, 'INSUFFICIENT_RESOURCE', 409);
    }
}