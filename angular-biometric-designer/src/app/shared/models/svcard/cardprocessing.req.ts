import { PageDto } from "../page.dto";
import { formatDate } from 'devextreme/localization';

export class CardProcessingReqDto extends PageDto {
    from_date: string = formatDate(new Date(), "yyyy-MM-dd");;
    to_date: string = formatDate(new Date(), "yyyy-MM-dd");;
    card_id: string = '';
    auth_stat: string = '';
    unique_id_value: string = '';
    reissued_type: string = '';
    agent_code: string = '';
}