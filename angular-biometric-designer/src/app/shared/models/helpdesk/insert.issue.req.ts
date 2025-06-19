export class InsertIssueReq {
    issue_name: string = '';
    issue_detail: string = '';
    //user_id: string = '';
    assigned_to: string = '';
    priority: string = '';
    status: string = '';
    version: string = '';
    filename: string = '';
    branch_code: string = '';
    assign_group: string = '';
    issue_type: string = 'F';
    service: string = '';
    approved: string = '0';
    is_send_mail_receiver = 1;
    is_send_mail_group_receive = 1;
    card_no: string = '';
    client_code: string = '';
    txn_qual: string = '0';
    carddp_amt: string = '0';
    banknet_amt: string = '0';
    txn_amt: string = '0';
    device_id: string = '';
    trace_no: string = '';
    fileUploads: File[] = [];
}