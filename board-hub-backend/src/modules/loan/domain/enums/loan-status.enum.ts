import { registerEnumType } from "@nestjs/graphql";

export enum LoanStatus {
    RESERVED = 'RESERVED',
    LOANED = 'LOANED',
    DELIVERED = 'DELIVERED',
    OVERDUE = 'OVERDUE',
}

registerEnumType(LoanStatus, {
    name: 'LoanStatus',
    description: 'Status of a loan',
});