import { PageDto } from "../page.dto";

export class CardUserInfoReqDto extends PageDto {
    card_number: string = '';
    legal_id: string = '';
    client_code: string = '';
    user_name: string = '';
    card_status: string = '';
}