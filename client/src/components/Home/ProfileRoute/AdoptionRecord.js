import React from 'react';
import { RefreshControl, ScrollView } from 'react-native';
import { List, Title } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { useSelfAdoptionRecords } from '../../../hooks';
import { selectUser } from '../../../redux/userSlice';
import AdoptionRecordItem from './AdoptionRecordItem';

export default () => {
    const user = useSelector(selectUser);
    const { selfAdoptionRecords, refreshSelfAdoptionRecords, isFetchingSelfAdoptionRecords } = useSelfAdoptionRecords(user.info?._id);

    return (
        <ScrollView
            style={{
                flex: 1,
                backgroundColor: 'white',
            }}
            refreshControl={(
                <RefreshControl
                    refreshing={isFetchingSelfAdoptionRecords}
                    onRefresh={refreshSelfAdoptionRecords}
                />
            )}
        >
            <List.Section style={{ flex: 1, marginTop: 0 }}>
                {
                    isFetchingSelfAdoptionRecords ? null : (
                        selfAdoptionRecords.length ? (
                            selfAdoptionRecords.map(selfAdoptionRecord => (
                                <AdoptionRecordItem key={selfAdoptionRecord._id} selfAdoptionRecord={selfAdoptionRecord} />
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