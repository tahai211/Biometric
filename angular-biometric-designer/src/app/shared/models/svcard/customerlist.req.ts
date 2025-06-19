import { PageDto } from "../page.dto";

export class CustomerListReq extends PageDto {
    isFistLoad: string = '0';
    cifNo: string = '';
    cifName: string = '';
    uniqueId: string = '';
    limitRecord: string = '';
}