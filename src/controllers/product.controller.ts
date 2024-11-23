import {Request, Response} from "express";
import {prisma} from "../../prisma/prisma-client";
import {TypedRequestBody} from "../utils/utils";
import {IProduct, IRemainder} from "../interface/product.interface";


class ProductController  {
    // Создание товара
    async create (req: TypedRequestBody<IProduct>, res: Response)  {
        const {plu, name, shop_id} = req.body

        if(!plu || !name){
            res.status(400).json({error: 'Поля plu и name обязательные'})
        }

        const existProduct = await prisma.product.findFirst({where:{name: {equals: name}}}).catch((err) => console.log(err))

        if(!existProduct){
            const data = await prisma.product.create({
                data:{
                    plu,
                    name,
                    shop_id
                }
            })
            return res.status(200).json({...data, message:'Товар создан'})
        }

        return res.status(400).json({...existProduct, message: 'Товар уже есть'})
    }

    // Создание остатка
    async createRemainder (req:TypedRequestBody<IRemainder>, res:Response) {
        const {id, plu, name, quantity_shelf} = req.body

        if(!plu && !name && !id){
            res.status(400).json({error: 'Не указаны ни одного обязательной константы'})
        }

        const existProduct = await prisma.product.findFirst({where:{name: {equals: name}}}).catch((err) => console.log(err))

        if(!existProduct){
            const data = await prisma.product.update({
                where: {
                    id
                },
                data:{
                    quantity_shelf: +quantity_shelf
                }
            })
            return res.status(200).json({...data, message:'Товар создан'})
        }

        return res.status(400).json({...existProduct, message: 'Товар уже есть'})
    }

    // Увеличение остатка
    async increaseRemainder (req:Request, res:Response) {
        res.send('increaseRemainder')
    }

    // Уменьшение остатка
    async decreaseRemainder (req:Request, res:Response) {
        res.send('decreaseRemainder')
    }

    // Получение остатков по фильтрам
    async findRemainderByfilter (req:Request, res:Response) {
        res.send('findRemainderByfilter')
    }

    // Получение товаров по фильтрам
    async findProductByfilter (req:Request, res:Response) {
        res.send('findProductByfilter')
    }
}

export default new ProductController