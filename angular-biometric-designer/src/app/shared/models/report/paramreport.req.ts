import { PageDto } from "../page.dto";

export class ParamReportReq extends PageDto {
    paramCode: string = '';
    paramName: string = '';
}