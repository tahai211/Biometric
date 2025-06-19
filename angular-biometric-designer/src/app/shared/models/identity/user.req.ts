import { PageDto } from "../page.dto";

export class UserReqDto extends PageDto {
    user_name: string = '';
    full_name: string = '';
    branch_code: string = '';
    role_code: string = '';
    status: string = '';
    auth_stat: string = '';
    isGetAll: boolean = false;
}