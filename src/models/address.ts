export default interface Address {
  id: number;
  customerId: number;
  label: string;
  recipientName: string;
  phone: string;
  province: string;
  city: string;
  street: string;
  postalCode?: string;
  isDefault?: boolean;
}

export type AddressInput = Omit<Address, "id" | "customerId">;

export type OrderAddress = {
  label?: string;
  recipientName: string;
  phone: string;
  province: string;
  city: string;
  street: string;
  postalCode?: string;
};
