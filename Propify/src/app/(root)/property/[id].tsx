import { ActivityIndicator, Alert, Dimensions, FlatList, Image, Linking, NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '@clerk/expo';
import { useUserStore } from '../../../../store/userStore';
import { Property } from '../../../../types';
import { useSupabase } from '../../../../hooks/useSupabase';
import { supabase } from '../../../../lib/supabase';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSavedProperty } from '../../../../hooks/useSavedProperty';
import { formatPrice } from '../../../../lib/utils';
import WebView from 'react-native-webview';
import ImageViewing from 'react-native-image-viewing';

const { width } = Dimensions.get("window");

const admin_phone = process.env.ADMIN_PHONE!;

export default function PropertyDetails() {

    const { id } = useLocalSearchParams<{ id: string }>();
    const { userId } = useAuth();
    const router = useRouter();
    const isAdmin = useUserStore((state) => state.isAdmin);

    const [property, setProperty] = useState<Property | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);
    const [imageViewerVisible, setImageViewerVisible] = useState(false);
    const [expanded, setExpanded] = useState(false);

    const authSupabase = useSupabase();
    const { isSaved, saveLoading, toggleSave } = useSavedProperty({ propertyId: id ?? '' });

    const fetchProperty = async () => {
        const { data } = await supabase
            .from("properties")
            .select("*")
            .eq("id", id)
            .single();

        setProperty(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchProperty();
    }, [id]);

    const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const index = Math.round(e.nativeEvent.contentOffset.x / width);
        setActiveIndex(index);
    };

    const handleContact = () => {
        const message = `Hi! I'm interested in the property: ${property?.title}`;
        const url = `https://wa.me/${admin_phone}?text=${encodeURIComponent(
            message
        )}`;
        Linking.openURL(url);
    };

    const handleMarkSold = async () => {
        Alert.alert('Mark as Sold', 'Are you sure?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Yes, Mark Sold',
                style: 'destructive',
                onPress: async () => {
                    await authSupabase
                        .from("properties")
                        .update({ is_sold: true })
                        .eq("id", id);
                    setProperty((prev) => prev ? { ...prev, is_sold: true } : prev);
                },
            },
        ]);
    };

    const handleDelete = async () => {
        Alert.alert('Delete Property', 'Are you sure?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Yes, Delete',
                style: 'destructive',
                onPress: async () => {
                    await authSupabase
                        .from("properties")
                        .delete()
                        .eq("id", id);
                    router.replace("/");
                },
            },
        ]);
    };

    if (loading) {
        return (
            <View className="items-center justify-center flex-1 bg-white">
                <ActivityIndicator size="large" color="#0E4D92" />
            </View>
        );
    }

    if (!property) {
        return (
            <View className="items-center justify-center flex-1 bg-white">
                <Text className="text-gray-500">Property not found</Text>
            </View>
        );
    };

    const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${property.longitude - 0.003
        }%2C${property.latitude - 0.003}%2C${property.longitude + 0.003}%2C${property.latitude + 0.003
        }&layer=mapnik&marker=${property.latitude}%2C${property.longitude}`;

    const isLongDesc = (property.description?.length ?? 0) > 150;
    const displayDesc = expanded || !isLongDesc ? property.description : `${property.description?.slice(0, 150)}...`;

    return (
        <View className="flex-1 bg-white">
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Image Carousel */}
                <View>
                    <View style={{
                        opacity: property.is_sold ? 0.5 : 1
                    }}>
                        <FlatList
                            data={property.images}
                            keyExtractor={(_, i) => i.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => setImageViewerVisible(true)}
                                >
                                    <Image
                                        source={{ uri: item }}
                                        style={{ width, height: 300 }}
                                        resizeMode="cover"
                                    />
                                </TouchableOpacity>
                            )}
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            onScroll={onScroll}
                            scrollEventThrottle={16}
                        />
                    </View>

                    {/* Image count badge */}
                    <View className="absolute px-3 py-1 rounded-full bottom-3 right-4 bg-black/50">
                        <Text className="text-xs font-medium text-white">
                            {activeIndex + 1}/{property.images.length}
                        </Text>
                    </View>

                    {/* Dot indicators */}
                    {property.images.length > 1 && (
                        <View className="absolute left-0 right-0 flex-row justify-center gap-1 bottom-3">
                            {property.images.map((_, i) => (
                                <View
                                    key={i}
                                    className={`h-1.5 rounded-full ${i === activeIndex ? "w-4 bg-white" : "w-1.5 bg-white/50"
                                        }`}
                                />
                            ))}
                        </View>
                    )}

                    {/* Back + Save buttons */}
                    <SafeAreaView className="absolute top-0 left-0 right-0">
                        <View className="flex-row items-center justify-between px-4 pt-2">
                            <TouchableOpacity
                                onPress={() => router.back()}
                                className="items-center justify-center w-10 h-10 bg-white rounded-full"
                                style={{
                                    elevation: 3
                                }}
                            >
                                <Ionicons name="arrow-back" size={20} color="#111827" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={toggleSave}
                                disabled={saveLoading}
                                className="items-center justify-center w-10 h-10 bg-white rounded-full"
                                style={{
                                    elevation: 3
                                }}
                            >
                                <Ionicons
                                    name={isSaved ? "heart" : "heart-outline"}
                                    size={20}
                                    color={isSaved ? "#EF4444" : "#111827"}
                                />
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>
                </View>

                {/* Content */}
                <View
                    className="px-5 pt-5 pb-8"
                    style={{
                        opacity: property.is_sold ? 0.6 : 1
                    }}
                >
                    {/* Badges */}
                    <View className="flex-row flex-wrap gap-2 mb-3">
                        <View className="px-3 py-1 rounded-full bg-blue-50">
                            <Text className="text-xs font-semibold text-blue-600 capitalize">
                                {property.type}
                            </Text>
                        </View>
                        {property.is_featured && (
                            <View className="px-3 py-1 rounded-full bg-amber-50">
                                <Text className="text-xs font-semibold text-amber-600">
                                    ⭐ Featured
                                </Text>
                            </View>
                        )}
                        {property.is_sold && (
                            <View className="px-3 py-1 rounded-full bg-red-50">
                                <Text className="text-xs font-semibold text-red-500">Sold</Text>
                            </View>
                        )}
                    </View>

                    {/* Title + Price */}
                    <Text className="mb-1 text-2xl font-bold text-gray-900">
                        {property.title}
                    </Text>
                    <Text className="mb-4 text-xl font-bold text-primary">
                        {formatPrice(property.price)}
                    </Text>

                    {/* Specs Row */}
                    <View className="flex-row justify-between p-4 mb-5 bg-gray-50 rounded-2xl">
                        <SpecItem
                            icon="bed-outline"
                            label="Beds"
                            value={`${property.bedrooms}`}
                        />
                        <SpecItem
                            icon="water-outline"
                            label="Baths"
                            value={`${property.bathrooms}`}
                        />
                        <SpecItem
                            icon="expand-outline"
                            label="Area"
                            value={`${property.area_sqft} ft²`}
                        />
                        <SpecItem icon="home-outline" label="Type" value={property.type} />
                    </View>

                    {/* Description */}
                    <Text className="mb-2 text-base font-bold text-gray-900">
                        Description
                    </Text>
                    <Text className="mb-1 text-sm leading-6 text-gray-500">
                        {displayDesc}
                    </Text>
                    {isLongDesc && (
                        <TouchableOpacity
                            onPress={() => setExpanded(!expanded)}
                        >
                            <Text className="mb-5 text-sm font-medium text-primary">
                                {expanded ? "Show less" : "Read more"}
                            </Text>
                        </TouchableOpacity>
                    )}

                    <View className="mb-5" />

                    {/* Location */}
                    <Text className="mb-2 text-base font-bold text-gray-900">
                        Location
                    </Text>
                    <View className="flex-row items-center gap-2 mb-4">
                        <Ionicons name="location-outline" size={16} color="#6B7280" />
                        <Text className="flex-1 text-sm text-gray-500">
                            {property.address}, {property.city}
                        </Text>
                    </View>

                    {/* Map Preview */}
                    <TouchableOpacity
                        onPress={() =>
                            router.push({
                                pathname: "/property/map",
                                params: {
                                    latitude: property.latitude,
                                    longitude: property.longitude,
                                    title: property.title,
                                    address: `${property.address}, ${property.city}`,
                                },
                            })
                        }
                        activeOpacity={0.9}
                        className="mb-6 overflow-hidden rounded-2xl"
                        style={{ height: 200 }}
                    >
                        <WebView
                            source={{ uri: mapUrl }}
                            style={{ flex: 1 }}
                            scrollEnabled={false}
                            pointerEvents="none"
                        />
                        <View className="absolute flex-row items-center gap-1 px-3 py-1 rounded-full bottom-3 right-3 bg-white/90">
                            <Ionicons name="expand-outline" size={12} color="#374151" />
                            <Text className="text-xs font-medium text-gray-600">
                                Tap to expand
                            </Text>
                        </View>
                    </TouchableOpacity>

                    {/* Contact Button */}
                    <TouchableOpacity
                        onPress={handleContact}
                        className="flex-row items-center justify-center gap-2 py-4 mb-4 bg-primary rounded-2xl"
                    >
                        <Ionicons name="logo-whatsapp" size={20} color="white" />
                        <Text className="text-base font-bold text-white">
                            Contact Agent
                        </Text>
                    </TouchableOpacity>

                    {/* Admin Actions */}
                    {isAdmin && (
                        <View className="flex-row gap-3">
                            {!property.is_sold && (
                                <TouchableOpacity
                                    onPress={handleMarkSold}
                                    className="flex-row items-center justify-center flex-1 gap-2 py-4 border bg-amber-50 rounded-2xl border-amber-200"
                                >
                                    <Ionicons
                                        name="checkmark-circle-outline"
                                        size={18}
                                        color="#D97706"
                                    />
                                    <Text className="font-semibold text-amber-600">
                                        Mark Sold
                                    </Text>
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity
                                onPress={handleDelete}
                                className="flex-row items-center justify-center flex-1 gap-2 py-4 border border-red-100 bg-red-50 rounded-2xl"
                            >
                                <Ionicons name="trash-outline" size={18} color="#EF4444" />
                                <Text className="font-semibold text-red-500">Delete</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Image Viewer */}
            <ImageViewing
                images={property.images.map((uri) => ({ uri }))}
                imageIndex={activeIndex}
                visible={imageViewerVisible}
                onRequestClose={() => setImageViewerVisible(false)}
            />
        </View>
    );
};

interface Props {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    value: string;
};

function SpecItem({ icon, label, value }: Props) {
    return (
        <View className="items-center gap-1">
            <Ionicons name={icon} size={20} color="#0E4D92" />
            <Text className="text-sm font-bold text-gray-900">{value}</Text>
            <Text className="text-xs text-gray-400">{label}</Text>
        </View>
    );
};