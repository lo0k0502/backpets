import moment from 'moment';
import React from 'react';
import { Avatar, Caption, Divider, List } from 'react-native-paper';
import { SERVERURL } from '../../../api/API';
import { usePet, usePutUpForAdoption, useUser } from '../../../hooks';
import { isEmptyObject } from '../../../utils';
import { Skeleton } from '../Skeleton';

export default ({ selfAdoptionRecord }) => {
    const { putUpForAdoption, isFetchingPutUpForAdoption } = usePutUpForAdoption(selfAdoptionRecord.putUpForAdoptionId);
    const { pet, isFetching: isFetchingPet } = usePet(selfAdoptionRecord.petId);
    const { user, isFetching: isFetchingUser } = useUser(putUpForAdoption.userId);

    return !(
        isFetchingPutUpForAdoption
        || isFetchingPet
        || isFetchingUser
        || isEmptyObject(putUpForAdoption)
        || isEmptyObject(pet)
        || isEmptyObject(user)
    ) ? (
        <>
            <List.Item
                title={`寵物名稱: ${pet.name}`}
                description={`時間: ${moment(selfAdoptionRecord.time).fromNow()} - ${moment(putUpForAdoption.post_time).fromNow()}的送養貼文`}
                disabled
                left={props => (
                    <Avatar.Image
                        {...props}
                        source={{ uri: `${SERVERURL}/image/${pet.photoId}` }}
                        style={{ backgroundColor: 'white' }}
                    />
                )}
                right={props => (
                    <Caption
                        {...props}
                        style={{ alignSelf: 'center' }}
                    >
                        來自{user.username}
                    </Caption>
                )}
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