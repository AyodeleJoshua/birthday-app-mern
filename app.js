const createServer = require("./utils/server");

const { port } = require("./utils/getEnvironmentVariables");
const dbConnection = require("./utils/dbConnection");

const app = createServer();

dbConnection(() => {
  return app.listen(port, () => {
    console.log(`Birthday app listening on port ${port}`);
  });
});
