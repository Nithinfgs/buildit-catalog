import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, Order, Address } from '../types';
import { MOCK_ADDRESSES } from '../data/catalog';
import { useSound } from './SoundContext';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, unit?: string, price?: number) => void;
  removeFromCart: (productId: string, unit?: string) => void;
  updateQuantity: (productId: string, quantity: number, unit?: string) => void;
  getItemQuantity: (productId: string, unit?: string) => number;
  clearCart: () => void;
  itemCount: number;
  itemTotal: number;
  originalTotal: number;
  totalSavings: number;
  deliveryFee: number;
  handlingFee: number;
  freeDeliveryThreshold: number;
  amountNeededForFreeDelivery: number;
  tipAmount: number;
  setTipAmount: (amount: number) => void;
  isDonationChecked: boolean;
  setIsDonationChecked: (checked: boolean) => void;
  deliveryInstructions: string[];
  toggleInstruction: (instruction: string) => void;
  grandTotal: number;
  selectedAddress: Address;
  setSelectedAddress: (addr: Address) => void;
  activeOrder: Order | null;
  placeOrder: () => Order;
  cancelOrder: () => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  isTrackingOpen: boolean;
  setIsTrackingOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { playAdd, playRemove, playSuccess, playCartOpen } = useSound();

  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('blinkit_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [selectedAddress, setSelectedAddress] = useState<Address>(MOCK_ADDRESSES[0]);
  const [tipAmount, setTipAmount] = useState<number>(0);
  const [isDonationChecked, setIsDonationChecked] = useState<boolean>(true);
  const [deliveryInstructions, setDeliveryInstructions] = useState<string[]>([]);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [isCartDrawerOpen, setIsCartDrawerOpenState] = useState<boolean>(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState<boolean>(false);

  const setIsCartDrawerOpen = (open: boolean) => {
    if (open) playCartOpen();
    setIsCartDrawerOpenState(open);
  };

  useEffect(() => {
    try {
      localStorage.setItem('blinkit_cart', JSON.stringify(items));
    } catch {}
  }, [items]);

  const addToCart = (product: Product, unit?: string, price?: number) => {
    playAdd();
    const targetUnit = unit || product.unit;
    const targetPrice = price || product.price;

    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && (item.selectedUnit || item.product.unit) === targetUnit
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      } else {
        return [...prev, { product, quantity: 1, selectedUnit: targetUnit, price: targetPrice }];
      }
    });
  };

  const removeFromCart = (productId: string, unit?: string) => {
    playRemove();
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === productId && (!unit || (item.selectedUnit || item.product.unit) === unit)
      );

      if (existingIndex === -1) return prev;

      const updated = [...prev];
      if (updated[existingIndex].quantity > 1) {
        updated[existingIndex].quantity -= 1;
        return updated;
      } else {
        return updated.filter((_, idx) => idx !== existingIndex);
      }
    });
  };

  const updateQuantity = (productId: string, quantity: number, unit?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, unit);
      return;
    }
    setItems((prev) =>
      prev.map((item) => {
        if (item.product.id === productId && (!unit || (item.selectedUnit || item.product.unit) === unit)) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const getItemQuantity = (productId: string, unit?: string) => {
    const item = items.find(
      (it) => it.product.id === productId && (!unit || (it.selectedUnit || it.product.unit) === unit)
    );
    return item ? item.quantity : 0;
  };

  const clearCart = () => {
    setItems([]);
  };

  const toggleInstruction = (instruction: string) => {
    setDeliveryInstructions((prev) =>
      prev.includes(instruction) ? prev.filter((i) => i !== instruction) : [...prev, instruction]
    );
  };

  // Calculations
  const itemCount = items.reduce((acc, it) => acc + it.quantity, 0);

  const itemTotal = items.reduce((acc, it) => acc + it.price * it.quantity, 0);

  const originalTotal = items.reduce((acc, it) => {
    const orig = it.product.originalPrice || it.price;
    return acc + orig * it.quantity;
  }, 0);

  const totalSavings = Math.max(0, originalTotal - itemTotal);

  const freeDeliveryThreshold = 199;
  const deliveryFee = itemTotal >= freeDeliveryThreshold || itemTotal === 0 ? 0 : 25;
  const amountNeededForFreeDelivery = Math.max(0, freeDeliveryThreshold - itemTotal);
  const handlingFee = itemTotal > 0 ? 4 : 0;
  const donationAmount = isDonationChecked && itemTotal > 0 ? 1 : 0;

  const grandTotal = itemTotal > 0 ? itemTotal + deliveryFee + handlingFee + tipAmount + donationAmount : 0;

  const placeOrder = (): Order => {
    playSuccess();
    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      orderNumber: `BK${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      items: [...items],
      totalAmount: grandTotal,
      status: 'placed',
      deliveryAddress: selectedAddress,
      riderName: 'Ramesh Kumar',
      riderPhone: '+91 98765 43210',
      etaMins: 8
    };

    setActiveOrder(newOrder);
    clearCart();
    setIsCartDrawerOpenState(false);
    setIsTrackingOpen(true);
    return newOrder;
  };

  const cancelOrder = () => {
    setActiveOrder(null);
    setIsTrackingOpen(false);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        getItemQuantity,
        clearCart,
        itemCount,
        itemTotal,
        originalTotal,
        totalSavings,
        deliveryFee,
        handlingFee,
        freeDeliveryThreshold,
        amountNeededForFreeDelivery,
        tipAmount,
        setTipAmount,
        isDonationChecked,
        setIsDonationChecked,
        deliveryInstructions,
        toggleInstruction,
        grandTotal,
        selectedAddress,
        setSelectedAddress,
        activeOrder,
        placeOrder,
        cancelOrder,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        isTrackingOpen,
        setIsTrackingOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
