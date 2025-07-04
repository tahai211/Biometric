export class AdjustCreditDetailDto {
    loan_account: string = '';
    transaction_date: string = '';
    transaction_number: string = '';
    transaction_status: string = '';
    form_guarantee: string = '';
    effective_date: string = '';
    expiration_date: string = '';
    cust_no: string = '';
    cust_name: string = '';
    cust_type: string = '';
    unique_id_value: string = '';
    unique_id_start_date: string = '';
    unique_id_expiry_date: string = '';
    old_limit: number;
    new_limit: number;
    auto_debit_account: string = '';
    debit_account_name: string = '';
    main_card_no: string = '';
    main_card_limit: number;
    sub_card_no_1: string = '';
    sub_card_limit_1: number;
    sub_card_no_2: string = '';
    sub_card_limit_2: number;
    sub_card_no_3: string = '';
    sub_card_limit_3: number;
    product_code: string = '';
    auth_id: string = '';
    description: string = '';
}