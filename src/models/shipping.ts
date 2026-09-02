export default interface ShippingMethod {
  id: number;
  /** stable key: pickup | post | tipax | courier */
  key: string;
  title: string;
  description: string;
  /** base fee in toman */
  fee: number;
  /** free shipping when goods total (after discount) reaches this */
  freeAbove?: number;
  active: boolean;
  requiresAddress: boolean;
}
