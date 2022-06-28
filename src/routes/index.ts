import express, { NextFunction, Request, Response, Router } from "express";
import { init, models } from "../model";
import mongoose from "mongoose";
const listen_port = process.env.LISTEN_PORT;
const app = express();
app.use(express.json());
function validateId(req: Request, res: Response, next: NextFunction) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).send("given id is not a valid ObjectId");
  return next()
}

const autoRouter: {
  [key: string]: (model: mongoose.Model<any>, router: Router) => void;
} = {
  CREATE: (model: mongoose.Model<any>, _router: Router) => {
    _router.put("/", async (req, res) => {
      const single = new model(req.body);
      await single.save();
      return res.status(201).send(single);
    });
  },
  GET: (model: mongoose.Model<any>, _router: Router) => {
    _router.get("/:id", async (req, res) => {
      const single = await model.findOne({ _id: req.params.id });
      if (!single) return res.sendStatus(404);
      return res.send(single);
    });
  },
  LIST: (model: mongoose.Model<any>, _router: Router) => {
    _router.get("/", async (req, res) => {
      const search: any = {};
      if (req.query.byUid) {
        search.userId = req.query.byUid;
      }
      if (req.query.byRestaurantId) {
        search.restaurantId = req.query.byRestaurantId;
      }
      if (req.query.byDelivererId) {
        search.delivererId = req.query.byDelivererId;
      }
      if (req.query.byCustomerId) {
        search.customerId = req.query.byCustomerId;
      }
      const multiple = await model.find(search);
      if (!multiple) return res.sendStatus(404);
      return res.send(multiple);
    });
  },
  DELETE: (model: mongoose.Model<any>, _router: Router) => {
    _router.delete("/:id", async (req, res) => {
      ;
      const single = await model.findOneAndDelete({ _id: req.params.id });
      if (!single) return res.sendStatus(404);
      return res.send(single);
    });
  },
  EDIT: (model: mongoose.Model<any>, _router: Router) => {
    _router.post("/:id", async (req, res) => {
      await model.updateOne({ _id: req.params.id }, req.body);
      const single = await model.findOne({ _id: req.params.id });
      return res.send(single);
    });
  },
  SUSPEND: (model: mongoose.Model<any>, _router: Router) => {
    _router.post("/:id/suspend", async (req, res) => {
      const single = await model.findOne({ _id: req.params.id });
      if (!single) return res.sendStatus(404);
      single.suspendedAt = new Date();
      await single.save();
      return res.send(single);
    });
  },
};

models.forEach(({ model, capabilities, path, extraCapabilities }) => {
  const router2 = Router();
  router2.use("/:id", validateId);
  router2.use("/:id/*", validateId);
  capabilities.forEach((cap) => {
    autoRouter[cap]?.(model, router2);
  });
  extraCapabilities.forEach((cap) => cap(router2));
  app.use(path, router2);
});

const server = app.listen(listen_port, () => {
  console.log(`App listening on port ${listen_port}`);
});

export default {
  async spawn() { },
  stop() {
    server.close();
    init.then((e) => e.close());
  },
};
