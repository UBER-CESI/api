import { Router } from "express";
import { Menu } from "model";

const router = Router();

function isHex(num: string): boolean {
  return Boolean(num.match(/^0x[0-9a-f]+$/i));
}
router.put("/", async (req, res) => {
  const item = new Menu(req.body);
  await item.save();
  return res.status(201).send(item);
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
  const item = await Menu.findOne({ _id: req.params.id });
  if (!item) return res.sendStatus(404);
  return res.send(item);
});

router.post("/:id", async (req, res) => {
  await Menu.updateOne({ _id: req.params.id }, req.body);
  const item = await Menu.findOne({ _id: req.params.id });
  return res.send(item);
});

router.delete("/:id", async (req, res) => {
  const item = await Menu.findOneAndDelete({ _id: req.params.id });
  if (!item) return res.sendStatus(404);
  return res.send(item);
});

export default router;
