import StreakBottomSheet from "@/components/home/streak-bottom-sheet";
import { getStreakSummary } from "@/lib/streak";
import { useStreakQuery } from "@/hooks/queries";
import { createContext, useCallback, useContext, useMemo, useState } from "react";

type StreakContextValue = {
    currentStreak: number;
    showStreak: () => void;
};

const StreakContext = createContext<StreakContextValue | null>(null);

export function StreakProvider({ children }: React.PropsWithChildren) {
    const [visible, setVisible] = useState(false);
    const { data } = useStreakQuery();

    const streak = useMemo(
        () =>
            getStreakSummary(
                (data?.workoutDates ?? []).map((date) => new Date(date)),
            ),
        [data?.workoutDates],
    );
    const showStreak = useCallback(() => setVisible(true), []);
    const hideStreak = useCallback(() => setVisible(false), []);

    return (
        <StreakContext.Provider
            value={{
                currentStreak: streak.currentStreak,
                showStreak,
            }}
        >
            {children}

            <StreakBottomSheet
                bestStreak={streak.bestStreak}
                completedDays={streak.completedDays}
                currentStreak={streak.currentStreak}
                onClose={hideStreak}
                visible={visible}
            />
        </StreakContext.Provider>
    );
}

export function useStreak() {
    const value = useContext(StreakContext);
    if (!value) throw new Error("useStreak must be used inside its provider");
    return value;
}