import { initDBConnection } from './db/initMongoConnection.js';
import { setupServer } from './server.js';

const bootstrap = async () => {
  await initDBConnection();
  setupServer();
};

bootstrap();
