import { useEffect, useRef, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, Alert } from 'react-native'
import { CameraView, useCameraPermissions } from 'expo-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { AI_GRADIENT, COLORS } from '../../constants/theme';
import GradientIconButton from './GradientIconButton';
import * as ImagePicker from 'expo-image-picker';


interface ReceiptScannerModalProps {
    visible: boolean;
    onClose: () => void;
    onCaptured: (base64: string, mimType: string) => void;
};

export default function ReceiptScannerModal({ visible, onClose, onCaptured }: ReceiptScannerModalProps) {

    const cameraRef = useRef<CameraView>(null);
    const [permission, requestPermission] = useCameraPermissions();
    const [capturing, setCapturing] = useState(false);

    useEffect(() => {
        if (visible && !permission?.granted) {
            requestPermission();
        }
    }, [visible, permission?.granted, requestPermission]);

    const handlecapture = async () => {
        if (!cameraRef.current || capturing) return;
        setCapturing(true);

        try {
            const photo = await cameraRef.current.takePictureAsync({
                base64: true,
                quality: 0.8,
            });

            if (photo?.base64) {
                onCaptured(photo.base64, 'image/jpeg');
            }
        } catch (error) {
            console.error('Error capturing photo:', error);
        } finally {
            setCapturing(false);
        }
    };

    const handlePickFromLibrary = async () => {
        const libraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!libraryPermission.granted) {
            Alert.alert('Permission Denied', 'Please grant media library access to pick an image.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            base64: true,
            quality: 0.7,
        });

        if (result.canceled) return;

        const asset = result.assets[0];
        if (asset.base64) {
            onCaptured(asset.base64, asset.mimeType ?? 'image/jpeg');
        }
    };

    return (
        <Modal
            visible={visible}
            animationType='slide'
        >
            <View className='flex-1 bg-black'>
                {permission?.granted && (
                    <CameraView
                        ref={cameraRef}
                        style={{ flex: 1 }}
                        facing='back'
                    />
                )}
                {/* Scan-frame overlay */}
                <View className="absolute inset-0 items-center justify-center px-10">
                    <View
                        className="w-full aspect-[3/4] rounded-2xl border-2 border-white/70"
                        style={{ borderStyle: "dashed" }}
                    />
                </View>
                <SafeAreaView
                    className='absolute inset-0'
                    edges={['top', 'bottom']}
                >
                    <View className='flex-row items-center justify-between px-3 pt-3'>
                        <TouchableOpacity
                            onPress={onClose}
                            className="items-center justify-center w-10 h-10 rounded-full bg-black/40"
                        >
                            <Feather name="x" size={18} color="#fff" />
                        </TouchableOpacity>
                        <View className="flex-row items-center gap-1.5 bg-black/40 rounded-full px-3 py-1.5">
                            <MaterialCommunityIcons
                                name="robot-outline"
                                size={12}
                                color={COLORS.teal}
                            />
                            <Text className="text-white text-[11px] font-medium">
                                Align the receipt
                            </Text>
                        </View>
                        <View className="w-10 h-10" />
                    </View>
                    <View className="flex-1" />
                    <View className="flex-row items-center justify-between px-10 pb-6">
                        <TouchableOpacity
                            onPress={handlePickFromLibrary}
                            disabled={capturing}
                            className="items-center justify-center w-12 h-12 rounded-full bg-black/40"
                        >
                            <Feather name="image" size={18} color="#fff" />
                        </TouchableOpacity>

                        <GradientIconButton
                            icon="camera"
                            colors={[AI_GRADIENT[1], AI_GRADIENT[0]]}
                            size={72}
                            iconSize={26}
                            loading={capturing}
                            disabled={!permission?.granted}
                            borderColor="rgba(255,255,255,0.85)"
                            onPress={handlecapture}
                        />
                        <View className="w-12 h-12" />
                    </View>
                </SafeAreaView>
                {!permission?.granted && permission?.canAskAgain === false && (
                    <View className="absolute inset-0 items-center justify-center px-10 bg-black/80">
                        <Feather name="camera-off" size={32} color="#8A8D96" />
                        <Text className="mt-3 text-sm text-center text-white/70">
                            Camera access is off. Enable it in Settings to scan receipts.
                        </Text>
                        <TouchableOpacity onPress={onClose} className="mt-6">
                            <Text className="text-sm font-medium text-white">Close</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </Modal>
    )
}