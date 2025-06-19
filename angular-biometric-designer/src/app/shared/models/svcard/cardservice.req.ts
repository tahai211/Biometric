import { PageDto } from "../page.dto";
import { formatDate } from 'devextreme/localization';

export class CardServiceReqDto extends PageDto {
    from_date: string = formatDate(new Date(), "yyyy-MM-dd");;
    to_date: string = formatDate(new Date(), "yyyy-MM-dd");;
    status: string = '';
    service_type: string = '';
    unique_id: string = '';
    cust_no: string = '';
    cust_name: string = '';
    product_code: string = '';
    tran_ref: string = '';
}