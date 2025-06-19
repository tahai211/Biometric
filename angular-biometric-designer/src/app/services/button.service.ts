import { Injectable } from "@angular/core";
import { BehaviorSubject ,Observable, debounceTime, map, distinctUntilChanged} from "rxjs";
import { ButtonByScreenDto, ButtonDto } from "../shared/models/button/button.dto";
import { NavigationEnd, Router } from "@angular/router";
@Injectable({
    providedIn: 'root'
})
export class ButtonService {
    currentpath: string;
    
    constructor(router: Router) {
        router.events.forEach((event) => {
            if (event instanceof NavigationEnd) {
                let url = event.url;

                // Nếu có dấu "-", ưu tiên cắt theo "-"
                if (url.includes("-")) {
                    this.currentpath = url.split("-")[0];
                } 
                // Nếu không có "-", nhưng có "?", cắt theo "?"
                else if (url.includes("?")) {
                    this.currentpath = url.split("?")[0];
                } 
                // Nếu không có cả "-" và "?", giữ nguyên URL
                else {
                    this.currentpath = url;
                }
            }
        });
    }

    public dataButton: BehaviorSubject<ButtonDto[]> = new BehaviorSubject<ButtonDto[]>([]);
    public setDataButton(_dataButton: ButtonDto[]) {
        this.dataButton.next(_dataButton);
    }

    public dataButtonPage: BehaviorSubject<ButtonByScreenDto[]> = new BehaviorSubject<ButtonByScreenDto[]>([]);
    public setDataButtonPage(_dataButtonPage: ButtonByScreenDto[]) {
      this.dataButtonPage.next(_dataButtonPage);
    }

    // Hàm kiểm tra xem có nút Tùy biến trong mảng ButtonDto không
    public hasCreateButton$(role: string): Observable<boolean> {
      // debugger
        return this.dataButton.pipe(
          debounceTime(100), // tránh bị spam nếu set liên tục
          map(data => {
            let result = false;
            if (Array.isArray(data) && data.length > 0) {
              const dataByPath = data.filter((o: any) => o.screenUrl.split("-", 1)[0] === this.currentpath);
              if (Array.isArray(dataByPath) && dataByPath.length > 0) {
                const dataBtn = dataByPath[0].buttons;
                if (Array.isArray(dataBtn) && dataBtn.length > 0) {
                  result = dataBtn.some((o: any) => {
                    const _arrBtn = o.buttonCode.split('.');
                    return _arrBtn[_arrBtn.length - 1].toUpperCase() === role.toUpperCase();
                  });
                }
              }
            }
            return result;
          }),
          distinctUntilChanged() // chỉ emit khi giá trị thực sự thay đổi
        );
      }      
}
