import express, { Router } from "express";
import mongoose, { init } from "model";
const listen_port = process.env.LISTEN_PORT;
const router = Router();

const autoRouter = {
  CREATE: (model: mongoose.Model<any>) => {
    router.put("/", async (req, res) => {
      const single = new model(req.body);
      await single.save();
      return res.status(201).send(single);
    });
  },
  GET: (model: mongoose.Model<any>) => {
    router.get("/:id", async (req, res) => {
      const single = await model.findOne({ _id: req.params.id });
      if (!single) return res.sendStatus(404);
      return res.send(single);
    });
  },
  LIST: (model: mongoose.Model<any>) => {
    router.get("/", async (req, res) => {
      const multiple = await model.find();
      if (!multiple) return res.sendStatus(404);
      return res.send(multiple);
    });
  },
  DELETE: (model: mongoose.Model<any>) => {
    router.delete("/:id", async (req, res) => {
      const single = await model.findOneAndDelete({ _id: req.params.id });
      if (!single) return res.sendStatus(404);
      return res.send(single);
    });
  },
  EDIT: (model: mongoose.Model<any>) => {
    router.post("/:id", async (req, res) => {
      await model.updateOne({ _id: req.params.id }, req.body);
      const single = await model.findOne({ _id: req.params.id });
      return res.send(single);
    });
  },
};

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
