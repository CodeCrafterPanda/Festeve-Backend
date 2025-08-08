export interface ProductDto {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  variants: ProductVariantDto[];
  isHotItem: boolean;
}

export interface ProductVariantDto {
  id: string;
  price: number;
  stock: number;
  isActive: boolean;
}

export interface CategoryDto {
  id: string;
  name: string;
  slug: string;
  image?: string;
}

export interface VendorDto {
  id: string;
  name: string;
  averageRating: number;
  productIds: string[];
}

export interface StockReservationDto {
  productId: string;
  variantId: string;
  quantity: number;
}

export interface StockReservationResponseDto {
  success: boolean;
  reserved: boolean;
  error?: string;
}