import { View, Text, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useCart } from '@/context/CartContext'
import { useRouter } from 'expo-router';
import { Address } from '@/constants/types';
import { dummyAddress } from '@/assets/assets';
import Toast from 'react-native-toast-message';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/constants';
import Header from '@/components/Header';
import { Ionicons } from '@expo/vector-icons';

export default function Checkout() {

    const { cartTotal } = useCart();
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);

    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'stripe'>('cash');

    const shipping = 2.0;
    const tax = 0;
    const total = cartTotal + shipping + tax;

    const fetchAddress = async () => {
        const addrList = dummyAddress;
        if (addrList.length > 0) {
            // Find default or first
            const defaultAddr = addrList.find(addr => addr.isDefault) || addrList[0];
            setSelectedAddress(defaultAddr as Address);
        }
        setPageLoading(false);
    };

    const handlePlaceOrderOrder = async () => {
        if (!selectedAddress) {
            Toast.show({
                type: 'error',
                text1: 'No Address Selected',
                text2: 'Please select a shipping address before placing the order.'
            })
            return;
        }

        if (paymentMethod === 'stripe') {
            return Toast.show({
                type: 'error',
                text1: 'Payment Method Not Supported',
                text2: 'Stripe payment is currently not supported in this demo.'
            })
        }
        // Cash on delivery
        router.replace('/orders')
    };

    useEffect(() => {
        fetchAddress();
    }, []);

    if (pageLoading) {
        return (
            <SafeAreaView className='items-center justify-center flex-1 bg-surface' >
                <ActivityIndicator size='large' color={COLORS.primary} />
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView className='flex-1 bg-surface' edges={['top']}>
            <Header title='Checkout' showBack />
            <ScrollView className='flex-1 px-4 mt-4'>
                {/* Address Section */}
                <Text className='mb-4 text-lg font-bold text-primary'>Shipping Address</Text>
                {selectedAddress ? (
                    <View className='p-4 mb-6 bg-white shadow-sm rounded-xl'>
                        <View className='flex-row items-center justify-between mb-2'>
                            <Text className='text-base font-bold'>{selectedAddress.type}</Text>
                            <TouchableOpacity
                                onPress={() => router.push('/addresses')}
                            >
                                <Text className='text-sm text-accent'>Change</Text>
                            </TouchableOpacity>
                        </View>
                        <Text className='leading-5 text-secondary'>
                            {selectedAddress.street}, {selectedAddress.city}
                            {'\n'}
                            {selectedAddress.state}, {selectedAddress.zipCode}
                            {'\n'}
                            {selectedAddress.country}
                        </Text>
                    </View>
                ) : (
                    <TouchableOpacity
                        className='items-center justify-center mb-6 bg-white border-2 border-gray-100 border-dashed rounded-xl'
                        onPress={() => router.push('/addresses')}
                    >
                        <Text className='font-bold text-primary'>Add Address</Text>
                    </TouchableOpacity>
                )}
                {/* Payment Method */}
                <Text className='mb-4 text-lg font-bold text-primary'>Payment Method</Text>
                {/* cash on Delivery Options */}
                <TouchableOpacity
                    className={`bg-white p-4 rounded-xl mb-4 shadow-sm flex-row items-center border-2 ${paymentMethod === 'cash' ? 'border-primary' : 'border-transparent'}`}
                    onPress={() => setPaymentMethod('cash')}
                >
                    <Ionicons name='cash-outline' size={24} color={COLORS.primary} className='mr-3' />
                    <View className='flex-1 ml-3'>
                        <Text className='text-base font-bold text-primary'>cash on Delivery</Text>
                        <Text className='mt-1 text-xs text-secondary'>pay when you receive the order</Text>
                    </View>
                    {paymentMethod === 'cash' && (
                        <Ionicons name='checkmark-circle' size={20} color={COLORS.primary} />
                    )}
                </TouchableOpacity>
                {/* Stripe Options */}
                <TouchableOpacity
                    className={`bg-white p-4 rounded-xl mb-4 shadow-sm flex-row items-center border-2 ${paymentMethod === 'stripe' ? 'border-primary' : 'border-transparent'}`}
                    onPress={() => setPaymentMethod('stripe')}
                >
                    <Ionicons name='card-outline' size={24} color={COLORS.primary} className='mr-3' />
                    <View className='flex-1 ml-3'>
                        <Text className='text-base font-bold text-primary'>pay with Card</Text>
                        <Text className='mt-1 text-xs text-secondary'>Credit or Debit card</Text>
                    </View>
                    {paymentMethod === 'stripe' && (
                        <Ionicons name='checkmark-circle' size={20} color={COLORS.primary} />
                    )}
                </TouchableOpacity>
            </ScrollView>
            {/* Order Summary */}
            <View className='p-4 bg-white border-t border-gray-100 shadow-lg'>
                <Text className='mb-4 text-lg font-bold text-primary'>Order Summary</Text>
                {/* Subtotal */}
                <View className='flex-row justify-between mb-2'>
                    <Text className='text-secondary'>Subtotal</Text>
                    <Text className='font-bold'>${cartTotal.toFixed(2)}</Text>
                </View>
                {/* Shipping Charges */}
                <View className='flex-row justify-between mb-2'>
                    <Text className='text-secondary'>Shipping</Text>
                    <Text className='font-bold'>${shipping.toFixed(2)}</Text>
                </View>
                {/* Tax */}
                <View className='flex-row justify-between mb-4'>
                    <Text className='text-secondary'>Tax</Text>
                    <Text className='font-bold'>${tax.toFixed(2)}</Text>
                </View>
                {/* Total */}
                <View className='flex-row justify-between mb-6'>
                    <Text className='text-xl font-bold text-primary'>Total</Text>
                    <Text className='text-xl font-bold text-primary'>${total.toFixed(2)}</Text>
                </View>
                {/* Place Order Button */}
                <TouchableOpacity
                    className={`p-4 rounded-xl items-center ${loading ? 'bg-gray-400' : 'bg-primary'}`}
                    onPress={handlePlaceOrderOrder}
                    disabled={loading}
                >
                    {loading ? <ActivityIndicator color='white' /> : <Text className='text-lg font-bold text-white'>Place Order</Text>}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}