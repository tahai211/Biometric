import { PageDto } from "../page.dto";

export class CardOfCtmReq extends PageDto {
    isFistLoad: string = '0';
    isChangeAccount: boolean = false;
    cardNo: string = '';
    customerId: string = '';
    accountNo: string = '';
    identityNo: string = '';
    customerName: string = '';
    product_code: string = '';
    card_type : string = '';
}