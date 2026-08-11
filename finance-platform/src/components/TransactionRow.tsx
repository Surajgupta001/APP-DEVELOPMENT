import { View, Text } from 'react-native'
import React from 'react'
import { Transaction } from '../../types'

interface TransactionRowProps {
    tx: Transaction,
    onDelete?: () => void
};

export default function TransactionRow({ tx, onDelete }: TransactionRowProps) {
    return (
        <View>
            <Text>TransactionRow</Text>
        </View>
    )
}