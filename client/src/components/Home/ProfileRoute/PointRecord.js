import React from 'react';
import { RefreshControl, ScrollView } from 'react-native';
import { List, Title, useTheme } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { useSelfPointRecords } from '../../../hooks';
import { selectUser } from '../../../redux/userSlice';
import PointRecordItem from './PointRecordItem';

export default () => {
    const user = useSelector(selectUser);
    const { pointRecords, refreshPointRecords, isFetching } = useSelfPointRecords(user.info?._id);
    const { colors } = useTheme();

    return (
        <ScrollView
            style={{
                flex: 1,
                backgroundColor: 'white',
            }}
            refreshControl={(
                <RefreshControl
                    refreshing={isFetching}
                    onRefresh={refreshPointRecords}
                />
            )}
        >
            <List.Section style={{ flex: 1, marginTop: 0 }}>
                {
                    isFetching ? null : (
                        pointRecords.length ? (
                            pointRecords.map(pointRecord => (
                                <PointRecordItem key={pointRecord._id} pointRecord={pointRecord} />
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