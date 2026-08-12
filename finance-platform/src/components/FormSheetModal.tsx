import React from 'react';
import { KeyboardAvoidingView, Modal, Platform, Text, TouchableOpacity, View } from 'react-native';

interface FormSheetModalProps {
    visible: boolean;
    title: string;
    onClose: () => void;
    children: React.ReactNode;
};

export default function FormSheetModal({ visible, title, onClose, children }: FormSheetModalProps) {
    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                className='justify-end flex-1 bg-black/40'
            >
                <View className='bg-brand-body rounded-t-[28px] px-5 pt-5 pb-6'>
                    <Text className='mb-4 text-[28px] font-semibold text-brand-bg'>{title}</Text>
                    {children}
                    <TouchableOpacity onPress={onClose} className='items-center py-2 mt-2'>
                        <Text className='text-sm text-brand-text-secondary'>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    )
}