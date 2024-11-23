import { Response } from "express";
import { prisma } from "../../prisma/prisma-client";
import { TypedRequestBody } from "../utils/utils";
import {
  ICreateShop,
  IFindProduct,
  IProduct,
  IRemainder,
} from "../interface/product.interface";

class ProductController {
  // Создание магазина
  async createShop(req: TypedRequestBody<ICreateShop>, res: Response) {
    const { name } = req.body;

    let existShop = await prisma.shop.findFirst({
      where: {
        name,
      },
    });
    if (existShop) {
      res.status(400).json({ message: "Магазин с таким именем был создан" });
    }
    const shopData = await prisma.shop.create({
      data: {
        name,
      },
    });
    res.status(200).json({ ...shopData, message: "Магазин создан" });
  }

  // Создание товара
  async create(req: TypedRequestBody<IProduct>, res: Response) {
    const { plu, name } = req.body;

    if (!plu || !name) {
      res.status(400).json({ error: "Поля plu и name обязательные" });
    }

    const existProduct = await prisma.product
      .findFirst({ where: { plu: { equals: plu } } })
      .catch((err) => console.log(err));

    if (!existProduct) {
      const data = await prisma.product.create({
        data: {
          plu,
          name,
        },
      });
      return res.status(200).json({ ...data, message: "Товар создан" });
    }

    return res.status(400).json({ ...existProduct, message: "Товар уже есть" });
  }

  // Создание остатка
  async createRemainder(req: TypedRequestBody<IRemainder>, res: Response) {
    const { product_id, shop_id } = req.body;

    if (!product_id || !shop_id) {
      res
        .status(400)
        .json({ error: "Не указаны ни одного обязательной константы" });
    }

    const existRemainder = await prisma.quantity
      .findFirst({ where: { shop_id, product_id } })
      .catch((err) => console.log(err));
    console.log(!existRemainder);

    if (!existRemainder) {
      const data = await prisma.quantity.create({
        data: {
          shop: {
            connect: {
              id: shop_id,
            },
          },
          product: {
            connect: {
              id: product_id,
            },
          },
        },
      });
      return res.status(200).json({ ...data, message: "Остаток Добавлен" });
    }
    return res.status(400).json({ message: "Остаток был создан" });
  }

  // Увеличение остатка
  async increaseRemainder(req: TypedRequestBody<IRemainder>, res: Response) {
    const { quantity_id, quantity_shelf, quantity_order } = req.body;

    if (!quantity_id || (!quantity_shelf && !quantity_order)) {
      res
        .status(400)
        .json({ error: "Не указаны ни одного обязательной константы" });
    }

    const existQuantity = await prisma.quantity
      .findFirst({ where: { id: quantity_id } })
      .catch((err) => console.log(err));

    if (!existQuantity) {
      return res.status(400).json({ message: "Остаток не найден" });
    }
    if (quantity_shelf) {
      const data = await prisma.quantity.update({
        where: { id: quantity_id },
        data: {
          quantity_shelf: { increment: quantity_shelf },
        },
      });

      return res.status(200).json({ ...data, message: "Остаток обновлен" });
    }
    if (quantity_order) {
      const data = await prisma.quantity.update({
        where: { id: quantity_id },
        data: {
          quantity_order: { increment: quantity_order },
        },
      });

      return res.status(200).json({ ...data, message: "Остаток обновлен" });
    }
    // res.send('increaseRemainder')
  }

  // Уменьшение остатка
  async decreaseRemainder(req: TypedRequestBody<IRemainder>, res: Response) {
    const { quantity_id, quantity_shelf, quantity_order } = req.body;

    if (!quantity_id || (!quantity_shelf && !quantity_order)) {
      res
        .status(400)
        .json({ error: "Не указаны ни одного обязательной константы" });
    }

    const existQuantity = await prisma.quantity
      .findFirst({ where: { id: quantity_id } })
      .catch((err) => console.log(err));

    if (!existQuantity) {
      return res.status(400).json({ message: "Остаток не найден" });
    }

    if (
      0 >= existQuantity.quantity_shelf ||
      0 >= existQuantity.quantity_order
    ) {
      return res.status(400).json({ message: "Остаток равен нулю" });
    }
    if (quantity_shelf) {
      const data = await prisma.quantity.update({
        where: { id: quantity_id },
        data: {
          quantity_shelf: { decrement: quantity_shelf },
        },
      });

      return res.status(200).json({ ...data, message: "Остаток обновлен" });
    }
    if (quantity_order) {
      const data = await prisma.quantity.update({
        where: { id: quantity_id },
        data: {
          quantity_order: { decrement: quantity_order },
        },
      });

      return res.status(200).json({ ...data, message: "Остаток обновлен" });
    }
  }

  // Получение остатков по фильтрам
  async findRemainderByfilter(
    req: TypedRequestBody<IRemainder>,
    res: Response,
  ) {
    const { plu, shop_id, quantity_shelf, quantity_order } = req.body;

    if (!plu && !shop_id && !quantity_shelf && !quantity_order) {
      res
        .status(400)
        .json({ error: "Не указаны ни одного обязательной константы" });
    }
    if (plu) {
      const data = await prisma.product.findMany({
        where: {
          plu: { search: plu },
        },
        select: {
          quantity: true,
        },
      });
      return res
        .status(200)
        .json({ ...data, message: "создание прошло успешно" });
    }
    if (shop_id) {
      const data = await prisma.quantity.findMany({
        where: {
          shop_id,
        },
      });
      return res
        .status(200)
        .json({ ...data, message: "создание прошло успешно" });
    }
    if (quantity_shelf) {
      const data = await prisma.quantity.findMany({
        where: {
          quantity_shelf: { equals: quantity_shelf },
        },
      });
      return res
        .status(200)
        .json({ ...data, message: "создание прошло успешно" });
    }
    if (quantity_order) {
      const data = await prisma.quantity.findMany({
        where: {
          quantity_order: { equals: quantity_order },
        },
      });
      return res
        .status(200)
        .json({ ...data, message: "создание прошло успешно" });
    }
  }

  // Получение товаров по фильтрам
  async findProductByfilter(
    req: TypedRequestBody<IFindProduct>,
    res: Response,
  ) {
    const { plu, name } = req.body;
    if (!plu && !name) {
      return res
        .status(400)
        .json({ error: "Не указаны ни одного обязательной константы" });
    }
    if (plu) {
      let data = await prisma.product.findMany({
        where: {
          plu: {
            search: plu,
          },
        },
      });
      return res.status(200).json(data);
    }
    if (name) {
      let data = await prisma.product.findMany({
        where: {
          name: {
            search: name,
          },
        },
      });
      return res.status(200).json(data);
    }
    // res.send("findProductByfilter");
  }
}

export default new ProductController();
