import moment from 'moment';
import React from 'react';
import { Divider, List } from 'react-native-paper';
import { Skeleton } from '../Skeleton';

export default ({ selfPutAdoptionRecord }) => {

    return (
        false
    ) ? (
        <>
            <List.Item

            />
            <Divider />
        </>
    ) : (
        <>
            <Skeleton mode='item' />
            <Divider />
        </>
    );
};