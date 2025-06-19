import { PageDto } from "../page.dto";

export class RoleReqDto extends PageDto {
    role_code: string = '';
    role_name: string = '';
    status: string = '';
    auth_stat: string = '';
}