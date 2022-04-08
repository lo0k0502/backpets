import React, { useContext } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { Title } from 'react-native-paper';
import Context from '../../../context';
import ClueCard from '../ClueCard';

export default () => {
    const { selfClues, refreshSelfClues, isFetchingSelfClues } = useContext(Context);

    return (
        <ScrollView
            style={{
                flex: 1,
                backgroundColor: 'white',
            }}
            refreshControl={
                <RefreshControl
                    refreshing={isFetchingSelfClues}
                    onRefresh={refreshSelfClues}
                />
            }
        >
            {
                isFetchingSelfClues ? null : (
                    selfClues.length ? (
                        selfClues.map(clue => (
                            <ClueCard
                                key={clue._id}
                                clue={clue}
                                self
                                refreshSelfClues={refreshSelfClues}
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