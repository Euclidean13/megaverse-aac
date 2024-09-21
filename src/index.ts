import 'reflect-metadata';

import * as dotenv from 'dotenv';
import showBanner from 'node-banner';
import { container } from './_di/inversify.config.js';
import { logger } from './utils/logsHelper.js';
import { InversifyExpressServer } from 'inversify-express-utils';
import express from 'express';
import cors from 'cors';
import * as http from 'http';
import { BuildMegaverseJob } from './infrastructure/queues/bull/jobs/buildMegaverse.job.js';

import './application/megaverse/megaverse.controller.js';

(async () => {
  dotenv.config();

  await showBanner('Megaverse', `🪐🌙`);

  // Initialize job processor
  container.get<BuildMegaverseJob>(BuildMegaverseJob);

  // create server
  const server = new InversifyExpressServer(container);
  server.setConfig((app) => {
    // config for express
    app.use(
      express.urlencoded({
        extended: true,
      }),
    );
    app.use(express.json());
    app.use(
      cors({
        exposedHeaders: ['Authorization'],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
      }),
    );
  });

  const app = server.build();

  // For adding SSL
  // const options = {
  //   key: fs.readFileSync('./certs/key.pem'),
  //   cert: fs.readFileSync('./certs/fullchain.crt'),
  // };

  http
    .createServer({}, app)
    .listen(process.env.PORT ?? 3030, async function () {
      logger.info(
        `[Server] Application running on: ${process.env.HOSTNAME}:${process.env.PORT}`,
      );
    });

  // Handling the unHandledRejection errors
  process.on('unhandledRejection', (error) => {
    logger.info(`[Server] unhandledRejectionError : ${error}`);
  });
})();
