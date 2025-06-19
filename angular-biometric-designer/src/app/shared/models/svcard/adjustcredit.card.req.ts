import { PageDto } from "../page.dto";

export class AdjustCreditCardReqDto extends PageDto {
    client_code: string = '';
    unique_id_value: string = '';
    full_name: string = '';
    product_code: string = '';
    card_number: string = '';
    account_number: string = '';
}