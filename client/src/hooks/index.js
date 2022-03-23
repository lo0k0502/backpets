import { useState, useEffect, useCallback, useRef } from 'react';
import * as Location from 'expo-location';
import { fetchAllMissions, fetchAllPutUpForAdoptions, fetchAllReports, fetchCluesByMission, fetchMission, fetchPetsByUserId, fetchSelfMissions, fetchUserById } from '../api';
import { useFocusEffect } from '@react-navigation/core';

export default {
    useStateWithValidation,
    useCurrentLocation,
    useMissions,
    useSelfMissions,
    useClues,
    useReports,
    usePutUpForAdoptions,
    useUser,
    useSelfPets,
};

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
 * @returns {{ missions: Object[], refreshMissions: Function, isFetching: boolean }}
 */
export const useMissions = () => {
    const [missions, setMissions] = useState([]);
    const isMounted = useRef(true);
    const [isFetching, setIsFetching] = useState(false);

    // Fetch all missions
    const fetchMissions = async () => {
        setIsFetching(true);

        try {
            const result = await fetchAllMissions();
            if (isMounted.current) {
                setMissions(result.data.result);
            }
        } catch (error) {
            console.log(error);
        }

        setIsFetching(false);
    };

    useFocusEffect(useCallback(() => {
        isMounted.current = true;

        fetchMissions();

        return () => { isMounted.current = false };
    }, []));

    return {
        missions,
        refreshMissions: fetchMissions,
        isFetching,
    };
};

/**
 * @param {any} userId
 * @returns {{ missions: Object[], refreshMissions: Function, isFetching: boolean }}
 */
export const useSelfMissions = (userId) => {
    const [missions, setMissions] = useState([]);
    const isMounted = useRef(true);
    const [isFetching, setIsFetching] = useState(false);

    // Fetch missions by user ID
    const fetchMissions = async () => {
        if (!userId) return;

        setIsFetching(true);

        try {
            const result = await fetchSelfMissions(userId);
            if (isMounted.current) {
                setMissions(result.data.result);
            }
        } catch (error) {
            console.log(error);
        }

        setIsFetching(false);
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
 * @param {*} missionId 
 * @returns {Object}
 */
export const useMission = (missionId) => {
    const [mission, setMission] = useState({});

    // Fetch the mission of this mission id
    useEffect(() => {
        let isMounted = true;

        (async () => {
            const result = await fetchMission(missionId);
            if (isMounted) setMission(result.data.result);
        })();

        return () => { isMounted = false };
    }, [missionId]);

    return mission;
};

/**
 * @param {any} missionId
 * @returns {{ clues: Object[], refreshClues: Function, isFetching: boolean }}
 */
export const useClues = (missionId) => {
    const [clues, setClues] = useState([]);
    const isMounted = useRef(true);
    const [isFetching, setIsFetching] = useState(false);

    // Fetch clues by mission ID
    const fetchClues = async () => {
        if (!missionId) return;

        setIsFetching(true);

        try {
            const result = await fetchCluesByMission(missionId.toString());
            if (isMounted.current) {
                setClues(result.data.result);
            }
        } catch (error) {
            console.log(error);
        }

        setIsFetching(false);
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
 * @returns {{ reports: Object[], refreshReports: Function, isFetching: boolean }}
 */
export const useReports = () => {
    const [reports, setReports] = useState([]);
    const isMounted = useRef(true);
    const [isFetching, setIsFetching] = useState(false);

    // Fetch all reports
    const fetchReports = async () => {
        setIsFetching(true);

        try {
            const result = await fetchAllReports();
            if (isMounted.current) {
                setReports(result.data.result);
            }
        } catch (error) {
            console.log(error);
        }

        setIsFetching(false);
    };

    useFocusEffect(useCallback(() => {
        isMounted.current = true;

        fetchReports();

        return () => { isMounted.current = false };
    }, []));

    return {
        reports,
        refreshReports: fetchReports,
        isFetching,
    };
};

/**
 * @returns {{ putUpForAdoptions: Object[], refreshPutUpForAdoptions: Function, isFetching: boolean }}
 */
export const usePutUpForAdoptions = () => {
    const [putUpForAdoptions, setPutUpForAdoptions] = useState([]);
    const isMounted = useRef(true);
    const [isFetching, setIsFetching] = useState(false);

    // Fetch all putUpForAdoptions
    const fetchPutUpForAdoptions = async () => {
        setIsFetching(true);

        try {
            const result = await fetchAllPutUpForAdoptions();
            if (isMounted.current) {
                setPutUpForAdoptions(result.data.result);
            }
        } catch (error) {
            console.log(error);
        }

        setIsFetching(false);
    };

    useFocusEffect(useCallback(() => {
        isMounted.current = true;

        fetchPutUpForAdoptions();

        return () => { isMounted.current = false };
    }, []));

    return {
        putUpForAdoptions,
        refreshPutUpForAdoptions: fetchPutUpForAdoptions,
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

/**
 * @returns {{ pets: Object[], refreshPets: Function, isFetching: boolean }}
 */
export const useSelfPets = (userId) => {
    const [pets, setPets] = useState([]);
    const isMounted = useRef(true);
    const [isFetching, setIsFetching] = useState(false);

    // Fetch all pets
    const fetchSelfPets = async () => {
        setIsFetching(true);

        try {
            const result = await fetchPetsByUserId(userId);
            if (isMounted.current) {
                setPets(result.data.result);
            }
        } catch (error) {
            console.log(error);
        }

        setIsFetching(false);
    };

    useFocusEffect(useCallback(() => {
        isMounted.current = true;

        fetchSelfPets();

        return () => { isMounted.current = false };
    }, [userId]));

    return {
        pets,
        refreshPets: fetchSelfPets,
        isFetching,
    };
};