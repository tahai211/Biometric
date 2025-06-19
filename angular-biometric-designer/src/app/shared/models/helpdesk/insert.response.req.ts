export class InsertResponseReq {
    issue_id: string = '';
    response_detail: string = '';
    assigned_to: string = '';
    priority: string = '';
    status: string = '';
    branch_code: string = '';
    assign_group: string = '';
    txn_qualtity: string = '0';
    txn_amount: string = '0';
    filename: string = '';
    issue_name: string = '';
    is_send_mail_receiver = 1;
    is_send_mail_group_receive = 1;
    card_number: string = '';
    client_id: string = '';
    client_type: string = '';
    fileUploads: File[] = [];
}