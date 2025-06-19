import { PageDto } from "../page.dto";

export class CusInfoReq extends PageDto {
    card_number: string ='';
    client_code: string = '';
    name: string = '';
    account_num: string = '';
    legal_id: string = '';
}