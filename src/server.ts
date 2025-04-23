import { buildApp } from './app';
import { environment } from './config/environment';

async function startServer() {
  const app = await buildApp();

  try {
    const address = await app.listen({ 
      port: environment.port,
      host: '0.0.0.0'
    });
    app.log.info(`Server listening at ${address}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

startServer();