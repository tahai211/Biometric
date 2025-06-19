import { PageDto } from "../page.dto";

export class ParamReqDto extends PageDto {
    param_code: string = '';
    param_name: string = '';
    param_type: string = '';
}