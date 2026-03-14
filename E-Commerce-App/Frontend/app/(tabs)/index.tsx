import { View, Text, ScrollView, Dimensions, Image, ActivityIndicator, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '@/components/Header'
import { useRouter } from 'expo-router';
import { CATEGORIES } from '@/constants';
import { BANNERS, dummyProducts } from '@/assets/assets';
import { Product } from '@/constants/types';
import CategoryItem from '@/components/CategoryItem';
import ProductCard from '@/components/ProductCard';

const { width } = Dimensions.get('window');

export default function Home() {

    const router = useRouter();

    const [activeBannerIndex, setActiveBannerIndex] = useState(0);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const categories = [
        {
            id: 'all',
            name: 'All',
            icon: 'grid-outline',
        },
        ...CATEGORIES,
    ];
    const fetchProducts = async () => {
        setProducts(dummyProducts);
        setLoading(false);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <SafeAreaView className='flex-1' edges={['top']}>
            <Header title='Forever' showMenu showCart showLogo />
            <ScrollView
                className='flex-1 px-4'
                showsVerticalScrollIndicator={false}
            >
                {/* Banner Slider */}
                <View className='mb-6'>
                    <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} className='w-full h-48 rounded-xl' scrollEventThrottle={16}
                        onScroll={(e) => {
                            const slide = Math.ceil(e.nativeEvent.contentOffset.x / e.nativeEvent.layoutMeasurement.width)
                            if (slide !== activeBannerIndex) {
                                setActiveBannerIndex(slide)
                            }
                        }}
                    >
                        {BANNERS.map((banner, index) => (
                            <View key={index} className='relative w-full h-48 overflow-hidden bg-gray-200' style={{ width: width - 32 }}>
                                <Image source={{ uri: banner.image }} className='w-full h-full' resizeMode='cover' />
                                <View className='absolute inset-0 bg-black/40' />
                                <View className='absolute z-10 bottom-4 left-4'>
                                    <Text className='text-2xl font-bold text-white'>{banner.title}</Text>
                                    <Text className='text-sm font-medium text-white'>{banner.subtitle}</Text>
                                    <TouchableOpacity className='self-start px-4 py-2 mt-2 bg-white rounded-full'>
                                        <Text className='text-xs font-bold text-primary'>Get Now</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                    {/* Pagination Dots */}
                    <View className='flex-row justify-center gap-2 mt-3'>
                        {BANNERS.map((_, index) => (
                            <View key={index} className={`h-2 rounded-full ${index === activeBannerIndex ? 'bg-primary w-6' : 'bg-gray-300 w-2'}`} />
                        ))}
                    </View>
                </View>
                {/* Categories */}
                <View className='mb-6'>
                    <View className='flex-row items-center justify-between mb-4'>
                        <Text className='text-xl font-bold text-primary'>Categories</Text>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} >
                        {categories.map((cat: any) => (
                            <CategoryItem
                                key={cat.id}
                                item={cat}
                                isSelected={false}
                                onPress={() => router.push({
                                    pathname: '/shop',
                                    params: { category: cat.id === 'all' ? '' : cat.name }
                                })}
                            />
                        ))}
                    </ScrollView>
                </View>
                {/* Popular Products */}
                <View className='mb-8'>
                    <View className='flex-row items-center justify-between mb-4'>
                        <Text className='text-xl font-bold text-primary'>Popular</Text>
                        <TouchableOpacity onPress={() => router.push('/shop')}>
                            <Text className='text-sm text-secondary'>See All</Text>
                        </TouchableOpacity>
                    </View>
                    {loading ? (
                        <ActivityIndicator size='large' />
                    ) : (
                        <View className='flex-row flex-wrap justify-between'>
                            {products.slice(0, 4).map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </View>
                    )}
                </View>
                {/* NewsLetter CTA */}
                <View className='items-center p-6 mb-20 bg-gray-100 rounded-2xl'>
                    <Text className='mb-2 text-2xl font-bold text-center text-primary'>Join The Revolution</Text>
                    <Text className='mb-4 text-center text-secondary'>Subscibe to our newsletter and get 10% off your first purchase.</Text>
                    <TouchableOpacity className='items-center w-4/5 py-3 rounded-full bg-primary'>
                        <Text className='text-base font-medium text-white'>Subscribe Now</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}