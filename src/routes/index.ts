import express, { Router } from "express";
import { init} from "model";
const listen_port = process.env.LISTEN_PORT;
const router = Router();

const app = express();

app.use(express.json());
app.use("/", router);
const server = app.listen(listen_port, () => {
  console.log(`App listening on port ${listen_port}`);
});

export default {
  async spawn() {},
  stop() {
    server.close();
    init.then((e) => e.close());
  },
};
