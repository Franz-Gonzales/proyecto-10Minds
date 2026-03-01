import {
    NotFoundException,
    AlreadyExistsException,
    InvalidDataException,
    InsufficientResourceException,
} from '../../../../common/exceptions/domain.exception';

export class GameNotFoundException extends NotFoundException {
    constructor(id: string) {
        super(`Game with id ${id} not found`);
    }
}

export class GameAlreadyExistsException extends AlreadyExistsException {
    constructor(title: string) {
        super(`Game with title "${title}" already exists`);
    }
}

export class InvalidGameDataException extends InvalidDataException {
    constructor(message: string) {
        super(message);
    }
}

export class InsufficientStockException extends InsufficientResourceException {
    constructor(gameId: string) {
        super(`Insufficient stock for game with id "${gameId}"`);
    }
}

export class GameDeletedException extends NotFoundException {
    constructor(id: string) {
        super(`Game with id ${id} is deleted`);
    }
}