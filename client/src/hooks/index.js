import { useState, useEffect, useCallback, useRef } from 'react';
import * as Location from 'expo-location';
import { fetchAllMissions, fetchCluesByMission, fetchSelfMissions, fetchUserById } from '../api';
import { useFocusEffect } from '@react-navigation/core';

/**
 * @param {any} initialValue initial value
 * @param {Function} validationFunction returns true if valid
 * @returns {[any, Function, Boolean, Boolean]} An array contains state, setState function, is valid boolean and is empty boolean
 */
export const useStateWithValidation = (initialValue, validationFunction = state => !!state) => {
    const [state, setState] = useState(initialValue);
    const [isValid, setIsValid] = useState(true);
    const [isEmpty, setIsEmpty] = useState(false);

    const changeState = useCallback(nextState => {
        const value = typeof nextState === 'function' ? nextState(state) : nextState;
        setState(value);
        setIsValid(validationFunction(value));
        setIsEmpty(!value);
    }, [validationFunction]);

    return [state, changeState, isValid, isEmpty];
};

/**
 * @returns {{ location: Location.LocationObject, currentLatitude: Number, currentLongitude: Number }}
 */
export const useCurrentLocation = () => {
    const [location, setLocation] = useState(null);
    let currentLatitude = 0;
    let currentLongitude = 0;
  
    useEffect(() => {
        let isMounted = true;

        (async () => {
            let locationResult = await Location.getCurrentPositionAsync({});
            if (isMounted) setLocation(locationResult);
        })();

        return () => { isMounted = false };
    }, []);
    
    if (location) {
        currentLatitude = location.coords.latitude;
        currentLongitude = location.coords.longitude;
    }

    return {
        location,
        currentLatitude,
        currentLongitude,
    };
};

/**
 * @param {any} userId If provided, it will fetch missions by this user ID, if not, all missions will be fetched.
 * @returns {{ missions: Object[], refreshMissions: Function, isFetching: boolean }}
 */
export const useMissions = (userId) => {
    const [missions, setMissions] = useState([]);
    const isMounted = useRef(true);
    const [isFetching, setIsFetching] = useState(false);

    // Fetch all missions
    const fetchMissions = async () => {
        setIsFetching(true);

        const result = userId ? (await fetchSelfMissions(userId)) : (await fetchAllMissions());
        if (isMounted.current) {
            setMissions(result.data.result);
            setIsFetching(false);
        }
    };

    useFocusEffect(useCallback(() => {
        isMounted.current = true;

        fetchMissions();

        return () => { isMounted.current = false };
    }, [userId]));

    return {
        missions,
        refreshMissions: fetchMissions,
        isFetching,
    };
};

/**
 * @param {any} missionId
 * @returns {{ clues: Object[], refreshClues: Function, isFetching: boolean }}
 */
export const useClues = (missionId) => {
    const [clues, setClues] = useState([]);
    const isMounted = useRef(true);
    const [isFetching, setIsFetching] = useState(false);

    // Fetch all clues
    const fetchClues = async () => {
        setIsFetching(true);
        
        const result = await fetchCluesByMission(missionId);
        if (isMounted.current) {
            setClues(result.data.result);
            setIsFetching(false);
        }
    };

    useFocusEffect(useCallback(() => {
        isMounted.current = true;

        fetchClues();

        return () => { isMounted.current = false };
    }, [missionId]));

    return {
        clues,
        refreshClues: fetchClues,
        isFetching,
    };
};

/**
 * @param {String} userId
 * @returns {Object}
 */
export const useUser = (userId) => {
    const [user, setUser] = useState({});

    // Fetch the user of this user id
    useEffect(() => {
        let isMounted = true;

        (async () => {
            const result = await fetchUserById(userId);
            if (isMounted) setUser(result.data.result);
        })();

        return () => { isMounted = false };
    }, [userId]);

    return user;
};

export default {
    useStateWithValidation,
    useCurrentLocation,
    useMissions,
    useUser,
};