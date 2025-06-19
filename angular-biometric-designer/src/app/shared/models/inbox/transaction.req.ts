import { PageDto } from "../page.dto";

export class TransactionReq extends PageDto {
    type_inbox: string = '0';
    trn_ref_no: string = '';
    description: string = '';
    from_date: string = '';
    to_date: string = '';
}