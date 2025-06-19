import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { CONST } from "../shared/const/const";
import { Foo } from "../shared/models/foo";

@Injectable({
    providedIn: 'root'
})
export class CommonService {
    ConvertStringToLocalDate(date: String) {
        try {
            if (date == null || date == '') {
                return '';
            } else {
                const [day, month, year] = date.split('/');
                return (new Date(+year, +month - 1, +day)).toLocaleDateString();
            }
        } catch (err) {
            console.log('ConvertStringToLocalDate: ', err)
            return '';
        }
    }

    ConvertStringToLocalDateTime(datetime: String) {
        try {
            if (datetime == null || datetime == '') {
                return '';
            } else {
                const [dateComponents, timeComponents] = datetime.split(' ');

                const [day, month, year] = dateComponents.split('/');
                const [hours, minutes, seconds] = timeComponents.split(':');
                return (new Date(+year, +month - 1, +day, +hours, +minutes, +seconds)).toLocaleDateString() + ' ' + (new Date(+year, +month - 1, +day, +hours, +minutes, +seconds)).toLocaleTimeString();
            }
        } catch (err) {
            console.log('ConvertStringToLocalDateTime: ', err)
            return '';
        }
    }
    convertToNumber(formattedAmount: string): any {
        if (!isNaN(Number(formattedAmount.replace(/,/g, '')))) {
            const amount = parseFloat(formattedAmount.replace(/,/g, ''));
            return amount;
        } else {
            return formattedAmount;
        }
    }

    getNameById(type: string, id: string): string {
        var response = '';
        switch (type) {
            case 'STATUS':
                const status = CONST.dataStatus.find(o => o.id === id);
                response = status ? status.name : id;
                break;
            case 'AUTH_STATUS':
                const authStat = CONST.dataAuthStatus.find(o => o.id === id);
                response = authStat ? authStat.name : id;
                break;
            case 'CREDIT_AUTH_STATUS':
                const creditAuthStat = CONST.dataCreditAuthStatus.find(o => o.id === id);
                response = creditAuthStat ? creditAuthStat.name : id;
                break;
            case 'AUTH_STATUS_RLOS':
                const authStatRlos = CONST.dataAuthStatusRlos.find(o => o.id === id);
                response = authStatRlos ? authStatRlos.name : id;
                break;
            case 'HTTP_METHOD':
                const httpMethod = CONST.dataHttpMethod.find(o => o.id === id);
                response = httpMethod ? httpMethod.name : id;
                break;
            case 'HTTP_STATUS_CODE':
                const httpStatusCode = CONST.dataHttpStatusCode.find(o => o.id === id);
                response = httpStatusCode ? httpStatusCode.name : id;
                break;
            case 'SYSTEM_ID':
                const systemId = CONST.dataSystemId.find(o => o.id === id);
                response = systemId ? systemId.name : id;
                break;
            case 'CUST_TYPE':
                const cust_type = CONST.dataCustType.find(o => o.id === id);
                response = cust_type ? cust_type.name : id;
                break;
            case 'REISSUED_TYPE':
                const reissued_type = CONST.dataReissuedType.find(o => o.id === id);
                response = reissued_type ? reissued_type.name : id;
                break;
            case 'CARD_STATUS':
                const card_status = CONST.dataCardStatus.find(o => o.id === id);
                response = card_status ? card_status.name : id;
                break;
            case 'PARAM_REPORT_TYPE':
                const param_report = CONST.paramReportTypes.find(o => o.id === id);
                response = param_report ? param_report.name : id;
                break;
            case 'RECORD_STAT':
                const record_stat = CONST.dataRecordStat.find(o => o.id === id);
                response = record_stat ? record_stat.name : id;
                break;
            case 'CARD_TYPE':
                const card_type = CONST.dataCardType.find(o => o.id === id);
                response = card_type ? card_type.name : id;
                break;
            default:
                response = id;
        }
        return response;
    }

    convertToIsoDate(input: string): string {
        const [day, month, year] = input.split('/');

        if (!day || !month || !year) return ''; // trả về rỗng nếu sai định dạng

        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
}