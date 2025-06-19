import { formatDate } from "devextreme/localization";
import { PageDto } from "../page.dto";

export class ReviewListReqDto extends PageDto {
    keyword: string = '';
    client_code: string = '';
    account_no: string = '';
    card_number: string = '';
    issue_id: string = '';
    service_code: string = '';
    priority_id: string = '';
    status_id: string = '';
    notin_status: string = '';
    assigned: string = '';
    group_assign: string = '';
    to_date: string = '';
    from_date: string = '';
    user_id = ''
}