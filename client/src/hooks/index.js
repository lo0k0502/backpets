import { useState, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';
import { fetchAllPosts, fetchUserById } from '../api';
import { useFocusEffect } from '@react-navigation/core';

/**
 * @param {any} initialValue initial value
 * @param {Function} validationFunction returns true if valid
 * @returns {[any, Function, boolean, boolean]} An array contains state, setState function, is valid boolean and is empty boolean
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
 * @returns {{ location: Object, currentLatitude: number, currentLongitude: number }}
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

export const usePosts = () => {
    const [posts, setPosts] = useState([]);

    const fetchPosts = async () => setPosts((await fetchAllPosts()).data.result);// Fetch all posts

    useFocusEffect(useCallback(() => {
        fetchPosts();
    }, []));

    return {
        posts,
        refreshPosts: fetchPosts,
    };
};

/**
 * @param {Object} post
 * @returns {Object}
 */
export const usePoster = (post) => {
    const [poster, setPoster] = useState({});

    // Fetch the poster of this post
    useEffect(() => {
        (async () => {
            try {
                const res = await fetchUserById(post.userId);
                setPoster(res.data.result);
            } catch (error) {
                console.log('While fetching poster: ', error.response.data.message);
            }
        })()
    }, [post]);

    return poster;
};