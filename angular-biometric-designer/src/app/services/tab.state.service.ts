import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TabStateService {
  selectedTabTitle: string = '';
//   paginationStates: { [key: number]: number } = {}; // ví dụ: tabIndex => pageNumber
}