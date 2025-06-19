import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface BreadcrumbItem {
  label: string;
  link?: string;
  active?: boolean;
}
export interface ButtonConfig {
  show: boolean;
  text: string;
  onClick?: () => void;
}

export interface BreadcrumbData {
  breadcrumbs: BreadcrumbItem[];
  title: string;
}

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
  private breadcrumbDataSubject = new BehaviorSubject<BreadcrumbData>({
    breadcrumbs: [],
    title: ''
  });
  private buttonConfigSubject = new BehaviorSubject<ButtonConfig>({
    show: false,
    text : '',
    onClick: undefined
  });

  public breadcrumbData$: Observable<BreadcrumbData> = this.breadcrumbDataSubject.asObservable();
  public buttonConfig$: Observable<ButtonConfig> = this.buttonConfigSubject.asObservable();

  /**
   * Set breadcrumb data từ BreadcrumbsComponent
   */
  setBreadcrumbData(data: BreadcrumbData) {
    this.breadcrumbDataSubject.next(data);
  }

  

  setButtonPath(show: boolean = false, text: string = 'TẠO MỚI', onClick?: () => void) {
    this.buttonConfigSubject.next({show,  text, onClick });
  }

  /**
   * Clear breadcrumbs
   */
  clearBreadcrumbs() {
    this.breadcrumbDataSubject.next({
      breadcrumbs: [],
      title: '',
      // showCreateButton: true,
      // createButtonText: 'TẠO MỚI'
    });
  }
  clearButtonConfig() {
    this.buttonConfigSubject.next({ show: false, text: '', onClick: undefined });
  }

  /**
   * Get current breadcrumb data
   */
  getCurrentData(): BreadcrumbData {
    return this.breadcrumbDataSubject.value;
  }
}