import { useState, useEffect, Dispatch, SetStateAction } from 'react';

// Fix: Import Dispatch and SetStateAction from react to resolve "Cannot find namespace 'React'" error.
function usePersistentState<T>(key: string, initialValue: T, reviver?: (key: string, value: any) => any): [T, Dispatch<SetStateAction<T>>] {
    const [state, setState] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            if (item) {
                return JSON.parse(item, reviver);
            }
        } catch (error) {
            console.error(`Error reading localStorage key “${key}”:`, error);
        }
        return initialValue;
    });

    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(state));
        } catch (error) {
            console.error(`Error setting localStorage key “${key}”:`, error);
        }
    }, [key, state]);

    return [state, setState];
}

export default usePersistentState;
