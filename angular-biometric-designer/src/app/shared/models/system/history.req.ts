import { PageDto } from "../page.dto";
import { formatDate } from 'devextreme/localization';

export class HistoryReqDto extends PageDto {
    from_date: string = formatDate(new Date(), "yyyy-MM-dd");;
    to_date: string = formatDate(new Date(), "yyyy-MM-dd");;
    system_id: string = '';
    request_id: string = '';
    reference_id: string = '';
    http_method: string = '';
    http_status_code: string = '';
    screens_code: string = '';
    action_code: string = '';
}