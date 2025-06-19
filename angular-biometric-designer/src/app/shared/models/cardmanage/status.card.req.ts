import { PageDto } from "../page.dto";
import { formatDate } from 'devextreme/localization';

export class StatusCardReqDto extends PageDto {
    branch_code: string = '';
    card_number: string = '';
    batch_create_num: string = '';
    card_status: string = '';
    from_date: string = formatDate(new Date(), "yyyy-MM-dd");
    to_date: string = formatDate(new Date(), "yyyy-MM-dd");
    client_code: string = '';
    user_name: string = '';
}