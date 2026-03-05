import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { GraphqlClientService } from '../../../core/graphql/graphql-client.service';
import { GET_ALL_LOANS, GET_LOAN_BY_ID } from '../graphql/loans.queries';
import { CREATE_LOAN, UPDATE_LOAN, RETURN_LOAN, REVERT_LOAN, DELETE_LOAN } from '../graphql/loans.mutations';
import { CreateLoanInput, Loan, LoanStatus, UpdateLoanInput } from '../models/loan.model';

interface GetAllLoansResponse {
  loans: Loan[];
}

interface GetLoanByIdResponse {
  loan: Loan;
}

interface CreateLoanResponse {
  createLoan: Loan;
}

interface UpdateLoanResponse {
  updateLoan: Loan;
}

interface ReturnLoanResponse {
  returnLoan: Loan;
}

interface RevertLoanResponse {
  revertLoan: Loan;
}

interface DeleteLoanResponse {
  removeLoan: boolean;
}

@Injectable({ providedIn: 'root' })
export class LoanService {
  private readonly graphql = inject(GraphqlClientService);

  getAll(filters?: {
    status?: LoanStatus;
    clientId?: string;
    gameId?: string;
    includeDeleted?: boolean;
  }): Observable<Loan[]> {
    return this.graphql
      .query<GetAllLoansResponse>(GET_ALL_LOANS, {
        status: filters?.status ?? null,
        clientId: filters?.clientId ?? null,
        gameId: filters?.gameId ?? null,
        includeDeleted: filters?.includeDeleted ?? false,
      })
      .pipe(map((data) => data.loans));
  }

  getById(id: string): Observable<Loan> {
    return this.graphql
      .query<GetLoanByIdResponse>(GET_LOAN_BY_ID, { id })
      .pipe(map((data) => data.loan));
  }

  create(input: CreateLoanInput): Observable<Loan> {
    return this.graphql
      .mutate<CreateLoanResponse>(CREATE_LOAN, { createLoanInput: input })
      .pipe(map((data) => data.createLoan));
  }

  update(input: UpdateLoanInput): Observable<Loan> {
    return this.graphql
      .mutate<UpdateLoanResponse>(UPDATE_LOAN, { updateLoanInput: input })
      .pipe(map((data) => data.updateLoan));
  }

  returnLoan(id: string): Observable<Loan> {
    return this.graphql
      .mutate<ReturnLoanResponse>(RETURN_LOAN, { id })
      .pipe(map((data) => data.returnLoan));
  }

  revertLoan(id: string): Observable<Loan> {
    return this.graphql
      .mutate<RevertLoanResponse>(REVERT_LOAN, { id })
      .pipe(map((data) => data.revertLoan));
  }

  delete(id: string): Observable<boolean> {
    return this.graphql
      .mutate<DeleteLoanResponse>(DELETE_LOAN, { id })
      .pipe(map((data) => data.removeLoan));
  }
}
