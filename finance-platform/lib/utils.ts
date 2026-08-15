import { eachDayOfInterval, format, startOfDay, startOfMonth } from "date-fns";
import { Transaction } from "../types";
import { Directory, File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export const formatPrice = (value: number, currency: string = "INR"): string => {
    const locale = currency === "INR" ? "en-IN" : undefined;

    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
    }).format(value);
};

export function dayKey(date: Date) {
    return format(date, 'yyyy-MM-dd');
};

export function currentMonthDays() {
    const today = startOfDay(new Date());
    return eachDayOfInterval({
        start: startOfMonth(today),
        end: today,
    }).map((d) => ({
        key: dayKey(d),
        label: format(d, 'd MMM'),
    }))
};

const EXPORT_WINDOW_DAYS = 30;

function toScvCell(value: string | number | null) {
    if (value === null) return '';
    const str = String(value);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
};

function buildCsvContent(transactions: Transaction[]) {
    const header = [
        'Date',
        'Type',
        'Category',
        'Description',
        'Amount',
        'Input Method',
    ];

    const rows = transactions.map((tx) => [
        format(new Date(tx.date), 'yyyy-MM-dd'),
        tx.type,
        tx.category,
        tx.description ?? '',
        tx.amount,
        tx.input_method,
    ]);

    return [header, ...rows]
        .map((row) => row.map(toScvCell).join(','))
        .join('\n');
};

export async function exportTransactionsToCSV(transactions: Transaction[]) {
    const cutOff = new Date();
    cutOff.setDate(cutOff.getDate() - EXPORT_WINDOW_DAYS);

    const recentTransactions = transactions.filter((tx) => new Date(tx.date) >= cutOff);

    const csv = buildCsvContent(recentTransactions);

    const fileName = `transactions_${format(new Date(), 'yyyyMMdd_HHmmss')}.csv`;

    const file = new File(new Directory(Paths.cache), fileName);
    if (file.exists) file.delete();
    file.create();
    file.write(csv);
    
    if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(file.uri, {
            mimeType: 'text/csv',
            dialogTitle: 'Share Transactions CSV',
            UTI: 'public.comma-separated-values-text',
        });
    }

    return {
        count: recentTransactions.length,
        uri: file.uri,
    };
};