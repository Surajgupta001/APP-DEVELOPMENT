import { View, Text, ActivityIndicator, ScrollView, Image, Dimensions, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishListContext';
import { Product } from '@/constants/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/constants';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import api from '@/constants/api';

const { width } = Dimensions.get('window');

export default function ProductDetails() {

    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    const { cartItems, addToCart, itemCount } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();

    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    const fetchProduct = async () => {
        try {
            const { data } = await api.get(`/products/${id}`);
            setProduct(data.data);
        } catch (error : any) {
            console.error('Error fetching product:', error);
            Toast.show({
                type: 'error',
                text1: 'Failed to load product',
                text2: error.response?.data?.message || 'An error occurred while fetching product details.'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <SafeAreaView className='items-center justify-center flex-1'>
                <ActivityIndicator size='large' color={COLORS.primary} />
            </SafeAreaView>
        )
    }
    
    if (!product) {
        return (
            <SafeAreaView className='items-center justify-center flex-1'>
                <Text>Product not found</Text>
            </SafeAreaView>
        )
    }

    const isLiked = isInWishlist(product._id);

    const handleAddToCart = () => {
        if (!selectedSize) {
            Toast.show({
                type: 'info',
                text1: 'No Size Selected',
                text2: 'Please select a size'
            })
            return;
        }
        addToCart(product, selectedSize || '');
    };

    return (
        <View className='flex-1 bg-white'>
            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Image Carousel */}
                <View className='relative h-[450px] bg-gray-100 mb-6'>
                    <ScrollView
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        scrollEventThrottle={16}
                        onScroll={(e) => {
                            const slide = Math.ceil(e.nativeEvent.contentOffset.x / e.nativeEvent.layoutMeasurement.width);
                            setActiveImageIndex(slide);
                        }}
                    >
                        {product.images?.map((img, index) => (
                            <Image
                                key={index}
                                source={{ uri: img }}
                                style={{ width, height: 450 }}
                            />
                        ))}
                    </ScrollView>
                    {/* Header Actions */}
                    <View className='absolute z-10 flex-row items-center justify-between top-12 left-4 right-4'>
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className='items-center justify-center w-10 h-10 rounded-full bg-white/80'
                        >
                            <Ionicons name='arrow-back' size={24} color={COLORS.primary} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => toggleWishlist(product)}
                            className='items-center justify-center w-10 h-10 rounded-full bg-white/80'
                        >
                            <Ionicons name={isLiked ? 'heart' : 'heart-outline'} size={24} color={isLiked ? COLORS.accent : COLORS.primary} />
                        </TouchableOpacity>
                    </View>
                    {/* Pagination Dots */}
                    <View className='absolute left-0 right-0 flex-row justify-center gap-2 bottom-4'>
                        {product.images?.map((_, index) => (
                            <View key={index} className={`h-2 rounded-full ${index === activeImageIndex ? 'w-6 bg-primary' : 'w-2 bg-gray-300'}`} />
                        ))}
                    </View>
                </View>
                {/* Product Info */}
                <View className='px-5'>
                    {/* Title & Rating */}
                    <View className='flex-row items-start justify-between mb-2'>
                        <Text className='flex-1 mr-4 text-2xl font-bold text-primary'>{product.name}</Text>
                        <View className='flex-row items-start justify-between mb-2'>
                            <Ionicons name='star' size={14} color='#FFD700' />
                            <Text className='ml-1 text-sm font-bold'>4.6</Text>
                            <Text className='ml-1 text-xs text-secondary'>(86)</Text>
                        </View>
                    </View>
                    {/* Price */}
                    <Text className='text-2xl font-bold text-primary'>${product.price.toFixed(2)}</Text>
                    {/* Size */}
                    {product.sizes && product.sizes.length > 0 && (
                        <>
                            <Text className='gap-3 mb-3 text-font-bold text-primary'>Size</Text>
                            <View className='flex-row flex-wrap gap-3 mb-6'>
                                {product.sizes.map((size) => (
                                    <TouchableOpacity key={size} onPress={() => setSelectedSize(size)}
                                        className={`w-12 h-12 rounded-full items-center justify-center border ${selectedSize === size ? 'border-primary bg-primary' : 'border-gray-100 bg-white'}`}
                                    >
                                        <Text
                                            className={`text-sm font-medium ${selectedSize === size ? 'text-white' : 'text-primary'}`}
                                        >{size}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </>
                    )}
                    {/* Descriptions */}
                    <Text className='mb-2 text-base font-bold text-primary'>Description</Text>
                    <Text className='mb-6 leading-6 text-secondary'>{product.description}</Text>
                </View>
            </ScrollView>
            {/* Footer */}
            <View className='absolute bottom-0 left-0 right-0 flex-row p-4 bg-white border-t border-gray-100'>
                <TouchableOpacity onPress={handleAddToCart} className='flex-row items-center justify-center w-4/5 py-4 rounded-full shadow-lg bg-primary'>
                    <Ionicons name='bag-outline' size={20} color='white' />
                    <Text className='ml-2 text-base font-bold text-white'>Add to Cart</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/(tabs)/cart')} className='relative flex-row justify-center w-1/5 py-3'>
                    <Ionicons name='cart-outline' size={24} />
                    <View className='absolute z-10 items-center justify-center bg-black rounded-full top-2 right-4 size-4'>
                        <Text className='text-white text-[9px]'>{itemCount}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}