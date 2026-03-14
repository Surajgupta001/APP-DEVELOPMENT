import React, { useEffect, useState } from 'react'
import { Product } from '@/constants/types'
import { dummyProducts } from '@/assets/assets';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/Header';
import { ActivityIndicator, FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants';
import ProductCard from '@/components/ProductCard';

export default function Shop() {

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchProducts = async (pageNumber = 1) => {
        if (pageNumber === 1) {
            setLoading(true);
        } else {
            setLoadingMore(true);
        }
        
        try {
            const start = (pageNumber - 1) * 10;
            const end = start + 10;
            const paginationData = dummyProducts.slice(start, end);

            if (pageNumber === 1) {
                setProducts(paginationData);
            } else {
                setProducts(prev => [...prev, ...paginationData]);
            }

            setHasMore(end < dummyProducts.length);
            setPage(pageNumber);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    const loadMore = () => {
        if (!loadingMore && !loading && hasMore) {
            fetchProducts(page + 1);
        };
    };

    useEffect(() => {
        fetchProducts(1);
    }, []);

    return (
        <SafeAreaView className='flex-1 bg-surface' edges={['top']}>
            <Header title='Shop' showBack showCart />
            <View className='flex-row gap-2 mx-4 my-2 mb-3'>
                {/* Search Bar */}
                <View className='flex-row items-center flex-1 bg-white border border-gray-100 rounded-xl'>
                    <Ionicons name='search' className='ml-4' size={20} color={COLORS.secondary} />
                    <TextInput className='flex-1 px-4 py-3 ml-2 text-primary' placeholder='Search products...' returnKeyType='search' placeholderTextColor={COLORS.secondary} />
                </View>
                {/* Filter icon */}
                <TouchableOpacity className='items-center justify-center w-12 h-12 bg-gray-800 rounded-xl'>
                    <Ionicons name='options-outline' size={20} color='white' />
                </TouchableOpacity>
            </View>
            {loading ? (
                <View className='items-center justify-center flex-1'>
                    <ActivityIndicator size='large' color={COLORS.primary} />
                </View>
            ) : (
                <FlatList
                    data={products}
                    keyExtractor={(item) => item._id}
                    numColumns={2}
                    contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
                    columnWrapperStyle={{ justifyContent: 'space-between' }}
                    renderItem={({ item }) => (
                        <ProductCard product={item} />
                    )}
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={
                        loadingMore ? (
                            <View className='py-4'>
                                <ActivityIndicator size='small' color={COLORS.primary} />
                            </View>
                        ) : null
                    }
                    ListEmptyComponent={
                        !loading && (
                            <View className='items-center justify-center flex-1 py-20'>
                                <Text className='text-secondary'>No product Found</Text>
                            </View>
                        )
                    }
                />
            )}
        </SafeAreaView>
    )
}