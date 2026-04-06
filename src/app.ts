import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import createHttpError from 'http-errors';
import router from './router';
import loggerService from './services/logger.service';
const app = express();
app.disable("x-powered-by")
app.use(cors());
app.get('/', (req, res) => {
    res.send('API is running');
});
app.get('/favicon.ico', (req, res) => {
    res.status(204).end(); // no content
});
app.locals.HEALTH_CHECK_ENABLED = true;
app.get("/health", (_, res) => {
    if (app.locals.HEALTH_CHECK_ENABLED) {
        res.end("OK\n");
        return;
    }
    res.status(503).end("Server shutting down!");
})
app.use(express.json());
app.use('*', router);
app.use((req: Request, res: Response) => {
    res.status(400).send({
        error: {
            status: 400,
            message: "Invalid Request"
        }
    });
});
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    loggerService.error({ message: err.message, path: req.path }).flush();
    const status = err.status || 500;
    res.status(status).send({
        error: {
            status,
            message: err.message || "Internal Error",
        }
    });
});
export default app;
