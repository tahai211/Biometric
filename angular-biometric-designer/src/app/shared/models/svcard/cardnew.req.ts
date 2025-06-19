import { PageDto } from "../page.dto";
import { formatDate } from 'devextreme/localization';

export class CardNewReqDto extends PageDto {
    from_date: string = formatDate(new Date(), "yyyy-MM-dd");;
    to_date: string = formatDate(new Date(), "yyyy-MM-dd");;
    reference_no: string = '';
    cust_no: string = '';
    cust_name: string = '';
    auth_stat: string = '';
}