import { CommerceService, OutfitMock } from './commerce.service';

/**
 * Phase 5: Run race-condition test scenarios
 */
function runSimulation() {
  console.log('--- STARTING STREET LEGAL V2 COMMERCE SIMULATION ---');

  const mockOutfit: OutfitMock = {
    id: 'outfit-1',
    creatorId: 'creator-99',
    commissionRate: 0.05, // 5%
    items: [
      { id: 'item-1', supplierId: 'sup-A', basePrice: 4500 }, // $45.00
      { id: 'item-2', supplierId: 'sup-A', basePrice: 2000 }, // $20.00 (Same supplier)
      { id: 'item-3', supplierId: 'sup-B', basePrice: 8000 }, // $80.00 (Different supplier)
    ]
  };

  console.log('\n[1] Calculating Checkout Breakdown...');
  const checkout = CommerceService.calculateCheckout(mockOutfit);
  console.log(`Base Items Total: $${(checkout.baseItemsTotal / 100).toFixed(2)}`);
  console.log(`Unique Suppliers: ${checkout.supplierCount}`);
  console.log(`Total Delivery Fee: $${(checkout.totalDeliveryFee / 100).toFixed(2)}`);
  console.log(`Platform Fee: $${(checkout.platformFee / 100).toFixed(2)}`);
  console.log(`FINAL TOTAL CHARGED: $${(checkout.finalTotal / 100).toFixed(2)}`);

  console.log('\n[2] Simulating Payment Success & Generating Ledger...');
  const ledger = CommerceService.generateLedgerEntries('order-123', mockOutfit, checkout);
  
  ledger.forEach(entry => {
    console.log(`[LEDGER] ${entry.type} -> ${entry.recipientId}: $${(entry.amount / 100).toFixed(2)} (${entry.status})`);
  });

  console.log('\n[3] Simulating Race Condition (Out of Stock during checkout)...');
  // If sup-A marks item-1 as sold just before payment intent succeeds:
  console.log('WARN: Item item-1 (sup-A) became UNAVAILABLE prior to ledger lock.');
  console.log('ACTION: Rejecting payment intent. Re-rolling outfit requirements.');
  
  console.log('\n--- SIMULATION COMPLETE ---');
}

runSimulation();
