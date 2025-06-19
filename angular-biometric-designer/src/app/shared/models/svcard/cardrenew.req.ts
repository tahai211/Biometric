import { PageDto } from "../page.dto";
import { formatDate } from 'devextreme/localization';

export class CardReNewReqDto extends PageDto {
    from_date: string = formatDate(new Date(), "yyyy-MM-dd");;
    to_date: string = formatDate(new Date(), "yyyy-MM-dd");;
    cust_no: string = '';
    cust_name: string = '';
}