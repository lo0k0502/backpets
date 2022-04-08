import { useState, useEffect, useCallback, useRef } from 'react';
import * as Location from 'expo-location';
import {
    fetchAllMissions,
    fetchAllPutUpForAdoptions,
    fetchAllReports,
    fetchCluesByMissionId,
    fetchPet,
    fetchPetsByUserId,
    fetchMissionsByPetId,
    fetchUserById,
    fetchAllPets,
    fetchCluesByUserId,
    fetchPointRecordsByUserId,
    fetchClue,
} from '../api';
import { useFocusEffect } from '@react-navigation/core';

export default {
    useUpdateEffect,
    useStateWithValidation,
    useCurrentLocation,
    useMissions,
    useSelfMissions,
    useClues,
    useSelfClues,
    useClue,
    useReports,
    usePutUpForAdoptions,
    useUser,
    usePets,
    useSelfPets,
    useFocusSelfPets,
    usePet,
};

export const useUpdateEffect = (callback, dependencies = []) => {
    const isFirst = useRef(true);

    useEffect(() => {
        if (isFirst.current) return isFirst.current = false;

        return callback();
    }, dependencies);
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
export const useCurrentLocation = (dependencies = []) => {
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
    }, [...dependencies]);
    
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
 * @returns {{ allMissions: Object[], refreshAllMissions: Function, isFetchingAllMissions: boolean }}
 */
export const useMissions = (dependencies = []) => {
    const [missions, setMissions] = useState([]);
    const isMounted = useRef(true);
    const [isFetching, setIsFetching] = useState(false);

    // Fetch all missions
    const fetchMissions = async () => {
        if (isMounted.current) setIsFetching(true);

        try {
            const result = await fetchAllMissions();
            if (isMounted.current) setMissions(result.data.result);
        } catch (error) {
            console.log(error);
        }

        if (isMounted.current) setIsFetching(false);
    };

    useEffect(() => {
        isMounted.current = true;

        fetchMissions();

        return () => { isMounted.current = false };
    }, [...dependencies]);

    return {
        allMissions: missions,
        refreshAllMissions: fetchMissions,
        isFetchingAllMissions: isFetching,
    };
};

/**
 * @param {any} userId
 * @returns {{ missions: Object[], refreshMissions: Function, isFetching: boolean }}
 */
export const useSelfMissions = (userId, dependencies = []) => {
    const { pets } = useFocusSelfPets(userId);
    const [missions, setMissions] = useState([]);
    const isMounted = useRef(true);
    const [isFetching, setIsFetching] = useState(false);

    // Fetch missions by user ID
    const fetchMissions = async () => {
        if (isMounted.current) setIsFetching(true);

        try {
            const result = await pets.reduce(async (previousPromise, pet) => {
                let previous = await previousPromise;

                const fetchedMissions = await fetchMissionsByPetId(pet._id);

                return previous.concat(fetchedMissions.data.result);
            }, Promise.resolve([]));

            if (isMounted.current) setMissions(result);
        } catch (error) {
            console.log(error);
        }

        if (isMounted.current) setIsFetching(false);
    };

    useFocusEffect(useCallback(() => {
        isMounted.current = true;

        if (userId && pets.length) fetchMissions();

        return () => { isMounted.current = false };
    }, [userId, pets, ...dependencies]));

    return {
        missions,
        refreshMissions: fetchMissions,
        isFetching,
    };
};

/**
 * @param {any} missionId
 * @returns {{
 *  clues: {
 *      _id: String,
 *      userId: String,
 *      missionId: String,
 *      content: String,
 *      tag: String,
 *      post_time: Number,
 *      photoId: String,
 *      location: {
 *          latitude: Number,
 *          longitude: Number,
 *      },
 *      awarded: Boolean,
 *      pointsReceived: Boolean,
 *  }[],
 *  refreshClues: Function,
 *  isFetching: boolean,
 * }}
 */
