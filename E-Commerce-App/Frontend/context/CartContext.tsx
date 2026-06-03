import api from "@/constants/api";
import { Product } from "@/constants/types";
import { useAuth } from "@clerk/expo";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import Toast from "react-native-toast-message";

export type CartItem = {
    id: string,
    productId: string,
    product: Product,
    quantity: number,
    size: string,
    price: number,
};

type CartContextType = {
    cartItems: CartItem[],
    addToCart: (product: Product, size: string) => Promise<void>;
    removeFromCart: (itemId: string, size: string) => Promise<void>;
    updateQuantity: (itemId: string, quantity: number, size: string) => Promise<void>;
    clearCart: () => Promise<void>;
    cartTotal: number,
    itemCount: number,
    isLoading: boolean,
};

const cartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {

    const { getToken, isSignedIn } = useAuth();

    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [cartTotal, setCartTotal] = useState(0);

    const fetchCart = async () => {
        try {
            setIsLoading(true);
            const token = await getToken();
            const { data } = await api.get('/cart', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (data.success && data.data) {
                const servercart = data.data;
                const mappedItems: CartItem[] = servercart.items.map((item: any) => ({
                    id: item.product._id,
                    productId: item.product._id,
                    product: item.product,
                    quantity: item.quantity,
                    size: item?.size || 'M',
                    price: item.price
                }));
                setCartItems(mappedItems);
                setCartTotal(servercart.totalAmount);
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const addToCart = async (product: Product, size: string) => {

        const token = await getToken();

        if (!isSignedIn) {
            Toast.show({
                type: 'info',
                text1: 'Not Signed In',
                text2: 'Please sign in to add items to your cart'
            });
            return;
        }
        try {
            setIsLoading(true);
            const { data } = await api.post('/cart/add', {
                productId: product._id,
                quantity: 1,
                size
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (data.success) {
                await fetchCart();
                Toast.show({
                    type: 'success',
                    text1: 'Added to Cart',
                    text2: `${product.name} has been added to your cart`
                });
            }
        } catch (error: any) {
            console.error('Error adding to cart:', error);
            Toast.show({
                type: 'error',
                text1: 'Failed to add to cart',
                text2: error.response?.data?.message || 'An error occurred while adding item to cart.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const removeFromCart = async (productId: string, size: string) => {

        const token = await getToken();

        if (!isSignedIn) {
            Toast.show({
                type: 'info',
                text1: 'Not Signed In',
                text2: 'Please sign in to remove items from your cart'
            });
            return;
        }

        try {
            setIsLoading(true);
            const { data } = await api.delete(`/cart/item/${productId}?size=${size}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (data.success) {
                await fetchCart();
                Toast.show({
                    type: 'success',
                    text1: 'Removed from Cart',
                    text2: `Item has been removed from your cart`
                });
            }
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: 'Failed to remove from cart',
                text2: 'An error occurred while removing item from cart.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const updateQuantity = async (productId: string, quantity: number, size: string = 'M') => {
        const token = await getToken();

        if (!isSignedIn) {
            Toast.show({
                type: 'info',
                text1: 'Not Signed In',
                text2: 'Please sign in to update cart items'
            });
            return;
        }

        if (quantity < 1) {
            return;
        }

        try {
            setIsLoading(true);
            const { data } = await api.put(`/cart/item/${productId}`, {
                quantity,
                size
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (data.success) {
                await fetchCart();
                Toast.show({
                    type: 'success',
                    text1: 'Cart Updated',
                    text2: `Item quantity has been updated`
                });
            }
        } catch (error: any) {
            console.error('Error updating cart item:', error);
            Toast.show({
                type: 'error',
                text1: 'Failed to update cart',
                text2: 'An error occurred while updating cart item.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const clearCart = async () => {
        const token = await getToken();

        if (!isSignedIn) {
            Toast.show({
                type: 'info',
                text1: 'Not Signed In',
                text2: 'Please sign in to clear your cart'
            });
            return;
        }

        try {
            setIsLoading(true);
            const { data } = await api.delete('/cart', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (data.success) {
                setCartItems([]);
                setCartTotal(0);
                Toast.show({
                    type: 'success',
                    text1: 'Cart Cleared',
                    text2: 'All items have been removed from your cart'
                });
            }
        } catch (error: any) {
            console.error('Error clearing cart:', error);
            Toast.show({
                type: 'error',
                text1: 'Failed to clear cart',
                text2: 'An error occurred while clearing the cart.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    useEffect(() => {
        if (isSignedIn) {
            fetchCart();
        } else {
            setCartItems([]);
            setCartTotal(0);
        }
    }, [isSignedIn]);

    return (
        <cartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            cartTotal,
            itemCount,
            isLoading
        }}>
            {children}
        </cartContext.Provider>
    )
};

export function useCart() {
    const context = useContext(cartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};