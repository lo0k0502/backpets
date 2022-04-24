import { useState, useEffect, useCallback, useRef } from 'react';
import * as Location from 'expo-location';
import {
    fetchAllMissions,
    fetchAllPutUpForAdoptions,
    fetchAllReports,
    fetchCluesByMissionId,
    fetchPet,
    fetchPetsByUserId,
    fetchUserById,
    fetchAllPets,
    fetchCluesByUserId,
    fetchPointRecordsByUserId,
    fetchMissionsByUserId,
    fetchMission,
    fetchPutUpForAdoptionsByUserId,
    fetchAdoptionRecordsByUserId,
    fetchAdoptionRecordsByPutUserId,
    fetchPutUpForAdoption,
    fetchAllProducts,
    fetchProductById,
    fetchCouponsByUserId,
} from '../api';
import axios from 'axios';

export const useOnceUpdateEffect = (callback, dependencies) => {
    const isFirst = useRef(true);
    const isSecond = useRef(true);

    useEffect(() => {
        if (isFirst.current) return isFirst.current = false;
        if (!isSecond.current) return;
        if (isSecond.current) isSecond.current = false;

        return callback();
    }, dependencies);
};

export const useUpdateEffect = (callback, firstCallback, dependencies, options) => {
    const isFirst = useRef(true);

    useEffect(() => {
        if (isFirst.current) {
            if (typeof firstCallback === 'function') firstCallback();
            return isFirst.current = false;
        }

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
 * @returns {{ selfMissions: Object[], refreshSelfMissions: Function, isFetchingSelfMissions: boolean }}
 */
export const useSelfMissions = (userId, dependencies = []) => {
    const [missions, setMissions] = useState([]);
    const isMounted = useRef(true);
    const [isFetching, setIsFetching] = useState(false);

    // Fetch missions by userId
    const fetchMissions = async () => {
        if (isMounted.current) setIsFetching(true);

        try {
            const result = await fetchMissionsByUserId(userId);
            if (isMounted.current) setMissions(result.data.result);
        } catch (error) {
            console.log(error);
        }

        if (isMounted.current) setIsFetching(false);
    };

    useEffect(() => {
        isMounted.current = true;

        if (userId) fetchMissions();

        return () => { isMounted.current = false };
    }, [userId, ...dependencies]);

    return {
        selfMissions: missions,
        refreshSelfMissions: fetchMissions,
        isFetchingSelfMissions: isFetching,
    };
};

/**
 * @param {*} missionId 
 * @returns {{
 *  mission: {},
 *  refreshMission: Function,
 *  isFetchingMission: boolean,
 * }}
 */
export const useMission = (missionId) => {
    const [mission, setMission] = useState({});
    const isMounted = useRef(true);
    const [isFetching, setIsFetching] = useState(false);

    // Fetch the mission of this mission id
    const fetchMissionByMissionId = async () => {
        if (isMounted.current) setIsFetching(true);

        try {
            const result = await fetchMission(missionId);
            if (isMounted.current) setMission(result.data.result);
        } catch (error) {
            console.log(error);
        }

        if (isMounted.current) setIsFetching(false);
    };

    useEffect(() => {
        isMounted.current = true;

        if (missionId) fetchMissionByMissionId();

        return () => { isMounted.current = false };
    }, [missionId]);

    return {
        mission,
        refreshMission: fetchMissionByMissionId,
        isFetchingMission: isFetching,
    };
};

/**
 * @param {any} missionId
 * @returns {{
 *  missionClues: {
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
 *  refreshMissionClues: Function,
 *  isFetchingMissionClues: boolean,
 * }}
 */
export const useMissionClues = (missionId, dependencies = []) => {
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

    useEffect(() => {
        isMounted.current = true;

        if (missionId) fetchClues();

        return () => { isMounted.current = false };
    }, [missionId, ...dependencies]);

    return {
        missionClues: clues,
        refreshMissionClues: fetchClues,
        isFetchingMissionClues: isFetching,
    };
};

/**
 * @param {any} userId
 * @returns {{
 *  selfClues: {
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
 *  refreshSelfClues: Function,
 *  isFetchingSelfClues: boolean,
 * }}
 */
export const useSelfClues = (userId, dependencies = []) => {
    const [clues, setClues] = useState([]);
    const isMounted = useRef(true);
    const [isFetching, setIsFetching] = useState(false);

    // Fetch clues by userId
    const fetchClues = async () => {
        if (isMounted.current) setIsFetching(true);

        try {
            const result = await fetchCluesByUserId(userId);
            if (isMounted.current) setClues(result.data.result);
        } catch (error) {
            console.log(error);
        }

        if (isMounted.current) setIsFetching(false);
    };

    useEffect(() => {
        isMounted.current = true;

        if (userId) fetchClues();

        return () => { isMounted.current = false };
    }, [userId, ...dependencies]);

    return {
        selfClues: clues,
        refreshSelfClues: fetchClues,
        isFetchingSelfClues: isFetching,
    };
};

/**
 * @returns {{
 *  allReports: {
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
 *  refreshAllReports: Function,
 *  isFetchingAllReports: boolean,
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
        allReports: reports,
        refreshAllReports: fetchReports,
        isFetchingAllReports: isFetching,
    };
};

/**
 * @returns {{
 *  allPutUpForAdoptions: {
 *      _id: String,
 *      petId: String,
 *      userId: String,
 *      content: String,
 *      post_time: Number,
 *      county: String,
 *      district: String,
 *      phone: String,
 *      completed: Boolean,
 *  }[],
 *  refreshAllPutUpForAdoptions: Function,
 *  isFetchingAllPutUpForAdoptions: boolean,
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
        allPutUpForAdoptions: putUpForAdoptions,
        refreshAllPutUpForAdoptions: fetchPutUpForAdoptions,
        isFetchingAllPutUpForAdoptions: isFetching,
    };
};

/**
 * @param {any} userId
 * @returns {{
 *  selfPutUpForAdoptions: {
 *      _id: String,
 *      petId: String,
 *      userId: String,
 *      content: String,
 *      post_time: Number,
 *      county: String,
 *      district: String,
 *      phone: String,
 *      completed: Boolean,
 *  }[],
 *  refreshSelfPutUpForAdoptions: Function,
 *  isFetchingSelfPutUpForAdoptions: boolean
 * }}
 */
export const useSelfPutUpForAdoptions = (userId, dependencies = []) => {
    const [putUpForAdoptions, setPutUpForAdoptions] = useState([]);
    const isMounted = useRef(true);
    const [isFetching, setIsFetching] = useState(false);

    // Fetch putUpForAdoptions by userId
    const fetchPutUpForAdoptions = async () => {
        if (isMounted.current) setIsFetching(true);

        try {
            const result = await fetchPutUpForAdoptionsByUserId(userId);
            if (isMounted.current) setPutUpForAdoptions(result.data.result);
        } catch (error) {
            console.log(error);
        }

        if (isMounted.current) setIsFetching(false);
    };

    useEffect(() => {
        isMounted.current = true;

        if (userId) fetchPutUpForAdoptions();

        return () => { isMounted.current = false };
    }, [userId, ...dependencies]);

    return {
        selfPutUpForAdoptions: putUpForAdoptions,
        refreshSelfPutUpForAdoptions: fetchPutUpForAdoptions,
        isFetchingSelfPutUpForAdoptions: isFetching,
    };
};

/**
 * @param {any} userId
 * @returns {{
 *  putUpForAdoption: {
 *      _id: String,
 *      petId: String,
 *      userId: String,
 *      content: String,
 *      post_time: Number,
 *      county: String,
 *      district: String,
 *      phone: String,
 *      completed: Boolean,
 *  },
 *  refreshPutUpForAdoption: Function,
 *  isFetchingPutUpForAdoption: boolean
 * }}
 */
export const usePutUpForAdoption = (putUpForAdoptionId, dependencies = []) => {
    const [putUpForAdoption, setPutUpForAdoption] = useState({});
    const isMounted = useRef(true);
    const [isFetching, setIsFetching] = useState(false);

    // Fetch putUpForAdoption by putUpForAdoptionId
    const fetchPutUpForAdoptionById = async () => {
        if (isMounted.current) setIsFetching(true);

        try {
            const result = await fetchPutUpForAdoption(putUpForAdoptionId);
            if (isMounted.current) setPutUpForAdoption(result.data.result);
        } catch (error) {
            console.log(error);
        }

        if (isMounted.current) setIsFetching(false);
    };

    useEffect(() => {
        isMounted.current = true;

        if (putUpForAdoptionId) fetchPutUpForAdoptionById();

        return () => { isMounted.current = false };
    }, [putUpForAdoptionId, ...dependencies]);

    return {
        putUpForAdoption,
        refreshPutUpForAdoption: fetchPutUpForAdoption,
        isFetchingPutUpForAdoption: isFetching,
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
 *  selfPets: {
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
 *  refreshSelfPets: Function,
 *  isFetchingSelfPets: boolean,
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
            if (isMounted.current) setPets(result.data.result);
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
        selfPets: pets,
        refreshSelfPets: fetchSelfPets,
        isFetchingSelfPets: isFetching,
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
    };
};

/**
 * @param {String} userId 
 * @param {any[]} dependencies 
 * @returns {{
 *  selfAdoptionRecords: {
 *      _id: String,
 *      putUpForAdoptionId: String,
 *      userId: String,
 *      petId: String,
 *      time: Number,
 *  }[],
 *  refreshSelfAdoptionRecords: Function,
 *  isFetchingSelfAdoptionRecords: boolean,
 * }}
 */
export const useSelfAdoptionRecords = (userId, dependencies = []) => {
    const [adoptionRecords, setAdoptionRecords] = useState([]);
    const isMounted = useRef(true);
    const [isFetching, setIsFetching] = useState(false);

    const fetchAdoptionRecords = async () => {
        if (isMounted.current) setIsFetching(true);

        try {
            const result = await fetchAdoptionRecordsByUserId(userId);
            if (isMounted.current) setAdoptionRecords(result.data.result);
        } catch (error) {
            console.log(error);
        }

        if (isMounted.current) setIsFetching(false);
    };

    useEffect(() => {
        isMounted.current = true;

        if (userId) fetchAdoptionRecords();

        return () => { isMounted.current = false };
    }, [userId, ...dependencies]);
    
    return {
        selfAdoptionRecords: adoptionRecords,
        refreshAdoptionRecords: fetchAdoptionRecords,
        isFetchingSelfAdoptionRecords: isFetching,
    };
};

/**
 * @param {String} userId 
 * @param {any[]} dependencies 
 * @returns {{
 *  selfPutAdoptionRecords: {
 *      _id: String,
 *      putUpForAdoptionId: String,
 *      userId: String,
 *      petId: String,
 *      time: Number,
 *  }[],
 *  refreshSelfPutAdoptionRecords: Function,
 *  isFetchingSelfPutAdoptionRecords: boolean,
 * }}
 */
export const useSelfPutAdoptionRecords = (userId, dependencies = []) => {
    const [putAdoptionRecords, setPutAdoptionRecords] = useState([]);
    const isMounted = useRef(true);
    const [isFetching, setIsFetching] = useState(false);

    const fetchPutAdoptionRecords = async () => {
        if (isMounted.current) setIsFetching(true);

        try {
            const result = await fetchAdoptionRecordsByPutUserId(userId);
            if (isMounted.current) setPutAdoptionRecords(result.data.result);
        } catch (error) {
            console.log(error);
        }

        if (isMounted.current) setIsFetching(false);
    };

    useEffect(() => {
        isMounted.current = true;

        if (userId) fetchPutAdoptionRecords();

        return () => { isMounted.current = false };
    }, [userId, ...dependencies]);
    
    return {
        selfPutAdoptionRecords: putAdoptionRecords,
        refreshPutAdoptionRecords: fetchPutAdoptionRecords,
        isFetchingSelfPutAdoptionRecords: isFetching,
    };
};

/**
 * @returns {{
 *  allProducts: {
 *      _id: String,
 *      product_name: String,
 *      description: String,
 *      company_name: String,
 *      company_telephone: String,
 *      company_address: String,
 *      photoId: String,
 *      points: Number,
 *  }[],
 *  refreshAllProducts: Function,
 *  isFetchingAllProducts: boolean,
 * }}
 */
export const useProducts = (dependencies = []) => {
    const [products, setProducts] = useState([]);
    const isMounted = useRef(true);
    const [isFetching, setIsFetching] = useState(false);

    // Fetch all products
    const fetchProducts = async () => {
        if (isMounted.current) setIsFetching(true);

        try {
            const result = await fetchAllProducts();
            if (isMounted.current) setProducts(result.data.result);
        } catch (error) {
            console.log(error);
        }

        if (isMounted.current) setIsFetching(false);
    };

    useEffect(() => {
        isMounted.current = true;

        fetchProducts();

        return () => { isMounted.current = false };
    }, [...dependencies]);

    return {
        allProducts: products,
        refreshAllProducts: fetchProducts,
        isFetchingAllProducts: isFetching,
    };
};

/**
 * @param {String} productId
 * @returns {{
 *  product: {
 *      _id: String,
 *      product_name: String,
 *      description: String,
 *      company_name: String,
 *      company_telephone: String,
 *      company_address: String,
 *      photoId: String,
 *      points: Number,
 *  },
 *  isFetchingProduct: boolean,
 * }}
 */
export const useProduct = (productId, dependencies = []) => {
    const [product, setProduct] = useState({});
    const isMounted = useRef(true);
    const [isFetching, setIsFetching] = useState(false);

    // Fetch the product of this product id
    const fetchProduct = async () => {
        if (isMounted.current) setIsFetching(true);

        try {
            const result = await fetchProductById(productId);
            if (isMounted.current) setProduct(result.data.result);
        } catch (error) {
            console.log(error);
        }

        if (isMounted.current) setIsFetching(false);
    };

    useEffect(() => {
        isMounted.current = true;

        if (productId) fetchProduct();

        return () => { isMounted.current = false };
    }, [productId, ...dependencies]);

    return { product, isFetchingProduct: isFetching };
};

/**
 * @returns {{
 *  selfCoupons: {
 *      _id: String,
 *      userId: String,
 *      productId: String,
 *      due_time: Number,
 *      exchanged: Boolean,
 *  }[],
 *  refreshSelfCoupons: Function,
 *  isFetchingSelfCoupons: boolean,
 * }}
 */
export const useSelfCoupons = (userId, dependencies = []) => {
    const [coupons, setCoupons] = useState([]);
    const isMounted = useRef(true);
    const [isFetching, setIsFetching] = useState(false);

    // Fetch coupons by userId
    const fetchSelfCoupons = async () => {
        if (isMounted.current) setIsFetching(true);

        try {
            const result = await fetchCouponsByUserId(userId);
            if (isMounted.current) setCoupons(result.data.result);
        } catch (error) {
            console.log(error);
        }

        if (isMounted.current) setIsFetching(false);
    };

    useEffect(() => {
        isMounted.current = true;

        if (userId) fetchSelfCoupons();

        return () => { isMounted.current = false };
    }, [userId, ...dependencies]);

    return {
        selfCoupons: coupons,
        refreshSelfCoupons: fetchSelfCoupons,
        isFetchingSelfCoupons: isFetching,
    };
};

/**
 * @returns {{ data: {}[], refreshData: Function, isFetchingData: boolean }}
 */
export const useAdoptionData = (dependencies = []) => {
    const [data, setData] = useState([]);
    const isMounted = useRef(true);
    const [isFetching, setIsFetching] = useState(false);

    // Fetch all data
    const fetchData = async () => {
        if (isMounted.current) setIsFetching(true);

        try {
            const result = await axios.get('https://data.coa.gov.tw/Service/OpenData/TransService.aspx?UnitId=QcbUEzN6E6DL');
            if (isMounted.current) setData(result.data);
        } catch (error) {
            console.log(error);
        }

        if (isMounted.current) setIsFetching(false);
    };

    useEffect(() => {
        isMounted.current = true;

        fetchData();

        return () => { isMounted.current = false };
    }, [...dependencies]);

    return {
        data: data,
        refreshData: fetchData,
        isFetchingData: isFetching,
    };
};

export default {
    useUpdateEffect,
    useStateWithValidation,
    useCurrentLocation,
    useMissions,
    useSelfMissions,
    useMission,
    useMissionClues,
    useSelfClues,
    useReports,
    usePutUpForAdoptions,
    usePutUpForAdoption,
    useSelfPutUpForAdoptions,
    useUser,
    usePets,
    useSelfPets,
    usePet,
    useSelfPointRecords,
    useSelfAdoptionRecords,
    useSelfPutAdoptionRecords,
    useProducts,
    useProduct,
    useSelfCoupons,
    useAdoptionData,
};