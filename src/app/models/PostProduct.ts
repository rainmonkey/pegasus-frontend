import { ProductIdQty } from './ProductIdQty'

export class PostProduct {
  OrgId: number;
  ApplyStaffId: number;
  ApplyReason: string;
  ProductIdQty: Array<ProductIdQty>;
  constructor(OrgId: number, ApplyStaffId: number, ApplyReason: string, ProductIdQty: Array<ProductIdQty>) {
   this.OrgId = OrgId;
   this.ApplyStaffId = ApplyStaffId;
   this.ApplyReason = ApplyReason;
   this.ProductIdQty = ProductIdQty;
  }
}