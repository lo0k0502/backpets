import moment from 'moment';
import React, { useContext } from 'react';
import { Avatar, Caption, Divider, List } from 'react-native-paper';
import Context from '../../../context';
import { useClue, usePet, useUser } from '../../../hooks';
import { isEmptyObject } from '../../../utils';
import { Skeleton } from '../Skeleton';

export default ({ pointRecord }) => {
    const { getMissionById, isFetchingAllMissions } = useContext(Context);

    const mission = getMissionById(pointRecord.missionId);

    const { user: poster, isFetching: isFetchingPoster } = useUser(mission.userId);
    const { pet, isFetching: isFetchingPet } = usePet(mission.petId);
    const { clue, isFetching: isFetchingClue } = useClue(pointRecord.clueId);

    return (
        !(
            isFetchingAllMissions
            || isFetchingPoster
            || isFetchingPet
            || isFetchingClue
            || isEmptyObject(mission)
            || isEmptyObject(poster)
            || isEmptyObject(pet)
            || isEmptyObject(clue)
        ) && clue.pointsReceived
    ) ? (
        <>
            <List.Item
                title={pointRecord.productId ? '兌換商品' : `完成任務${poster.username && pet.breed ? ` - ${poster.username}的${pet.breed}` : ''}`}
                description={`時間: ${moment(pointRecord.time).fromNow()}`}
                disabled
                left={props => <Avatar.Icon {...props} icon={pointRecord.productId ? 'shopping-outline' : 'text-box-check-outline'} style={{ backgroundColor: 'white' }} />}
                right={props => <Caption {...props} style={{ alignSelf: 'center' }}>{`${pointRecord.points > 0 ? '+' : '-'}${Math.abs(pointRecord.points)}`}</Caption>}
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