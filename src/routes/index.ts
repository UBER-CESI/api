import express, { Router } from "express";
import { init, Customer } from "model";
const listen_port = process.env.LISTEN_PORT;
const router = Router();

function isHex(num: string): boolean {
  return Boolean(num.match(/^0x[0-9a-f]+$/i));
}

router.put("/register", async (req, res) => {
  const customer = new Customer(req.body);
  await customer.save();
  return res.status(201).send(customer);
});

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

router.get("/:id", async (req, res) => {
  const customer = await Customer.findOne({ _id: req.params.id });
  if (!customer) return res.sendStatus(404);
  return res.send(customer);
});

router.post("/:id", async (req, res) => {
  await Customer.updateOne({ _id: req.params.id }, req.body);
  const customer = await Customer.findOne({ _id: req.params.id });
  return res.send(customer);
});

router.delete("/:id", async (req, res) => {
  const customer = await Customer.findOneAndDelete({ _id: req.params.id });
  if (!customer) return res.sendStatus(404);
  return res.send(customer);
});

router.post("/:id/suspend", async (req, res) => {
  const customer = await Customer.findOne({ _id: req.params.id });
  if (!customer) return res.sendStatus(404);
  customer.suspendedAt = new Date();
  await customer.save();
  return res.send(customer);
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
