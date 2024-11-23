export interface IProduct {
    shop_id?: number
    plu: number
    name: string
    quantity_shelf?: number
    quantity_order?: number
}


export interface IRemainder {
    id: number
    plu?: number
    name?: string
    quantity_shelf?: number
    quantity_order?: number
}