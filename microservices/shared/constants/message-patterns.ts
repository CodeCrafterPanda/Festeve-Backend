// Message patterns for microservice communication

// User Service
export const USER_PATTERNS = {
  VALIDATE_TOKEN: 'user.validate_token',
  GET_USER: 'user.get_user',
  CREATE_USER: 'user.create_user',
  UPDATE_USER: 'user.update_user',
  APPLY_REFERRAL: 'user.apply_referral',
} as const;

// Wallet Service
export const WALLET_PATTERNS = {
  GET_BALANCE: 'wallet.get_balance',
  ADD_CREDIT: 'wallet.add_credit',
  DEBIT_AMOUNT: 'wallet.debit_amount',
  GET_TRANSACTIONS: 'wallet.get_transactions',
} as const;

// Catalog Service
export const CATALOG_PATTERNS = {
  GET_PRODUCT: 'catalog.get_product',
  GET_PRODUCTS: 'catalog.get_products',
  GET_CATEGORY: 'catalog.get_category',
  GET_VENDOR: 'catalog.get_vendor',
  RESERVE_STOCK: 'catalog.reserve_stock',
  RELEASE_STOCK: 'catalog.release_stock',
} as const;

// Order Service
export const ORDER_PATTERNS = {
  CREATE_ORDER: 'order.create_order',
  GET_ORDER: 'order.get_order',
  UPDATE_ORDER_STATUS: 'order.update_status',
  CANCEL_ORDER: 'order.cancel_order',
} as const;

// Event Service
export const EVENT_PATTERNS = {
  GET_EVENT: 'event.get_event',
  GET_EVENTS: 'event.get_events',
  GET_PUROHIT: 'event.get_purohit',
  GET_PUROHITS: 'event.get_purohits',
} as const;

// Booking Service
export const BOOKING_PATTERNS = {
  CREATE_BOOKING: 'booking.create_booking',
  GET_BOOKING: 'booking.get_booking',
  UPDATE_BOOKING_STATUS: 'booking.update_status',
  CANCEL_BOOKING: 'booking.cancel_booking',
} as const;