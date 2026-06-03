import { Product, WishlistContextType } from "@/constants/types";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useAuth } from "@clerk/expo";
import api from "@/constants/api";
import Toast from "react-native-toast-message";

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {

    const { getToken, isSignedIn } = useAuth();
    const [wishlist, setWishlist] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchWishList = async () => {
        if (!isSignedIn) return;
        setLoading(true);
        try {
            const token = await getToken();
            const { data } = await api.get('/wishlist', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data.success && data.data) {
                setWishlist(data.data.products);
            }
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleWishlist = async (product: Product) => {
        if (!isSignedIn) {
            Toast.show({
                type: 'info',
                text1: 'Not Signed In',
                text2: 'Please sign in to manage your wishlist'
            });
            return;
        }

        const isCurrentlyInWishlist = isInWishlist(product._id);

        // Optimistic update
        setWishlist((prev) => {
            if (isCurrentlyInWishlist) {
                return prev.filter((p) => p._id !== product._id);
            } else {
                return [...prev, product];
            }
        });

        try {
            const token = await getToken();
            const { data } = await api.post('/wishlist/toggle', {
                productId: product._id
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!data.success) {
                // Revert optimistic update on failure
                fetchWishList();
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Failed to update wishlist'
                });
            } else {
                Toast.show({
                    type: 'success',
                    text1: isCurrentlyInWishlist ? 'Removed from Wishlist' : 'Added to Wishlist',
                    text2: `${product.name} ${isCurrentlyInWishlist ? 'removed from' : 'added to'} your wishlist`
                });
            }
        } catch (error) {
            console.error('Error toggling wishlist:', error);
            // Revert optimistic update on error
            fetchWishList();
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to update wishlist'
            });
        }
    };

    const isInWishlist = (productId: string) => {
        return wishlist.some((p) => p._id === productId);
    };

    useEffect(() => {
        if (isSignedIn) {
            fetchWishList();
        } else {
            setWishlist([]);
        }
    }, [isSignedIn]);

    return (
        <WishlistContext.Provider value={{
            wishlist,
            loading,
            toggleWishlist,
            isInWishlist
        }}>
            {children}
        </WishlistContext.Provider>
    )
};

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error("useWishlist must be used within a WishlistProvider");
    }
    return context;
};