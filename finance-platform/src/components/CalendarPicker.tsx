import { View, Text } from 'react-native'
import DateTimePicker, { useDefaultStyles } from "react-native-ui-datepicker";

interface CalendarPickerProps {
    value: Date;
    onChange: (date: Date) => void;
    maximumDate?: Date;
};

export default function CalendarPicker({ value, onChange, maximumDate }: CalendarPickerProps) {

    const defaultStyles = useDefaultStyles("light");

    return (
        <DateTimePicker
            mode="single"
            date={value}
            maxDate={maximumDate}
            onChange={({ date }) =>
                date && onChange(new Date(date as string | number | Date))
            }
            styles={{
                ...defaultStyles,
                today: { borderWidth: 1, borderColor: "#1A1D26" },
            }}
        />
    );
}