export const useClues = (missionId, dependencies = []) => {
    const [clues, setClues] = useState([]);
    const isMounted = useRef(true);
    const [isFetching, setIsFetching] = useState(false);

    // Fetch clues by mission ID
    const fetchClues = async () => {
        if (isMounted.current) setIsFetching(true);

        try {
            const result = await fetchCluesByMissionId(missionId.toString());
            if (isMounted.current) setClues(result.data.result);
        } catch (error) {
            console.log(error);
        }

        if (isMounted.current) setIsFetching(false);
    };

    useFocusEffect(useCallback(() => {
        isMounted.current = true;

        if (missionId) fetchClues();

        return () => { isMounted.current = false };
    }, [missionId, ...dependencies]));

    return {
        clues,
        refreshClues: fetchClues,
        isFetching,
    };
};

/**
 * @param {any} userId
 * @returns {{
 *  clues: {
 *      _id: String,
 *      userId: String,
 *      missionId: String,
 *      content: String,
 *      tag: String,
 *      post_time: Number,
 *      photoId: String,
 *      location: {
 *          latitude: Number,
 *          longitude: Number,
 *      },
 *      awarded: Boolean,
 *      pointsReceived: Boolean,
 *  }[],
 *  refreshClues: Function,
 *  isFetching: boolean,
 * }}
 */
export const useSelfClues = (userId, dependencies = []) => {
    const [clues, setClues] = useState([]);
    const isMounted = useRef(true);
    const [isFetching, setIsFetching] = useState(false);

    // Fetch clues by user ID
    const fetchClues = async () => {
        if (isMounted.current) setIsFetching(true);

        try {
            const result = await fetchCluesByUserId(userId.toString());
            if (isMounted.current) setClues(result.data.result);
        } catch (error) {
            console.log(error);
        }

        if (isMounted.current) setIsFetching(false);
    };

    useFocusEffect(useCallback(() => {
        isMounted.current = true;

        if (userId) fetchClues();

        return () => { isMounted.current = false };
    }, [userId, ...dependencies]));

    return {
        clues,
        refreshClues: fetchClues,
        isFetching,
    };
};

/**
 * @param {*} clueId 
 * @returns {{
 *  clue: {
 *      _id: String,
 *      userId: String,
 *      missionId: String,
 *      content: String,
 *      tag: String,
 *      post_time: Number,
 *      photoId: String,
 *      location: {
 *          latitude: Number,
 *          longitude: Number,
 *      },
 *      awarded: Boolean,
 *      pointsReceived: Boolean,
 *  },
 *  refreshClue: Function,
 *  isFetching: boolean,
 * }}
 */
export const useClue = (clueId) => {
    const [clue, setClue] = useState({});
    const isMounted = useRef(true);
    const [isFetching, setIsFetching] = useState(false);

    // Fetch the clue of this clue id
    const fetchClueByClueId = async () => {
        if (isMounted.current) setIsFetching(true);

        try {
            const result = await fetchClue(clueId);
            if (isMounted.current) setClue(result.data.result);
        } catch (error) {
            console.log(error);
        }

        if (isMounted.current) setIsFetching(false);
    };

    useEffect(() => {
        isMounted.current = true;

        if (clueId) fetchClueByClueId();

        return () => { isMounted.current = false };
    }, [clueId]);

    return {
        clue,
        refreshClue: fetchClueByClueId,
        isFetching,
    };
};

/**
 * @returns {{
 *  reports: {
 *      _id: String,
 *      userId: String,
 *      content: String,
 *      tag: String,
 *      post_time: Number,
 *      photoId: String,
 *      location: {
 *          latitude: Number,
 *          longitude: Number,
 *      },
 *  }[],
 *  refreshReports: Function,
 *  isFetching: boolean,
 * }}
 */
export const useReports = (dependencies = []) => {
    const [reports, setReports] = useState([]);
    const isMounted = useRef(true);
    const [isFetching, setIsFetching] = useState(false);

    // Fetch all reports
    const fetchReports = async () => {
        if (isMounted.current) setIsFetching(true);

        try {
            const result = await fetchAllReports();
            if (isMounted.current) setReports(result.data.result);
        } catch (error) {
            console.log(error);
        }

        if (isMounted.current) setIsFetching(false);
    };

    useEffect(() => {
        isMounted.current = true;

        fetchReports();

        return () => { isMounted.current = false };
    }, [...dependencies]);

    return {
        reports,
        refreshReports: fetchReports,
        isFetching,
    };
};

