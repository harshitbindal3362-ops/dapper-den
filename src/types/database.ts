export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  original_price: number | null;
  stock_quantity: number;
  images: string[];
  colors: string[];
  is_featured: boolean;
  is_new_arrival: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  email: string | null;
  addresses: Address[];
  created_at: string;
  updated_at: string;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  pincode: string;
  is_default?: boolean;
}

export interface Order {
  id: string;
  user_id: string | null;
  items: OrderItem[];
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shipping_address: Address;
  payment_method: string;
  payment_status: string;
  tracking_number: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  product_id: string;
  product_name: string;
  product_image: string;
  quantity: number;
  price: number;
  selected_color?: string;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  selected_color: string | null;
  created_at: string;
  product?: Product;
}

export interface Page {
  id: string;
  slug: string;
  title: string;
  content: string | null;
  is_active: boolean;
  updated_at: string;
}

export interface SiteSetting {
  id: string;
  key: string;
  value: any;
  updated_at: string;
}
