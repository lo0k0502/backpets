import moment from 'moment';
import React from 'react';
import { Caption, Divider, List } from 'react-native-paper';
import { useMission, usePet, useUser } from '../../../hooks';
import { isEmptyObject } from '../../../utils';

export default ({ pointRecord }) => {
    const { mission, isFetching: isFetchingMission } = useMission(pointRecord.missionId);
    const { user: poster, isFetching: isFetchingPoster } = useUser(mission.userId);
    const { pet, isFetching: isFetchingPet } = usePet(mission.petId);

    return (
        <>
            {
                (
                    isFetchingMission
                    || isFetchingPoster
                    || isFetchingPet
                    || isEmptyObject(mission)
                    || isEmptyObject(poster)
                    || isEmptyObject(pet)
                ) ? null : (
                    <List.Item
                        title={pointRecord.productId ? '兌換商品' : `完成任務${poster.username && pet.breed ? ` - ${poster.username}的${pet.breed}` : ''}`}
                        description={`時間: ${moment(pointRecord.time).fromNow()}`}
                        disabled
                        right={props => <Caption {...props} style={{ alignSelf: 'center' }}>{`${pointRecord.points > 0 ? '+' : '-'}${Math.abs(pointRecord.points)}`}</Caption>}
                    />
                )
            }
            <Divider />
        </>
    );
};