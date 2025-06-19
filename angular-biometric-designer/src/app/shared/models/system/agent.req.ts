import { PageDto } from "../page.dto";

export class AgentReqDto extends PageDto {
    branch_code: string = '';
    agent_code: string = '';
    agent_name: string = '';
    status: string = '';
    auth_stat: string = '';
    address: string = '';
    isGetAll: boolean = false;
}