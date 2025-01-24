import { useEffect, useState } from "react";



export function useLocalStorageState(initialState, key) {

    const [value, setValue] = useState(function () {
        const storedWatched = localStorage.getItem(key);
        return storedWatched ? JSON.parse(storedWatched) : initialState;
    });

    useEffect(function () {
        localStorage.setItem(key, JSON.stringify(value));
    }, [value,key]);

    return [value, setValue]

}