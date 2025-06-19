import { PageDto } from "../page.dto";

export class SupportGroupDto extends PageDto {
    id: string = '';
    group_id: string = '';
    group_name: string = '';
    record_stat: string = '';
    auth_stat: string = '';
    created_by: string = '';
    created_date: string = '';
    last_modified_by: string = '';
    last_modified_date: string = '';
    approved_by: string = '';
    approved_date: string = '';
}