import { PageDto } from "../page.dto";
import { formatDate } from 'devextreme/localization';

export class TransactionNewReq extends PageDto {
    card_number: string = '';
    from_date: string = formatDate(new Date(), "yyyy-MM-dd");
    to_date: string = formatDate(new Date(), "yyyy-MM-dd");
}