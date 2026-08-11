import { View, Text, Modal, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native'
import React from 'react'

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
                <View className='px-5 pt-5 pb-8 bg-brand-body rounded-t-2xl'>
                    <Text className='mb-4 text-base font-semibold text-brand-bg'>{title}</Text>
                </View>
                {children}
                <TouchableOpacity onPress={onClose} className='items-center py-2'>
                    <Text className='text-sm text-brand-text-secondary'>Cancel</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </Modal>
    )
}