import { HttpHeaders } from "@angular/common/http";

export class CONST {
  static API_URL: string = "";
  static API_HELPDESK_URL: string = "";
  static API_OAUTH: string = "";
  static API_OAUTH_REALM: string = "";
  static API_OAUTH_CLIENT_ID: string = "";

  static httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' })
  };
  static paramReportTypes = [
    { id: 'DateTime', name: 'DateTime' },
    { id: 'SQL', name: 'ComBoBox' },
    { id: 'Boolean', name: 'Boolean' },
    { id: 'Text', name: 'Text' }
  ];
  static dataStatus: any[] = [
    //{ id: '', name: 'Tất cả' },
    { id: '1', name: 'Hoạt động' },
    { id: '0', name: 'Dừng hoạt động' }
  ];
  static dataAuthStatus: any[] = [
    //{ id: '', name: 'Tất cả' },
    { id: 'U', name: 'Chưa duyệt' },
    { id: 'A', name: 'Đã duyệt' },
    { id: 'R', name: 'Từ chối' },
    { id: 'C', name: 'Hủy' },
  ];
  static dataCreditAuthStatus: any[] = [
    { id: 'KR', name: 'KSV từ chối' },
    { id: 'KA', name: 'KSV phê duyệt' },
    { id: 'TR', name: 'TTT từ chối' },
    { id: 'TA', name: 'TTT phê duyệt' },
    { id: 'E', name: 'Yêu cầu quá hạn' },
    { id: 'W', name: 'Yêu cầu chờ xử lý' }
  ];
  static dataCreditServices: any[] = [
    { id: 'PT', name: 'Đăng ký thanh toán trực tuyến' },
    { id: 'AD', name: 'Đăng ký trích nợ tự động' }
  ];
  static paramType: any[] = [
    { id: 'MINUTE', name: 'Theo phút' },
    { id: 'PERDAY', name: 'Theo ngày' },
    { id: 'PERWEEK', name: 'Theo tuần' },
    { id: 'PERMONTH', name: 'Theo tháng' },
    { id: 'PERQUARTER', name: 'Theo quý' },
    { id: 'PERYEAR', name: 'Theo năm' }
  ];
  static dataWeek: any[] = [
    { id: '1', name: 'Thứ hai' },
    { id: '2', name: 'Thứ ba' },
    { id: '3', name: 'Thứ tư' },
    { id: '4', name: 'Thứ năm' },
    { id: '5', name: 'Thứ sáu' },
    { id: '6', name: 'Thứ bảy' },
    { id: '7', name: 'Chủ nhật' },
  ];
  static dataMonth: any[] = [
    { id: '1', name: 'Tháng 1' },
    { id: '2', name: 'Tháng 2' },
    { id: '3', name: 'Tháng 3' },
    { id: '4', name: 'Tháng 4' },
    { id: '5', name: 'Tháng 5' },
    { id: '6', name: 'Tháng 6' },
    { id: '7', name: 'Tháng 7' },
    { id: '8', name: 'Tháng 8' },
    { id: '9', name: 'Tháng 9' },
    { id: '10', name: 'Tháng 10' },
    { id: '11', name: 'Tháng 11' },
    { id: '12', name: 'Tháng 12' },
  ];
  static dataDay: any[] = [
    { id: '1', name: '1' },
    { id: '2', name: '2' },
    { id: '3', name: '3' },
    { id: '4', name: '4' },
    { id: '5', name: '5' },
    { id: '6', name: '6' },
    { id: '7', name: '7' },
    { id: '8', name: '8' },
    { id: '9', name: '9' },
    { id: '10', name: '10' },
    { id: '11', name: '11' },
    { id: '12', name: '12' },
    { id: '13', name: '13' },
    { id: '14', name: '14' },
    { id: '15', name: '15' },
    { id: '16', name: '16' },
    { id: '17', name: '17' },
    { id: '18', name: '18' },
    { id: '19', name: '19' },
    { id: '20', name: '20' },
    { id: '21', name: '21' },
    { id: '22', name: '22' },
    { id: '23', name: '23' },
    { id: '24', name: '24' },
    { id: '25', name: '25' },
    { id: '26', name: '26' },
    { id: '27', name: '27' },
    { id: '28', name: '28' },
  ];
  static dataHttpStatusCode: any[] = [
    //{ id: '', name: 'Tất cả' },
    { id: '100', name: '100 - Continue' },
    { id: '101', name: '101 - Switching Protocols' },
    { id: '102', name: '102 - Processing' },
    { id: '103', name: '103 - Early Hints' },
    { id: '200', name: '200 - OK' },
    { id: '201', name: '201 - Created' },
    { id: '202', name: '202 - Accepted' },
    { id: '203', name: '203 - Non-Authoritative Information' },
    { id: '204', name: '204 - No Content' },
    { id: '205', name: '205 - Reset Content' },
    { id: '206', name: '206 - Partial Content' },
    { id: '207', name: '207 - Multi-Status' },
    { id: '208', name: '208 - Already Reported' },
    { id: '226', name: '226 - IM Used (RFC 3229)' },
    { id: '300', name: '300 - Multiple Choices' },
    { id: '301', name: '301 - Moved Permanently' },
    { id: '302', name: '302 - Found' },
    { id: '303', name: '303 - See Other' },
    { id: '304', name: '304 - Not Modified' },
    { id: '305', name: '305 - Use Proxy' },
    { id: '306', name: '306 - Switch Proxy' },
    { id: '307', name: '307 - Temporary Redirect' },
    { id: '308', name: '308 - Permanent Redirect' },
    { id: '400', name: '400 - Bad Request' },
    { id: '401', name: '401 - Unauthorized' },
    { id: '402', name: '402 - Payment Required' },
    { id: '403', name: '403 - Forbidden' },
    { id: '404', name: '404 - Not Found' },
    { id: '405', name: '405 - Method Not Allowed' },
    { id: '406', name: '406 - Not Acceptable' },
    { id: '407', name: '407 - Proxy Authentication Required' },
    { id: '408', name: '408 - Request Timeout' },
    { id: '409', name: '409 - Conflict' },
    { id: '410', name: '410 - Gone' },
    { id: '411', name: '411 - Length Required' },
    { id: '412', name: '412 - Precondition Failed' },
    { id: '413', name: '413 - Payload Too Large' },
    { id: '414', name: '414 - URI Too Long' },
    { id: '415', name: '415 - Unsupported Media Type' },
    { id: '416', name: '416 - Range Not Satisfiable' },
    { id: '417', name: '417 - Expectation Failed' },
    { id: '418', name: '418 - I\'m a teapot' },
    { id: '421', name: '421 - Misdirected Request' },
    { id: '422', name: '422 - Unprocessable Entity' },
    { id: '423', name: '423 - Locked' },
    { id: '424', name: '424 - Failed Dependency' },
    { id: '425', name: '425 - Too Early' },
    { id: '426', name: '426 - Upgrade Required' },
    { id: '428', name: '428 - Precondition Required' },
    { id: '429', name: '429 - Too Many Requests' },
    { id: '431', name: '431 - Request Header Fields Too Large' },
    { id: '451', name: '451 - Unavailable For Legal Reasons' },
    { id: '500', name: '500 - Internal Server Error' },
    { id: '501', name: '501 - Not Implemented' },
    { id: '502', name: '502 - Bad Gateway' },
    { id: '503', name: '503 - Service Unavailable' },
    { id: '504', name: '504 - Gateway Timeout' },
    { id: '505', name: '505 - HTTP Version Not Supported' },
    { id: '506', name: '506 - Variant Also Negotiates' },
    { id: '507', name: '507 - Insufficient Storage' },
    { id: '508', name: '508 - Loop Detected' },
    { id: '510', name: '510 - Not Extended' },
    { id: '511', name: '511 - Network Authentication Required' }
  ];

  static dataHttpMethod: any[] = [
    //{ id: '', name: 'Tất cả' },
    { id: 'GET', name: 'GET' },
    { id: 'PUT', name: 'PUT' },
    { id: 'POST', name: 'POST' },
    { id: 'DELETE', name: 'DELETE' },
    { id: 'HEAD', name: 'HEAD' },
    { id: 'CONNECT', name: 'CONNECT' }
  ];

  static dataSystemId: any[] = [
    //{ id: '', name: 'Tất cả' },
    { id: 'CIMPAPI', name: 'Phát hành thẻ' },
    { id: 'HELPDESK', name: 'Trung tâm hỗ trợ' }
  ];
  static dataCustType: any[] = [
    //{ id: '', name: 'Tất cả' },
    { id: 'I', name: 'Cá nhân' },
    { id: 'S', name: 'Nhân viên' },
    { id: 'C', name: 'Tổ chức' },
  ];
  static dataCardType: any[] = [
    { id: 'TC', name: 'Thẻ chính' },
    { id: 'TP', name: 'Thẻ phụ' },
  ];
  static dataCardClass: any[] = [
    { id: 'STANDARD', name: 'Hạng chuẩn' },
    { id: 'GOLD', name: 'Hạng vàng' },
    { id: 'PLATINUM', name: 'Hạng bạch kim' },
  ];
  static dataFormOfGuarantee: any[] = [
  { id: '0', name: 'Tín chấp' },
  { id: '1',   name: 'Thế chấp' },
];
  static dataReleaseFrom: any[] = [
    { id: 'EVNT0122', name: 'Giữ nguyên số thẻ' },
    { id: 'EVNT6001', name: 'Số thẻ mới' },
  ];

  static dataRecordStat: any[] = [
    { id: 'O', name: 'Mở' },
    { id: 'C', name: 'Đóng' },
  ];

  static dataStatusCardBatch: any[] = [
    //{ id: '', name: 'Tất cả' },
    { id: 'O', name: 'Mở' },
    { id: 'C', name: 'Đóng' }
  ];
  static dataAuthStatusRlos: any[] = [
    //{ id: '', name: 'Tất cả' },
    { id: 'U', name: 'Chờ tạo' },
    { id: 'A', name: 'Đã tạo' },
    { id: 'C', name: 'Đã hủy' }
  ];
  static dataReissuedType: any[] = [
    //{ id: '', name: 'Tất cả' },
    { id: 'I', name: 'Phát hành mới' },
    { id: 'EVNT0122', name: 'Phát hành lại giữ nguyên hạn' },
    { id: 'EVNT6001', name: 'Phát hành lại gia hạn thẻ' }
  ];
  static dataCardStatus: any[] = [
    { id: '200', name: 'Gửi thành công' },
    { id: '202', name: 'Chưa gửi' },
    { id: '201', name: 'Gửi lỗi' }
  ];
}