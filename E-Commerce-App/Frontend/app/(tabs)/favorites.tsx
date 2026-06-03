import React from 'react'
import { useWishlist } from '@/context/WishListContext'
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/Header';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import ProductCard from '@/components/ProductCard';

export default function Favorites() {
  
  const { wishlist } = useWishlist();
  const router = useRouter();

  return (
    <SafeAreaView className='flex-1 bg-surface' edges={['top']}>
      <Header title='Wishlist' showMenu showCart />
      {wishlist.length > 0 ? (
        <ScrollView
          className='flex-1 px-4 mt-4'
          showsVerticalScrollIndicator={false}
        >
          <View className='flex-row flex-wrap justify-between'>
            {wishlist.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </View>
        </ScrollView>
      ) : (
        <View className='items-center justify-center flex-1'>
          <Text className='text-lg text-gray-500'>Your wishlist is empty</Text>
          <TouchableOpacity onPress={() => router.push('/')} className='mt-4'>
            <Text className='font-bold text-primary'>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  )
}