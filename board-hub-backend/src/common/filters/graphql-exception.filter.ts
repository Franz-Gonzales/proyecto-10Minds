import { Catch, ArgumentsHost } from '@nestjs/common';
import { GqlExceptionFilter, GqlArgumentsHost } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { DomainException } from '../exceptions/domain.exception';

@Catch()
export class GraphqlExceptionFilter implements GqlExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        GqlArgumentsHost.create(host);

        if (exception instanceof DomainException) {
            return new GraphQLError(exception.message, {
                extensions: {
                    code: exception.code,
                    status: exception.statusCode,
                },
            });
        }

        if (exception instanceof Error) {
            return new GraphQLError(exception.message, {
                extensions: { code: 'INTERNAL_SERVER_ERROR', status: 500 },
            });
        }

        return new GraphQLError('Internal server error', {
            extensions: { code: 'INTERNAL_SERVER_ERROR', status: 500 },
        });
    }
}