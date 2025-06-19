import { PageDto } from "../page.dto";

export class VerificationReq extends PageDto {
    id_issue: string = '';
    description: string = '';
    from_date: string = '';
    to_date: string = '';
}