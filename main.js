const app = require('./server/server');
const logger = require('./server/middlewares/logger');
const mongo = require('./server/data/db');

const port = process.env.PORT || 8888;
if (Number(process.version.slice(1).split('.')[0]) < 10) throw new Error('Node 10.0.0 or higher is required. Update your Node');

const main = async () => {
  await mongo.main();
  /*
  before uncommenting, add your database and collections to the mongo class in ./server/data/db
  app.locals.collection = collection;
  */
  app.listen(port, () => {
    logger.ready(`Listening: http://localhost:${port}`);
  });
};

main();
