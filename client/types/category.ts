export interface CategoryFilterOption {
  name: string;
  type: 'range' | 'checkbox' | 'radio' | 'color' | 'size';
  options?: string[];
  min?: number;
  max?: number;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  parent?: Category | string;
  level: number;
  isActive: boolean;
  order: number;
  filters?: CategoryFilterOption[];
  productCount?: number;
  children?: Category[];
}
