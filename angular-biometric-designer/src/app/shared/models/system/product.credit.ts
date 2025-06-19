import { PageDto } from "../page.dto";

export class productCreditReq extends PageDto {
    actionType: string = '';
    isGetAll: boolean = false;
    data: ProductCreditDto = new ProductCreditDto();
}
export class ProductCreditDto {
  id?: string;
  id_trans?: string;
  product_code?: string;
  description?: string;
  auth_stat?: string;
  record_stat!: string;  // required field (non-nullable in C#)
  created_by?: string;
  created_date?: string;
  last_modified_by?: string;
  last_modified_date?: string;
  approved_by?: string;
  approved_date?: string;
}