/**
 * @returns {{
 *  putUpForAdoptions: {
 *      _id: String,
 *      petId: String,
 *      content: String,
 *      post_time: Number,
 *      location: {
 *          latitude: Number,
 *          longitude: Number,
 *      },
 *  }[],
 *  refreshPutUpForAdoptions: Function,
 *  isFetching: boolean,
 * }}
 */
export const usePutUpForAdoptions = (dependencies = []) => {
    const [putUpForAdoptions, setPutUpForAdoptions] = useState([]);
    const isMounted = useRef(true);
    const [isFetching, setIsFetching] = useState(false);

    // Fetch all putUpForAdoptions
    const fetchPutUpForAdoptions = async () => {
        if (isMounted.current) setIsFetching(true);

        try {
            const result = await fetchAllPutUpForAdoptions();
            if (isMounted.current) {
                setPutUpForAdoptions(result.data.result);
            }
        } catch (error) {
            console.log(error);
        }

        if (isMounted.current) setIsFetching(false);
    };

    useEffect(() => {
        isMounted.current = true;

        fetchPutUpForAdoptions();

        return () => { isMounted.current = false };
    }, [...dependencies]);

    return {
        putUpForAdoptions,
        refreshPutUpForAdoptions: fetchPutUpForAdoptions,
        isFetching,
    };
};

/**
 * @param {String} userId
 * @returns {{
 *  user: {
 *      _id: String,
 *      username: String,
 *      password: String,
 *      email: String,
 *      photoId: String,
 *      points: Number,
 *      couponIds: String[],
 *      searchHistory: String[],
 *      refreshToken: String,
 *      verified: boolean,
 *  },
 *  isFetching: boolean,
 * }}
 */
export const useUser = (userId) => {
    const [user, setUser] = useState({});
    const isMounted = useRef(true);
    const [isFetching, setIsFetching] = useState(false);

    // Fetch the user of this user id
    const fetchTheUser = async () => {
        if (isMounted.current) setIsFetching(true);

        try {
            const result = await fetchUserById(userId);
            if (isMounted.current) setUser(result.data.result);
        } catch (error) {
            console.log(error);
        }

        if (isMounted.current) setIsFetching(false);
    };

    useEffect(() => {
        isMounted.current = true;

        if (userId) fetchTheUser();

        return () => { isMounted.current = false };
    }, [userId]);

    return { user, isFetching };
};

/**
 * @returns {{
 *  pets: {
 *      _id: String,
 *      name: String,
 *      userId: String,
 *      tag: String,
 *      breed: String,
 *      feature: String,
 *      gender: String,
 *      photoId: String,
 *      ligated: boolean,
 *      age: Number,
 *      microchip: String,
 *  }[],
 *  refreshPets: Function,
 *  isFetching: boolean,
 * }}
 */
export const usePets = (dependencies = []) => {
    const [pets, setPets] = useState([]);
    const isMounted = useRef(true);
    const [isFetching, setIsFetching] = useState(false);

    // Fetch all pets
    const fetchPets = async () => {
        if (isMounted.current) setIsFetching(true);

        try {
            const result = await fetchAllPets();
            if (isMounted.current) setPets(result.data.result);
        } catch (error) {
            console.log(error);
        }

        if (isMounted.current) setIsFetching(false);
    };

    useEffect(() => {
        isMounted.current = true;

        fetchPets();

        return () => { isMounted.current = false };
    }, [...dependencies]);

    return {
        pets,
        refreshPets: fetchPets,
        isFetching,
    };
};

/**
 * @returns {{
 *  pets: {
 *      _id: String,
 *      name: String,
 *      userId: String,
 *      tag: String,
 *      breed: String,
 *      feature: String,
 *      gender: String,
 *      photoId: String,
 *      ligated: boolean,
 *      age: Number,
 *      microchip: String,
 *  }[],
 *  refreshPets: Function,
 *  isFetching: boolean,
 * }}
 */
