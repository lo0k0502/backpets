import React from 'react';
import { RefreshControl, ScrollView } from 'react-native';
import { List, Title } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { useSelfPutAdoptionRecords } from '../../../hooks';
import { selectUser } from '../../../redux/userSlice';
import PutAdoptionRecordItem from './PutAdoptionRecordItem';

export default () => {
    const user = useSelector(selectUser);
    const { selfPutAdoptionRecords, refreshSelfPutAdoptionRecords, isFetchingSelfPutAdoptionRecords } = useSelfPutAdoptionRecords(user.info?._id);

    return (
        <ScrollView
            style={{
                flex: 1,
                backgroundColor: 'white',
            }}
            refreshControl={(
                <RefreshControl
                    refreshing={isFetchingSelfPutAdoptionRecords}
                    onRefresh={refreshSelfPutAdoptionRecords}
                />
            )}
        >
            <List.Section style={{ flex: 1, marginTop: 0 }}>
                {
                    isFetchingSelfPutAdoptionRecords ? null : (
                        selfPutAdoptionRecords.length ? (
                            selfPutAdoptionRecords.map(selfPutAdoptionRecord => (
                                <PutAdoptionRecordItem key={selfPutAdoptionRecord._id} selfPutAdoptionRecord={selfPutAdoptionRecord} />
                            ))
                        ) : (
                            <Title style={{ marginTop: 50, alignSelf: 'center' }}>沒有紀錄QQ</Title>
                        )
                    )
                }
            </List.Section>
        </ScrollView>
    );
};