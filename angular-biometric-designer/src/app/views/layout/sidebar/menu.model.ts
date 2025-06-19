
export interface MenuItem {
  id?: number;
  label?: string;
  icon?: string;
  link?: string;
  expanded?: boolean;
  isTitle?: boolean;
  badge?: any;
  parentId?: number;
  subItems?: any;
  pageList?: any;
}
