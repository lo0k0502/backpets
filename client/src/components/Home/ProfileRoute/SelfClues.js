import React from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { ActivityIndicator, Text, Title, useTheme } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { useSelfClues } from '../../../hooks';
import { selectUser } from '../../../redux/userSlice';
import ClueCard from './ClueCard';

export default () => {
    const user = useSelector(selectUser);
    const { clues, refreshClues, isFetching } = useSelfClues(user.info?._id);
    const { colors } = useTheme();

    return (
        <ScrollView
            style={{
                flex: 1,
                backgroundColor: 'white',
            }}
            refreshControl={
                <RefreshControl
                    refreshing={isFetching}
                    onRefresh={refreshClues}
                />
            }
        >
            {
                isFetching ? (
                    <ActivityIndicator
                        animating={true}
                        color={colors.primary}
                        size='large'
                        style={{ marginTop: 50 }}
                    />
                ) : (
                    clues.length ? (
                        clues.map(clue => (
                            <ClueCard
                                key={clue._id}
                                clue={clue}
                                self
                                refreshClues={refreshClues}
                            />
                        ))
                    ) : (
                        <Title style={{ marginTop: 50, alignSelf: 'center' }}>沒有線索QQ</Title>
                    )
                )
            }
            <View style={{ height: 70 }} />
        </ScrollView>
    );
};