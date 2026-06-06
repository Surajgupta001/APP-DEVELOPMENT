import { useState } from 'react';
import { ActivityIndicator, Alert, Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { FormState, INITIAL_FORM } from '../../../../types';
import { useRouter } from 'expo-router';
import { useSupabase } from '../../../../hooks/useSupabase';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Toggle } from '@/components/Toggle';
import { Counter } from '@/components/Counter';

const TYPES = ["apartment", "house", "villa", "studio"] as const;

type PropertyType = (typeof TYPES)[number];

const MIN_PRICE = 1;
const MAX_PRICE = 999_999_999;

const inputClass = "bg-white border border-gray-200 rounded-2xl px-4 py-3 text-gray-800";
const labelClass = "text-sm font-semibold text-gray-700 mb-1.5";
const sectionClass = "mb-5";

export default function Create() {

    const router = useRouter();
    const authSupabase = useSupabase();

    const [form, setForm] = useState<FormState>(INITIAL_FORM);

    // Loading states
    const [submitting, setSubmitting] = useState(false);
    const [uploadingImages, setUploadingImages] = useState(false);
    const [detectingLocation, setDetectingLocation] = useState(false);

    const updateForm = (fields: Partial<FormState>) => {
        setForm(prev => ({ ...prev, ...fields }));
    }

    const handlePickImages = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permission.granted) {
            Alert.alert("Permission Denied", "You need to allow access to your photos to upload property images.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'images',
            allowsMultipleSelection: true,
            quality: 0.7,
            base64: true,
            selectionLimit: 6 - form.localImages.length, // Limit to remaining slots
        });

        if (result.canceled) return;

        setUploadingImages(true);

        const uploadUrls: string[] = [];
        const localUris: string[] = [];

        for (const asset of result.assets) {
            try {
                const fileName = `property_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.jpg`;

                const base64 = asset.base64;
                const buffer = Uint8Array.from(atob(base64!), c => c.charCodeAt(0));

                const { error } = await authSupabase.storage
                    .from('property-images')
                    .upload(fileName, buffer, {
                        contentType: 'image/jpeg',
                        upsert: false,
                    });

                if (error) {
                    throw error;
                }

                const { data: urlData } = authSupabase.storage
                    .from('property-images')
                    .getPublicUrl(fileName);

                uploadUrls.push(urlData.publicUrl);
                localUris.push(asset.uri);
            } catch (err) {
                console.error("Image upload error:", err);
                Alert.alert("Upload Failed", "An error occurred while uploading images. Please try again.");
                setUploadingImages(false);
                return;
            }
        }

        updateForm({
            images: [...form.images, ...uploadUrls],
            localImages: [...form.localImages, ...localUris],
        });

        setUploadingImages(false);
    };

    const handleRemoveImage = (index: number) => {
        updateForm({
            images: form.images.filter((_, i) => i !== index),
            localImages: form.localImages.filter((_, i) => i !== index),
        });
    };

    const handleDetectLocation = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert("Permission Denied", "You need to allow location access to detect coordinates.");
                return;
            }

            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Highest
            });

            updateForm({
                latitude: location.coords.latitude.toString(),
                longitude: location.coords.longitude.toString(),
            });

        } catch (err) {
            console.error("Location error:", err);
            Alert.alert("Location Error", "An error occurred while detecting location. Please try again.");
        } finally {
            setDetectingLocation(false);
        }
    };

    const handleSubmit = async () => {
        if (!form.title.trim() || !form.description.trim() || !form.price.trim() || !form.areaSqft.trim() || !form.address.trim() || !form.city.trim()) {
            Alert.alert("Validation Error", "Please fill in all the required fields.");
            return;
        }

        const priceNum = Number(form.price);

        if (isNaN(priceNum) || priceNum < MIN_PRICE || priceNum > MAX_PRICE) {
            Alert.alert("Validation Error", `Price must be a number between ₹${MIN_PRICE} and ₹${MAX_PRICE.toLocaleString("en-IN")}.`);
            return;
        }

        if (!form.address.trim() || !form.city.trim()) {
            Alert.alert("Validation Error", "Address and City are required.");
            return;
        }

        if (form.images.length === 0) {
            Alert.alert("Validation Error", "Please upload at least one image of the property.");
            return;
        }

        setSubmitting(true);

        const { error } = await authSupabase.from("properties").insert({
            title: form.title.trim(),
            description: form.description.trim(),
            price: priceNum,
            type: form.type,
            bedrooms: form.bedrooms,
            bathrooms: form.bathrooms,
            area_sqft: form.areaSqft ? Number(form.areaSqft) : null,
            address: form.address.trim(),
            city: form.city.trim(),
            latitude: form.latitude ? Number(form.latitude) : null,
            longitude: form.longitude ? Number(form.longitude) : null,
            images: form.images,
            is_featured: form.isFeatured,
            is_sold: false,
        });

        setSubmitting(false);

        if (error) {
            console.error("Submission error:", error);
            Alert.alert("Submission Failed", "An error occurred while listing the property. Please try again.");
        }

        setForm(INITIAL_FORM);
        Alert.alert("Success", "Your property has been listed successfully!");
        router.push("/"); // Navigate back to home or listings page
    };

    return (
        <SafeAreaView className='flex-1 bg-gray-50'>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className='flex-1'
            >
                {/* Header */}
                <View className="flex-row items-center px-5 pt-4 pb-3">
                    <Text className="flex-1 text-2xl font-bold text-gray-900">Add Property</Text>
                </View>
                <ScrollView
                    contentContainerStyle={{
                        padding: 20,
                        paddingBottom: 40
                    }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps='handled'
                >
                    {/* Images */}
                    <View className={sectionClass}>
                        <Text>
                            Photos{" "}
                            <Text className="font-normal text-gray-400">(up to 6)</Text>
                        </Text>
                        <View className='flex-row flex-wrap gap-3'>
                            {form.localImages.map((uri, index) => (
                                <View key={index} className='relative'>
                                    <Image
                                        source={{ uri }}
                                        className='w-24 h-24 rounded-2xl'
                                        resizeMode='cover'
                                    />
                                    {index === 0 && (
                                        <View className="absolute top-1 left-1 bg-blue-600 px-1.5 py-0.5 rounded-full">
                                            <Text className="text-white text-[9px] font-bold">COVER</Text>
                                        </View>
                                    )}
                                    <TouchableOpacity
                                        onPress={() => handleRemoveImage(index)}
                                        className="absolute items-center justify-center w-5 h-5 bg-red-500 rounded-full -top-2 -right-2"
                                    >
                                        <Ionicons name="close" size={11} color="white" />
                                    </TouchableOpacity>
                                </View>
                            ))}
                            {form.localImages.length < 6 && (
                                <TouchableOpacity
                                    onPress={handlePickImages}
                                    disabled={uploadingImages}
                                    className="items-center justify-center w-24 h-24 bg-white border-2 border-gray-300 border-dashed rounded-2xl"
                                >
                                    {uploadingImages ? (
                                        <ActivityIndicator size="small" color="#2563EB" />
                                    ) : (
                                        <>
                                            <Ionicons
                                                name="camera-outline"
                                                size={22}
                                                color="#9CA3AF"
                                            />
                                            <Text className="mt-1 text-xs text-gray-400">Add</Text>
                                        </>
                                    )}
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                    {/* Basic Info */}
                    <View className={sectionClass}>
                        <Text className={labelClass}>Title</Text>
                        <TextInput
                            className={inputClass}
                            placeholder="e.g. Modern 3BHK in Bandra"
                            placeholderTextColor="#9CA3AF"
                            value={form.title}
                            onChangeText={(v) => updateForm({ title: v })}
                        />
                    </View>
                    <View className={sectionClass}>
                        <Text className={labelClass}>Description</Text>
                        <TextInput
                            className={`${inputClass} h-24`}
                            placeholder="Describe the property..."
                            placeholderTextColor="#9CA3AF"
                            value={form.description}
                            onChangeText={(v) => updateForm({ description: v })}
                            multiline
                            textAlignVertical="top"
                        />
                    </View>
                    {/* Price */}
                    <View className={sectionClass}>
                        <Text className={labelClass}>Price (₹)</Text>
                        <TextInput
                            className={inputClass}
                            placeholder="e.g. 5000000"
                            placeholderTextColor="#9CA3AF"
                            value={form.price}
                            onChangeText={(v) => updateForm({ price: v })}
                            keyboardType="numeric"
                        />
                        <Text className="text-xs text-gray-400 mt-1.5 ml-1">
                            Valid range: ₹1 – ₹{MAX_PRICE.toLocaleString("en-IN")}
                        </Text>
                    </View>
                    {/* Property Type */}
                    <View className={sectionClass}>
                        <Text className={labelClass}>Property Type</Text>
                        <View className="flex-row flex-wrap gap-2">
                            {TYPES.map((t) => (
                                <TouchableOpacity
                                    key={t}
                                    onPress={() => updateForm({ type: t })}
                                    className={`px-4 py-2 rounded-full border ${form.type === t
                                        ? "bg-blue-600 border-blue-600"
                                        : "bg-white border-gray-200"
                                        }`}
                                >
                                    <Text
                                        className={`text-sm font-semibold capitalize ${form.type === t ? "text-white" : "text-gray-600"
                                            }`}
                                    >
                                        {t}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                    {/* Bedrooms / Bathrooms */}
                    <View className="flex-row gap-4 mb-5">
                        <Counter
                            label="Bedrooms"
                            value={form.bedrooms}
                            onChange={(v) => updateForm({ bedrooms: v })}
                        />
                        <Counter
                            label="Bathrooms"
                            value={form.bathrooms}
                            onChange={(v) => updateForm({ bathrooms: v })}
                        />
                    </View>

                    <View className={sectionClass}>
                        <Text className={labelClass}>Area (sq ft)</Text>
                        <TextInput
                            className={inputClass}
                            placeholder="e.g. 1200"
                            placeholderTextColor="#9CA3AF"
                            value={form.areaSqft}
                            onChangeText={(v) => updateForm({ areaSqft: v })}
                            keyboardType="numeric"
                        />
                    </View>
                    {/* Location */}
                    <View className={sectionClass}>
                        <Text className={labelClass}>Address</Text>
                        <TextInput
                            className={inputClass}
                            placeholder="Street address"
                            placeholderTextColor="#9CA3AF"
                            value={form.address}
                            onChangeText={(v) => updateForm({ address: v })}
                        />
                    </View>

                    <View className={sectionClass}>
                        <Text className={labelClass}>City</Text>
                        <TextInput
                            className={inputClass}
                            placeholder="e.g. Mumbai"
                            placeholderTextColor="#9CA3AF"
                            value={form.city}
                            onChangeText={(v) => updateForm({ city: v })}
                        />
                    </View>
                    {/* Coordinates */}
                    <View className={sectionClass}>
                        <View className="flex-row items-center justify-between mb-1.5">
                            <Text className={labelClass}>Coordinates</Text>
                            <TouchableOpacity
                                onPress={handleDetectLocation}
                                disabled={detectingLocation}
                                className="flex-row items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-full"
                            >
                                {detectingLocation ? (
                                    <ActivityIndicator size="small" color="#2563EB" />
                                ) : (
                                    <Ionicons name="locate-outline" size={13} color="#2563EB" />
                                )}
                                <Text className="text-xs font-semibold text-blue-600">
                                    {detectingLocation ? "Detecting..." : "Detect Location"}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View className="flex-row gap-3">
                            <View className="flex-1">
                                <TextInput
                                    className={inputClass}
                                    placeholder="Latitude"
                                    placeholderTextColor="#9CA3AF"
                                    value={form.latitude}
                                    onChangeText={(v) => updateForm({ latitude: v })}
                                    keyboardType="numeric"
                                />
                            </View>
                            <View className="flex-1">
                                <TextInput
                                    className={inputClass}
                                    placeholder="Longitude"
                                    placeholderTextColor="#9CA3AF"
                                    value={form.longitude}
                                    onChangeText={(v) => updateForm({ longitude: v })}
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>
                    </View>
                    {/* Toggles */}
                    <View className="gap-3 mb-5">
                        <Toggle
                            label="Featured Property"
                            description="Show this in the Featured section on home"
                            value={form.isFeatured}
                            onChange={(v) => updateForm({ isFeatured: v })}
                        />
                    </View>
                    {/* Submit */}
                    <TouchableOpacity
                        onPress={handleSubmit}
                        disabled={submitting || uploadingImages}
                        className="items-center py-4 bg-blue-600 rounded-2xl"
                        style={{
                            shadowColor: "#2563EB",
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.3,
                            shadowRadius: 8,
                            elevation: 4,
                            opacity: submitting || uploadingImages ? 0.7 : 1,
                        }}
                    >
                        {submitting ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-base font-bold text-white">
                                List Property
                            </Text>
                        )}
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};
