import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    private readonly logger = new Logger('HTTP');

    use(req: Request, res: Response, next: NextFunction): void {
        const { method, ip } = req;
        const url = req.path; // Logs pathname only, excludes query string
        const userAgent = req.get('user-agent') || '-';
        const startTime = Date.now();

        res.on('finish', () => {
            const { statusCode } = res;
            const contentLength = res.get('content-length') || '0';
            const duration = Date.now() - startTime;

            const logMessage = `${method} ${url} ${statusCode} ${contentLength}b - ${duration}ms - ${ip} - ${userAgent}`;

            if (statusCode >= 500) {
                this.logger.error(logMessage);
            } else if (statusCode >= 400) {
                this.logger.warn(logMessage);
            } else {
                this.logger.log(logMessage);
            }
        });

        next();
    }
}