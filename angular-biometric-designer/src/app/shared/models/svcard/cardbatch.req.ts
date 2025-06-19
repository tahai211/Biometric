import { formatDate } from 'devextreme/localization';
import { PageDto } from "../page.dto";

export class cardBatchReqDto extends PageDto{
    batchNo: string = '';
    branchCode: string = '';
    status: string ='';
    cardNo: string = '';
    createBy: string = '';
    fromDate: string = formatDate(new Date(), "yyyy-MM-dd");
     endDate: string = formatDate(new Date(), "yyyy-MM-dd");

    constructor(batchNo?: string, branchCode?: string) {
        super();  // Nếu PageDto có constructor, gọi nó ở đây
        if (batchNo) {
          this.batchNo = batchNo;
        }
        if (branchCode) {
          this.branchCode = branchCode;
        }
      }
}