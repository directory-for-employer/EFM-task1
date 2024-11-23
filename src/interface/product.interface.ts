export interface IProduct {
  shop_id?: number;
  plu: string;
  name: string;
  quantity_shelf?: number;
  quantity_order?: number;
}

export interface ICreateShop {
  name: string;
}

export interface IRemainder {
  quantity_id: number;
  shop_id?: number;
  product_id?: number;
  plu?: string;
  quantity_shelf?: number;
  quantity_order?: number;
}

export interface IFindProduct {
  plu: string;
  name: string;
}
export interface IFindHistory {
  shop_id: number;
  date: Date;
  action: string;
}
