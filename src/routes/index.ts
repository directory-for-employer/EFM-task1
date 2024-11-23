import express from "express";
import { ProductController } from "../controllers";

export const routes = express.Router();

routes.post("/create", ProductController.create);
routes.post("/create-shop", ProductController.createShop);
routes.post("/create-remainder", ProductController.createRemainder);
routes.post("/increase-remainder", ProductController.increaseRemainder);
routes.post("/decrease-remainder", ProductController.decreaseRemainder);
routes.post(
  "/find-remainder-by-filter",
  ProductController.findRemainderByfilter,
);
routes.post("/find-product-by-filter", ProductController.findProductByfilter);
routes.post("/find-history-by-filter", ProductController.findHistoryByfilter);
