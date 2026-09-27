import { useSyncExternalStore } from "react";

/**
 * While a login OTP is pending, the root route guard must NOT treat the
 * Better Auth session as "signed in" — signIn.email creates a session before
 * the user has entered their 6-digit code, which would otherwise flip the
 * guard to the (app) group and flash the home screen (or let the user skip
 * OTP entirely by navigating away). This tiny store gates the guard.
 */
let pending = false;
let listeners: (() => void)[] = [];

export const setOtpLoginPending = (value: boolean) => {
    pending = value;
    for (const listener of [...listeners]) {
        listener();
    }
};

const subscribe = (callback: () => void) => {
    listeners.push(callback);
    return () => {
        listeners = listeners.filter((listener) => listener !== callback);
    };
};

const getSnapshot = () => pending;

export const useOtpLoginPending = () => useSyncExternalStore(subscribe, getSnapshot);
