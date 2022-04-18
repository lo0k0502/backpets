import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import { Avatar, Caption, Divider, List } from 'react-native-paper';
import Context from '../../../context';
import { useMission, usePet, useUser } from '../../../hooks';
import { isEmptyObject } from '../../../utils';
import { Skeleton } from '../Skeleton';

export default ({ pointRecord }) => {
    const { getSelfClueByClueId, isFetchingSelfClues } = useContext(Context);

    const { mission, isFetchingMission } = useMission(pointRecord.missionId);
    const { user: poster, isFetching: isFetchingPoster } = useUser(mission.userId);
    const { pet, isFetching: isFetchingPet } = usePet(mission.petId);

    const [clue, setClue] = useState({});

    useEffect(() => {
        setClue(getSelfClueByClueId(pointRecord.clueId));
    }, [pointRecord.clueId]);

    return (
        !(
            isFetchingMission
            || isFetchingPoster
            || isFetchingPet
            || isFetchingSelfClues
            || isEmptyObject(mission)
            || isEmptyObject(poster)
            || isEmptyObject(pet)
            || isEmptyObject(clue)
        ) && clue.pointsReceived
    ) ? (
        <>
            <List.Item
                title={pointRecord.productId ? '兌換商品' : `完成任務${poster.username && pet.breed ? ` - ${poster.username}的${pet.breed}` : ''}`}
                description={`時間: ${moment(pointRecord.time).fromNow()} - ${moment(mission.post_time).fromNow()}的${pointRecord.productId ? '兌換' : '任務'}`}
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