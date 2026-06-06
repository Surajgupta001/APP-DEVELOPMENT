import { useUser } from '@clerk/expo';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Property } from '../../../../types';
import { supabase } from '../../../../lib/supabase';
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FeaturedCard from '@/components/FeaturedCard';
import PropertyCard from '@/components/PropertyCard';
import { useColorScheme } from 'nativewind';

export default function HomeScreen() {

    const { user } = useUser();
    const router = useRouter();
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';

    const [featured, setFeatured] = useState<Property[]>([]);
    const [recommended, setRecommended] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchProperties = async () => {
        setLoading(true);

        try {
            const { data: featuredData } = await supabase
                .from('properties')
                .select('*')
                .eq('is_featured', true)
                .order('created_at', { ascending: false });

            const { data: recommendedData } = await supabase
                .from('properties')
                .select('*')
                .neq('is_featured', true)
                .order('created_at', { ascending: false });

            setFeatured(featuredData ?? []);
            setRecommended(recommendedData ?? []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching properties:', error);
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchProperties();
        }, [])
    );

    return (
        <SafeAreaView className='flex-1 bg-gray-50 dark:bg-[#121212]'>
            <FlatList
                data={recommended}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <View>
                        
                        {/* Header */}
                        <View className='flex-row items-center justify-between px-5 pt-4 pb-5'>
                            <Image
                                source={require('../../../../assets/images/kribb.png')}
                                style={{ width: 90, height: 36, tintColor: isDark ? '#ffffff' : undefined }}
                                resizeMode='contain'
                            />
                            <TouchableOpacity onPress={() => router.push('/profile')}>
                                {user?.imageUrl ? (
                                    <Image
                                        source={{ uri: user.imageUrl }}
                                        className='w-10 h-10 rounded-full border border-gray-200 dark:border-zinc-800'
                                    />
                                ) : (
                                    <View className="w-10 h-10 rounded-full bg-gray-200 dark:bg-zinc-800 items-center justify-center">
                                        <Ionicons name="person" size={20} color={isDark ? "#9CA3AF" : "#6B7280"} />
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>
                        
                        {/* Search Bar */}
                        <TouchableOpacity
                            onPress={() => router.push('/search')}
                            className='flex-row items-center gap-3 px-4 py-3 mx-5 mb-6 bg-white dark:bg-[#1E1E1E] rounded-2xl'
                            style={{
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 1 },
                                shadowOpacity: isDark ? 0.3 : 0.06,
                                shadowRadius: 6,
                                elevation: 2,
                            }}
                        >
                            <Ionicons
                                name='search-outline'
                                size={18}
                                color={isDark ? '#9CA3AF' : '#9CA3AF'}
                            />
                            <Text className='flex-1 text-sm text-gray-400 dark:text-gray-500'>Search for properties, cities...</Text>
                            <TouchableOpacity
                                onPress={() => router.push('/search?openFilters=true')}
                                className='items-center justify-center w-8 h-8 bg-blue-600 rounded-xl'
                            >
                                <Ionicons
                                    name='options-outline'
                                    size={18}
                                    color='white'
                                />
                            </TouchableOpacity>
                        </TouchableOpacity>
                        
                        {/* Feature Section */}
                        <View className="mb-6">
                            <Text className="px-5 mb-4 text-lg font-bold text-gray-900 dark:text-white">
                                Featured
                            </Text>
                            {loading ? (
                                <ActivityIndicator
                                    size="small"
                                    color="#2563EB"
                                    className="py-10"
                                />
                            ) : (
                                <FlatList
                                    data={featured}
                                    keyExtractor={(item) => item.id}
                                    renderItem={({ item }) => <FeaturedCard property={item} />}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={{ paddingHorizontal: 20 }}
                                />
                            )}
                        </View>
                        
                        {/* Recommended Header */}
                        <Text className='px-5 mb-4 text-lg font-bold text-gray-900 dark:text-white'>Recommended</Text>
                    </View>
                }
                renderItem={({ item }) => (
                    <View className='px-5'>
                        <PropertyCard property={item} />
                    </View>
                )}
                ListEmptyComponent={
                    !loading ? (
                        <View className='items-center py-10'>
                            <Text className='text-gray-400 dark:text-gray-500'>No properties found.</Text>
                        </View>
                    ) : null
                }
            />
        </SafeAreaView>
    );
}
