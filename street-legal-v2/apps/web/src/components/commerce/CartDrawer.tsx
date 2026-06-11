'use client';

import React, { useState } from 'react';
import { useCartStore, CartEntry } from '@/store/useCartStore';
import { X, ShoppingBag, Trash2, Smartphone, CreditCard, CheckCircle, RefreshCw, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

type CheckoutMethod = 'mpesa' | 'stripe' | null;

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { entries, removeEntry, updateQuantity, clearCart, getTotals } = useCartStore();
  const { subtotal, discount, total, itemCount } = getTotals();

  // Checkout State Machine
  const [activeGateway, setActiveGateway] = useState<CheckoutMethod>(null);
  const [phoneNumber, setPhoneNumber] = useState('0712345678');
  const [checkoutStatus, setCheckoutStatus] = useState<'idle' | 'processing' | 'pin-prompted' | 'success'>('idle');
  const [orderNumber, setOrderNumber] = useState('');

  // Stripe Mock Inputs
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');

  const startMpesaCheckout = () => {
    setActiveGateway('mpesa');
    setCheckoutStatus('idle');
  };

  const startStripeCheckout = () => {
    setActiveGateway('stripe');
    setCheckoutStatus('idle');
  };

  const handleMpesaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutStatus('processing');

    // Simulate real M-Pesa STK push trigger states
    setTimeout(() => {
      setCheckoutStatus('pin-prompted');

      setTimeout(() => {
        const orderId = 'SL-' + Math.floor(100000 + Math.random() * 900000);
        setOrderNumber(orderId);
        setCheckoutStatus('success');
        clearCart();
      }, 2500); // Wait for mock user PIN input
    }, 1500); // Wait for Daraja API response
  };

  const handleStripeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutStatus('processing');

    // Simulate Stripe Elements authorization
    setTimeout(() => {
      const orderId = 'SL-' + Math.floor(100000 + Math.random() * 900000);
      setOrderNumber(orderId);
      setCheckoutStatus('success');
      clearCart();
    }, 2500);
  };

  const handleBackToCart = () => {
    setActiveGateway(null);
    setCheckoutStatus('idle');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-50 backdrop-blur-sm"
          />

          {/* Cart Panel Sheet */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-screen w-full sm:w-[480px] bg-background border-l border-border-subtle z-50 flex flex-col justify-between shadow-[0_0_50px_rgba(0,0,0,0.8)]"
          >
            {/* Header */}
            <div className="p-6 border-b border-border-subtle flex items-center justify-between bg-black/40 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <ShoppingBag size={18} className="text-accent" />
                <h2 className="text-sm font-black uppercase tracking-widest text-foreground italic">
                  Shopping Bag ({itemCount})
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-surface-2 border-border-subtle text-white/40 hover:text-foreground transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Main Panel Content: Cart List or Gateway Overlays */}
            <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
              <AnimatePresence mode="wait">
                {activeGateway === null ? (
                  /* --- 1. CART LIST VIEW --- */
                  <motion.div
                    key="cart-list"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    {entries.length > 0 ? (
                      entries.map((entry) => (
                        <div
                          key={entry.id}
                          className="p-4 rounded-2xl border border-border-subtle bg-surface-1 flex flex-col gap-3 group relative hover:border-border transition-all"
                        >
                          {/* Remove button */}
                          <button
                            onClick={() => removeEntry(entry.id)}
                            className="absolute top-4 right-4 text-white/20 hover:text-red-400 p-1 rounded-lg transition-colors"
                          >
                            <Trash2 size={12} />
                          </button>

                          {entry.type === 'single' && entry.product ? (
                            /* Single Item render */
                            <div className="flex gap-4 items-center">
                              <div className="w-14 h-14 bg-surface-2 border-border-subtle rounded-xl flex items-center justify-center border border-border-subtle">
                                <img
                                  src={entry.product.image}
                                  alt={entry.product.name}
                                  className="max-w-[80%] max-h-[80%] object-contain"
                                />
                              </div>
                              <div className="flex-1 min-w-0 pr-6">
                                <span className="text-[7px] uppercase font-black tracking-widest text-accent">
                                  {entry.product.category}
                                </span>
                                <h3 className="text-[11px] font-black uppercase tracking-tight text-white/90 truncate">
                                  {entry.product.name}
                                </h3>
                                <p className="text-[10px] font-bold text-white/50 mt-0.5">
                                  KES {entry.product.price.toLocaleString()}
                                </p>
                              </div>
                            </div>
                          ) : (
                            /* Unified Outfit Bundle render */
                            <div>
                              <div className="flex justify-between items-start border-b border-border-subtle pb-2 mb-2 pr-6">
                                <div>
                                  <span className="bg-accent text-black text-[6px] font-black uppercase italic px-1.5 py-0.5 rounded">
                                    Outfit Bundle
                                  </span>
                                  <h3 className="text-xs font-black uppercase italic tracking-tight text-white/95 mt-1">
                                    {entry.outfit?.name}
                                  </h3>
                                </div>
                                <span className="text-[9px] text-white/40 uppercase font-bold tracking-widest">
                                  Code: {entry.outfit?.share_code}
                                </span>
                              </div>

                              {/* Horizontal items previews inside the bundle card */}
                              <div className="grid grid-cols-5 gap-2 my-2">
                                {Object.entries(entry.outfit?.items || {}).map(([cat, item]) => {
                                  const prod = item as Product;
                                  return (
                                    <div
                                      key={cat}
                                      className="aspect-square bg-surface-2 border-border-subtle border border-border-subtle rounded-lg flex items-center justify-center p-1"
                                      title={`${cat}: ${prod.name}`}
                                    >
                                      {prod.image.startsWith('accessory_') ? (
                                        <span className="text-accent text-[8px]">✦</span>
                                      ) : (
                                        <img
                                          src={prod.image}
                                          alt={prod.name}
                                          className="max-w-full max-h-full object-contain"
                                        />
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Item Quantity counter */}
                          <div className="flex justify-between items-center border-t border-border-subtle pt-2 mt-1">
                            <span className="text-[8px] text-white/30 uppercase font-black tracking-widest">
                              Quantity
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateQuantity(entry.id, entry.quantity - 1)}
                                className="w-5 h-5 rounded bg-surface-2 border-border-subtle text-white/60 hover:text-foreground flex items-center justify-center font-bold text-xs"
                              >
                                -
                              </button>
                              <span className="text-xs font-black text-foreground w-4 text-center">
                                {entry.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(entry.id, entry.quantity + 1)}
                                className="w-5 h-5 rounded bg-surface-2 border-border-subtle text-white/60 hover:text-foreground flex items-center justify-center font-bold text-xs"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      /* Empty state */
                      <div className="flex flex-col items-center justify-center text-center py-20 opacity-20">
                        <ShoppingBag size={36} className="mb-4" />
                        <p className="text-[10px] uppercase font-black tracking-[0.2em]">Bag is empty_</p>
                      </div>
                    )}
                  </motion.div>
                ) : activeGateway === 'mpesa' ? (
                  /* --- 2. M-PESA CHECKOUT PORTAL --- */
                  <motion.div
                    key="checkout-mpesa"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="text-xs font-black uppercase text-accent tracking-widest flex items-center gap-1.5">
                        <Smartphone size={14} /> M-Pesa STK Push Gateway
                      </h3>
                      <button onClick={handleBackToCart} className="text-[8px] uppercase tracking-widest font-black text-white/30 hover:text-foreground">
                        Back to Bag
                      </button>
                    </div>

                    {checkoutStatus === 'idle' && (
                      <form onSubmit={handleMpesaSubmit} className="space-y-4">
                        <div className="bg-surface-2 border-border-subtle p-4 rounded-2xl border border-border-subtle">
                          <p className="text-[8px] text-white/40 uppercase font-black tracking-widest mb-2">Checkout Details</p>
                          <p className="text-[10px] text-white/70">
                            Provide your registered Safaricom phone number below. We will push a secure checkout prompt directly to your handset.
                          </p>
                        </div>

                        <div>
                          <label className="text-[8px] uppercase font-black text-white/40 tracking-widest block mb-1">M-Pesa Number</label>
                          <input
                            type="tel"
                            required
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="w-full bg-surface-2 border-border-subtle border border-border rounded-xl px-4 py-3 text-sm font-bold text-foreground outline-none focus:border-accent/40"
                            placeholder="e.g. 0712345678"
                          />
                        </div>

                        <button type="submit" className="w-full bg-accent text-black font-black uppercase italic py-3 rounded-xl hover:scale-102 transition-transform shadow-premium text-xs">
                          Initiate STK Push (KES {total.toLocaleString()})
                        </button>
                      </form>
                    )}

                    {(checkoutStatus === 'processing' || checkoutStatus === 'pin-prompted') && (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <RefreshCw size={24} className="text-accent animate-spin mb-4" />
                        <h4 className="text-xs font-black uppercase tracking-widest text-white/90 animate-pulse">
                          {checkoutStatus === 'processing' ? 'Awaiting Handset Bind...' : 'PIN Prompt Sent!'}
                        </h4>
                        <p className="text-[9px] uppercase tracking-[0.15em] text-white/30 max-w-[280px] mt-2 leading-relaxed">
                          {checkoutStatus === 'processing' 
                            ? 'Initiating secure Daraja API handshake to resolve carrier route...'
                            : `Checking transaction status on +254 ${phoneNumber.substring(1)}. Enter your pin on your device now.`}
                        </p>
                      </div>
                    )}

                    {checkoutStatus === 'success' && (
                      <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
                        <div className="w-12 h-12 bg-accent/10 border border-accent rounded-full flex items-center justify-center text-accent animate-bounce">
                          <CheckCircle size={20} />
                        </div>
                        <h4 className="text-sm font-black uppercase tracking-widest text-accent">Payment Secured!</h4>
                        <div className="bg-surface-2 border-border-subtle border border-border rounded-2xl p-4 w-full text-left space-y-1 font-mono text-[9px] uppercase tracking-widest">
                          <p className="text-white/40">Order Code: <span className="text-foreground font-bold">{orderNumber}</span></p>
                          <p className="text-white/40">Amount: <span className="text-foreground font-bold">KES {total.toLocaleString()}</span></p>
                          <p className="text-white/40">Gateway: <span className="text-foreground font-bold">M-Pesa STK</span></p>
                          <p className="text-white/40">Status: <span className="text-accent font-black">COMPLETED</span></p>
                        </div>
                        <p className="text-[8px] uppercase tracking-widest text-white/30">Your outfit is being prepped for dispatch!</p>
                        <button onClick={onClose} className="w-full bg-surface-3 text-foreground hover:bg-white/20 font-black uppercase py-3 rounded-xl transition-all text-xs">
                          Close Drawer
                        </button>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  /* --- 3. STRIPE CREDIT CARD PORTAL --- */
                  <motion.div
                    key="checkout-stripe"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="text-xs font-black uppercase text-accent tracking-widest flex items-center gap-1.5">
                        <CreditCard size={14} /> Stripe Card Gateway
                      </h3>
                      <button onClick={handleBackToCart} className="text-[8px] uppercase tracking-widest font-black text-white/30 hover:text-foreground">
                        Back to Bag
                      </button>
                    </div>

                    {checkoutStatus === 'idle' && (
                      <form onSubmit={handleStripeSubmit} className="space-y-4">
                        <div className="bg-surface-2 border-border-subtle border border-border-subtle p-4 rounded-2xl">
                          <p className="text-[8px] text-white/40 uppercase font-black tracking-widest mb-1">Stripe Checkout Elements</p>
                          <p className="text-[10px] text-white/60">Secure SSL authorization enabled.</p>
                        </div>

                        <div>
                          <label className="text-[8px] uppercase font-black text-white/40 tracking-widest block mb-1">Cardholder Name</label>
                          <input
                            type="text"
                            required
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            className="w-full bg-surface-2 border-border-subtle border border-border rounded-xl px-4 py-3 text-sm font-bold text-foreground outline-none focus:border-accent/40"
                            placeholder="Name on card"
                          />
                        </div>

                        <div>
                          <label className="text-[8px] uppercase font-black text-white/40 tracking-widest block mb-1">Card Number</label>
                          <input
                            type="text"
                            required
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            className="w-full bg-surface-2 border-border-subtle border border-border rounded-xl px-4 py-3 text-sm font-bold text-foreground outline-none focus:border-accent/40"
                            placeholder="4242 4242 4242 4242"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[8px] uppercase font-black text-white/40 tracking-widest block mb-1">Expiration</label>
                            <input
                              type="text"
                              required
                              className="w-full bg-surface-2 border-border-subtle border border-border rounded-xl px-4 py-3 text-sm font-bold text-foreground outline-none focus:border-accent/40"
                              placeholder="MM/YY"
                            />
                          </div>
                          <div>
                            <label className="text-[8px] uppercase font-black text-white/40 tracking-widest block mb-1">CVC</label>
                            <input
                              type="password"
                              maxLength={3}
                              required
                              className="w-full bg-surface-2 border-border-subtle border border-border rounded-xl px-4 py-3 text-sm font-bold text-foreground outline-none focus:border-accent/40"
                              placeholder="***"
                            />
                          </div>
                        </div>

                        <button type="submit" className="w-full bg-accent text-black font-black uppercase italic py-3 rounded-xl hover:scale-102 transition-transform shadow-premium text-xs">
                          Secure Payment (KES {total.toLocaleString()})
                        </button>
                      </form>
                    )}

                    {checkoutStatus === 'processing' && (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <RefreshCw size={24} className="text-accent animate-spin mb-4" />
                        <h4 className="text-xs font-black uppercase tracking-widest text-white/90 animate-pulse">
                          Authorizing Funds...
                        </h4>
                        <p className="text-[9px] uppercase tracking-[0.15em] text-white/30 max-w-[240px] mt-2 leading-relaxed">
                          Checking token validations on Stripe payment server gateways...
                        </p>
                      </div>
                    )}

                    {checkoutStatus === 'success' && (
                      <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
                        <div className="w-12 h-12 bg-accent/10 border border-accent rounded-full flex items-center justify-center text-accent animate-bounce">
                          <CheckCircle size={20} />
                        </div>
                        <h4 className="text-sm font-black uppercase tracking-widest text-accent">Payment Secured!</h4>
                        <div className="bg-surface-2 border-border-subtle border border-border rounded-2xl p-4 w-full text-left space-y-1 font-mono text-[9px] uppercase tracking-widest">
                          <p className="text-white/40">Order Code: <span className="text-foreground font-bold">{orderNumber}</span></p>
                          <p className="text-white/40">Amount: <span className="text-foreground font-bold">KES {total.toLocaleString()}</span></p>
                          <p className="text-white/40">Gateway: <span className="text-foreground font-bold">Stripe SECURE</span></p>
                          <p className="text-white/40">Status: <span className="text-accent font-black">COMPLETED</span></p>
                        </div>
                        <p className="text-[8px] uppercase tracking-widest text-white/30">Your outfit is being prepped for dispatch!</p>
                        <button onClick={onClose} className="w-full bg-surface-3 text-foreground hover:bg-white/20 font-black uppercase py-3 rounded-xl transition-all text-xs">
                          Close Drawer
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Totals Summary: Only shown when in main Cart List view */}
            {activeGateway === null && entries.length > 0 && (
              <div className="p-6 border-t border-border-subtle bg-black/60 backdrop-blur-md">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40 uppercase font-black tracking-wider">Subtotal</span>
                    <span className="text-foreground font-bold">KES {subtotal.toLocaleString()}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-xs">
                      <span className="text-accent uppercase font-black tracking-wider">Bundle Savings</span>
                      <span className="text-accent font-black">- KES {discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-end border-t border-border-subtle pt-3">
                    <span className="text-[10px] uppercase font-black tracking-widest text-white/60">Estimated Total</span>
                    <span className="text-2xl font-black italic tracking-tighter text-foreground">
                      KES {total.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Split Gateway Payment Triggers */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={startMpesaCheckout}
                    className="bg-surface-2 border-border-subtle hover:bg-surface-3 border border-border rounded-xl py-3 text-[9px] uppercase font-black tracking-widest text-foreground flex items-center justify-center gap-2 hover:scale-102 transition-transform"
                  >
                    <Smartphone size={12} /> Pay with M-Pesa
                  </button>
                  <button
                    onClick={startStripeCheckout}
                    className="bg-accent hover:bg-accent/90 rounded-xl py-3 text-[9px] uppercase font-black tracking-widest text-black flex items-center justify-center gap-2 hover:scale-102 transition-transform shadow-premium"
                  >
                    <CreditCard size={12} /> Pay with Card
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