export const useSelfPets = (userId, dependencies = []) => {
    const [pets, setPets] = useState([]);
    const isMounted = useRef(true);
    const [isFetching, setIsFetching] = useState(false);

    // Fetch pets by userId
    const fetchSelfPets = async () => {
        if (isMounted.current) setIsFetching(true);

        try {
            const result = await fetchPetsByUserId(userId);
            if (isMounted.current) {
                setPets(result.data.result);
            }
        } catch (error) {
            console.log(error);
        }

        if (isMounted.current) setIsFetching(false);
    };

    useEffect(() => {
        isMounted.current = true;

        if (userId) fetchSelfPets();

        return () => { isMounted.current = false };
    }, [userId, ...dependencies]);

    return {
        pets,
        refreshPets: fetchSelfPets,
        isFetching,
    };
};

/**
 * @returns {{
 *  pets: {
 *      _id: String,
 *      name: String,
 *      userId: String,
 *      tag: String,
 *      breed: String,
 *      feature: String,
 *      gender: String,
 *      photoId: String,
 *      ligated: boolean,
 *      age: Number,
 *      microchip: String,
 *  }[],
 *  refreshPets: Function,
 *  isFetching: boolean,
 * }}
 */
export const useFocusSelfPets = (userId, dependencies = []) => {
    const [pets, setPets] = useState([]);
    const isMounted = useRef(true);
    const [isFetching, setIsFetching] = useState(false);

    // Fetch pets by userId
    const fetchSelfPets = async () => {
        if (isMounted.current) setIsFetching(true);

        try {
            const result = await fetchPetsByUserId(userId);
            if (isMounted.current) {
                setPets(result.data.result);
            }
        } catch (error) {
            console.log(error);
        }

        if (isMounted.current) setIsFetching(false);
    };

    useFocusEffect(useCallback(() => {
        isMounted.current = true;

        if (userId) fetchSelfPets();

        return () => { isMounted.current = false };
    }, [userId, ...dependencies]));

    return {
        pets,
        refreshPets: fetchSelfPets,
        isFetching,
    };
};

/**
 * @param {String} petId
 * @returns {{
 *  pet: {
 *      _id: String,
 *      name: String,
 *      userId: String,
 *      tag: String,
 *      breed: String,
 *      feature: String,
 *      gender: String,
 *      photoId: String,
 *      ligated: boolean,
 *      age: Number,
 *      microchip: String,
 *  },
 *  isFetching: boolean,
 * }}
 */
export const usePet = (petId, dependencies = []) => {
    const [pet, setPet] = useState({});
    const isMounted = useRef(true);
    const [isFetching, setIsFetching] = useState(false);

    // Fetch the pet of this pet id
    const fetchThePet = async () => {
        if (isMounted.current) setIsFetching(true);

        try {
            const result = await fetchPet(petId);
            if (isMounted.current) setPet(result.data.result);
        } catch (error) {
            console.log(error);
        }

        if (isMounted.current) setIsFetching(false);
    };

    useEffect(() => {
        isMounted.current = true;

        if (petId) fetchThePet();

        return () => { isMounted.current = false };
    }, [petId, ...dependencies]);

    return { pet, isFetching };
};

/**
 * @param {String} userId 
 * @param {any[]} dependencies 
 * @returns {{
 *  pointRecords: {
 *      _id: String,
 *      points: Number,
 *      userId: String?,
 *      missionId: String?,
 *      clueId: String?,
 *      product: String?,
 *      time: Number,
 *  }[],
 *  refreshPointRecords: Function,
 *  isFetching: boolean,
 * }}
 */
export const useSelfPointRecords = (userId, dependencies = []) => {
    const [pointRecords, setPointRecords] = useState([]);
    const isMounted = useRef(true);
    const [isFetching, setIsFetching] = useState(false);

    const fetchPointRecords = async () => {
        if (isMounted.current) setIsFetching(true);

        try {
            const result = await fetchPointRecordsByUserId(userId);
            if (isMounted.current) setPointRecords(result.data.result);
        } catch (error) {
            console.log(error);
        }

        if (isMounted.current) setIsFetching(false);
    };

    useEffect(() => {
        isMounted.current = true;

        if (userId) fetchPointRecords();

        return () => { isMounted.current = false };
    }, [userId, ...dependencies]);
    
    return {
        pointRecords,
        refreshPointRecords: fetchPointRecords,
        isFetching,
    }
};