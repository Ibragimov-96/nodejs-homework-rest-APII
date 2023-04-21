const { connectMongo } = require("./db/conection");

const app = require("./app");

app.listen(3000, async () => {
  await connectMongo();
});
