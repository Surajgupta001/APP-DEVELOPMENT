import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useCart } from '@/context/CartContext'
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/Header';
import { ScrollView } from 'react-native-gesture-handler';
import CartItem from '@/components/CartItem';

export default function Cart() {

    const { cartItems, cartTotal, removeFromCart, updateQuantity } = useCart();
    const router = useRouter();

    const shipping = 2.00;
    const total = cartTotal + shipping;

    return (
        <SafeAreaView className='flex-1 bg-surface' edges={['top']}>
            <Header title='My Cart' showBack />
            {cartItems.length > 0 ? (
                <>
                    <ScrollView
                        className='flex-1 px-4 mt-4'
                        showsVerticalScrollIndicator={false}
                    >
                        {cartItems.map((item, index) => (
                            <CartItem
                                key={index}
                                item={item}
                                onRemove={() => removeFromCart(item.id, item.size)}
                                onUpdateQuantity={(quantity) => updateQuantity(item.id, quantity, item.size)}
                            />
                        ))}
                    </ScrollView>
                    <View className='p-4 bg-white shadow-sm rounded-t-3xl'>
                        {/* Subtotal */}
                        <View className='flex-row justify-between mb-2'>
                            <Text className='text-secondary'>Subtotal</Text>
                            <Text className='font-bold text-primary'>${cartTotal.toFixed(2)}</Text>
                        </View>
                        {/* Shipping */}
                        <View className='flex-row justify-between mb-2'>
                            <Text className='text-secondary'>Shipping</Text>
                            <Text className='font-bold text-primary'>${shipping.toFixed(2)}</Text>
                        </View>
                        {/* Border */}
                        <View className='h-[1px] bg-border mb-4' />
                        {/* Total */}
                        <View className='flex-row justify-between mb-6'>
                            <Text className='text-lg font-bold text-primary'>Total</Text>
                            <Text className='text-lg font-bold text-primary'>${total.toFixed(2)}</Text>
                        </View>
                        {/* Checkout button */}
                        <TouchableOpacity className='items-center py-4 rounded-full bg-primary' onPress={() => router.push('/checkout')}>
                            <Text className='text-base font-bold text-white'>Checkout</Text>
                        </TouchableOpacity>
                    </View>
                </>
            ) : (
                <View className='items-center justify-center flex-1'>
                    <Text className='text-lg text-gray-500'>Your cart is empty</Text>
                    <TouchableOpacity onPress={() => router.push('/')} className='mt-4'>
                        <Text className='font-bold text-primary'>Start Shopping</Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    )
}