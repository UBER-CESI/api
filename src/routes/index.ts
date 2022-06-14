import express, { Router } from "express";
import { init, models } from "model";
import mongoose from "mongoose";
const listen_port = process.env.LISTEN_PORT;
const router = Router();

function isHex(num: string): boolean {
  return Boolean(num.match(/^0x[0-9a-f]+$/i));
}

router.use("/:id", (req, res, next) => {
  if (isHex(req.params.id)) return res.sendStatus(400);
  if (req.body._id) return res.sendStatus(400);
  next();
});

router.use("/:id/*", (req, res, next) => {
  if (isHex(req.params.id)) return res.sendStatus(400);
  if (req.body._id) return res.sendStatus(400);
  next();
});

const autoRouter: { [key: string]: (model: mongoose.Model<any>) => void } = {
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
  SUSPEND: (model: mongoose.Model<any>) => {
    router.post("/:id/suspend", async (req, res) => {
      const single = await model.findOne({ _id: req.params.id });
      if (!single) return res.sendStatus(404);
      single.suspendedAt = new Date();
      await single.save();
      return res.send(single);
    });
  },
};

models.forEach(({ model, capabilities }) => {
  capabilities.forEach((cap) => {
    autoRouter[cap]?.(model);
  });
});

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
