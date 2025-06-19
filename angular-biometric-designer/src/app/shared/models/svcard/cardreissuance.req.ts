import { PageDto } from "../page.dto";

export class CardReissuanceReq extends PageDto {
    tranNo: string = '';
    custNo: string = '';
    auth_stat: string = '';
    action_auth: string = '';
}