import moment from 'moment';
import React from 'react';
import { Caption, Divider, List } from 'react-native-paper';
import { useClue, useMission, usePet, useUser } from '../../../hooks';
import { isEmptyObject } from '../../../utils';

export default ({ pointRecord }) => {
    const { mission, isFetching: isFetchingMission } = useMission(pointRecord.missionId);
    const { user: poster, isFetching: isFetchingPoster } = useUser(mission.userId);
    const { pet, isFetching: isFetchingPet } = usePet(mission.petId);
    const { clue, isFetching: isFetchingClue } = useClue(pointRecord.clueId);

    return (
        !(
            isFetchingMission
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
                right={props => <Caption {...props} style={{ alignSelf: 'center' }}>{`${pointRecord.points > 0 ? '+' : '-'}${Math.abs(pointRecord.points)}`}</Caption>}
            />
            <Divider />
        </>
    ) : null;
};