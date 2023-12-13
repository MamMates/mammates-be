import 'dotenv/config';
import { app, startServer } from './pkg/index.js';
import injectApp from './routes/index.js';
// import { initialMigrate } from './models/index.js';

// await initialMigrate();

const injectedApp = injectApp(app);
startServer(injectedApp);
