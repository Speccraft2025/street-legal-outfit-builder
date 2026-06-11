export interface ProductMock {
  id: string;
  supplierId: string;
  basePrice: number;
}

export interface OutfitMock {
  id: string;
  creatorId: string;
  items: ProductMock[];
  commissionRate: number;
}

export class CommerceService {
  // Constant platform delivery fee per unique supplier package
  static readonly DELIVERY_FEE_PER_SUPPLIER = 800; // $8.00 in cents
  
  // Platform processing fee
  static readonly PLATFORM_FEE_RATE = 0.10; // 10%

  /**
   * Phase 4: Build multi-supplier split logic module
   * Computes the final checkout breakdown based on dynamic multi-supplier delivery constraints
   */
  public static calculateCheckout(outfit: OutfitMock) {
    const suppliers = new Set(outfit.items.map(item => item.supplierId));
    
    let baseItemsTotal = 0;
    outfit.items.forEach(item => {
      baseItemsTotal += item.basePrice;
    });

    const totalDeliveryFee = suppliers.size * this.DELIVERY_FEE_PER_SUPPLIER;
    const platformFee = Math.round(baseItemsTotal * this.PLATFORM_FEE_RATE);
    
    const finalTotal = baseItemsTotal + totalDeliveryFee + platformFee;

    return {
      baseItemsTotal,
      totalDeliveryFee,
      platformFee,
      finalTotal,
      supplierCount: suppliers.size
    };
  }

  /**
   * Phase 4: Construct Ledger generation utility
   * Generates immutable double-entry ledger objects after a successful payment
   */
  public static generateLedgerEntries(orderId: string, outfit: OutfitMock, checkoutCompute: any) {
    const entries = [];
    
    // 1. Creator Commission (e.g. 5% of base items total)
    const creatorCommission = Math.round(checkoutCompute.baseItemsTotal * outfit.commissionRate);
    entries.push({
      orderId,
      recipientId: outfit.creatorId,
      amount: creatorCommission,
      type: 'CREATOR_COMMISSION',
      status: 'PENDING'
    });

    // 2. Platform Fee (Platform takes fee minus creator commission)
    const netPlatformFee = checkoutCompute.platformFee - creatorCommission;
    entries.push({
      orderId,
      recipientId: 'PLATFORM',
      amount: netPlatformFee,
      type: 'PLATFORM_FEE',
      status: 'CLEARED'
    });

    // 3. Supplier Payouts (Grouped by Supplier)
    const supplierTotals: Record<string, number> = {};
    outfit.items.forEach(item => {
      supplierTotals[item.supplierId] = (supplierTotals[item.supplierId] || 0) + item.basePrice;
    });

    Object.keys(supplierTotals).forEach(supplierId => {
      entries.push({
        orderId,
        recipientId: supplierId,
        amount: supplierTotals[supplierId],
        type: 'SUPPLIER_PAYOUT',
        status: 'PENDING' // Clears when shipped
      });
    });

    return entries;
  }
}
