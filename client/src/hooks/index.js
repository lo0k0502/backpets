import { useState, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';
import { fetchAllMissions, fetchUserById } from '../api';
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
        (async () => {
            let locationResult = await Location.getCurrentPositionAsync({});
            setLocation(locationResult);
        })();
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
 * @returns {{ missions: Object[], refreshMissions: Function }}
 */
export const useMissions = () => {
    const [missions, setMissions] = useState([]);

    const fetchMissions = async () => setMissions((await fetchAllMissions()).data.result);// Fetch all missions

    useFocusEffect(useCallback(() => {
        fetchMissions();
    }, []));

    return {
        missions,
        refreshMissions: fetchMissions,
    };
};

/**
 * @param {String} userId
 * @returns {Object}
 */
export const useUser = (userId) => {
    const [user, setUser] = useState({});

    const fetchUser = async () => setUser((await fetchUserById(userId)).data.result);

    // Fetch the user of this user id
    useEffect(() => {
        fetchUser();
    }, [userId]);

    return user;
};

export default {
    useStateWithValidation,
    useCurrentLocation,
    useMissions,
    useUser,
};