import errorHandler from '@middleware/errorHandler';
import express from 'express';
import cors from 'cors';
import swaggerUI from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import invoicesRouter from '@controller/invoices/invoices.router';
import offeringRouter from '@controller/offerings/offerings.router';
import termTypesRouter from '@controller/termtypes/termtypes.router';
import clientsRouter from '@controller/clients/clients.router';

const createServer = (): express.Application => {
  const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'invoice-service',
        version: '0.1.0',
        description: 'An API service that manages invoices'
      },
      servers: [{
        url: 'http://localhost:5000'
      }],
    },
    apis: [`${process.cwd()}/src/controller/**/*.router.ts`]
  };

  const specs = swaggerJsDoc(options);

  const app = express();

  app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs))

  app.use(express.urlencoded({ extended: true }));
  
  app.use(cors());
  app.use(express.json());

  app.disable('x-powered-by');

  app.get('/health', (_req, res) => {
    res.send('UP');
  });

  app.use('/invoices', invoicesRouter);
  app.use('/offerings', offeringRouter);
  app.use('/term-types', termTypesRouter);
  app.use('/clients', clientsRouter);

  app.use(errorHandler);

  return app;
}

export { createServer };