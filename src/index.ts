import * as moduleAlias from 'module-alias';
import logger from './logger';

const sourcePath = 'src';
moduleAlias.addAlias({
  '@server': sourcePath,
  '@config': `${sourcePath}/config`,
  '@domain': `${sourcePath}/domain`,
  '@controller': `${sourcePath}/controller`,
  '@middleware': `${sourcePath}/middleware`,
  '@templates': `${sourcePath}/templates`,
});

import { createServer } from '@config/express';
import { AddressInfo } from 'net';
import http from 'http';

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || '5000';

const startServer = async () => {
  const app = await createServer();
  const server = http.createServer(app).listen({ host, port }, () => {
    const addressInfo = server.address() as AddressInfo;
    logger.info(
      `Server is ready at http://${addressInfo.address}:${addressInfo.port}`,
    );
  });

  const signalTraps: NodeJS.Signals[] = ['SIGTERM', 'SIGINT', 'SIGUSR2'];
  signalTraps.forEach((type) => {
    process.once(type, async () => {
      console.log(`process.once ${type} `);

      server.close(() => {
        console.log('HTTP server closed');
      });
    });
  });
};

startServer();