import { Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { GqlExceptionFilter, GqlArgumentsHost } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { ThrottlerException } from '@nestjs/throttler';
import { DomainException } from '../exceptions/domain.exception';

@Catch()
export class GraphqlExceptionFilter implements GqlExceptionFilter {
    private readonly logger = new Logger(GraphqlExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        GqlArgumentsHost.create(host);

        // Domain exceptions (business logic)
        if (exception instanceof DomainException) {
            return new GraphQLError(exception.message, {
                extensions: {
                    code: exception.code,
                    status: exception.statusCode,
                },
            });
        }

        // Rate limiting (ThrottlerException)
        if (exception instanceof ThrottlerException) {
            this.logger.warn(`Rate limit exceeded: ${exception.message}`);
            return new GraphQLError('Too many requests. Please try again later.', {
                extensions: {
                    code: 'TOO_MANY_REQUESTS',
                    status: 429,
                },
            });
        }

        // NestJS HttpExceptions (ValidationPipe, TimeoutException, etc.)
        if (exception instanceof HttpException) {
            const status = exception.getStatus();
            const response = exception.getResponse();
            const message =
                typeof response === 'string'
                    ? response
                    : (response as { message?: string | string[] }).message || exception.message;

            return new GraphQLError(Array.isArray(message) ? message.join(', ') : message, {
                extensions: {
                    code: exception.name.replace('Exception', '').toUpperCase(),
                    status,
                },
            });
        }

        // Unknown errors
        if (exception instanceof Error) {
            this.logger.error(exception.message, exception.stack);
            return new GraphQLError('Internal server error', {
                extensions: { code: 'INTERNAL_SERVER_ERROR', status: 500 },
            });
        }

        this.logger.error('Unknown error', JSON.stringify(exception));
        return new GraphQLError('Internal server error', {
            extensions: { code: 'INTERNAL_SERVER_ERROR', status: 500 },
        });
    }
}