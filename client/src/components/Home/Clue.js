import React, { useEffect, useState } from 'react';
import {
    RefreshControl,
    ScrollView,
    View,
} from 'react-native';
import {
    ActivityIndicator,
    FAB,
    HelperText,
    Title,
    useTheme,
} from 'react-native-paper';
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/userSlice';
import { completeMission } from '../../api';
import { useClues, useMission } from '../../hooks';
import ClueCard from './ClueCard';

export default ({ route }) => {
    const user = useSelector(selectUser);
    const { missionId } = route.params;
    const { colors } = useTheme();
    const { mission, refreshMission, isFetching: isFetchingMission } = useMission(missionId);
    const { clues, refreshClues, isFetching: isFetchingClues } = useClues(missionId);

    const [selecting, setSelecting] = useState(false);
    const [clueCheckBoxes, setClueCheckboxses] = useState([]);
    const [selectingErrorMsg, setSelectingErrorMsg] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    const refreshPage = async () => {
        await refreshMission();
        await refreshClues();
    };

    const handleSubmit = async () => {
        setSelectingErrorMsg('');
        setIsLoading(true);

        try {
            await completeMission({
                missionId,
                userId: user.info._id,
                chosen_clueIds: clueCheckBoxes.filter(clueCheckBox => clueCheckBox.status === 'checked').map(clueCheckBox => clueCheckBox.id),
            });

            refreshPage();
            setSelecting(false);
        } catch (error) {
            console.log('While completing mission: ', error);
        }

        setIsLoading(false);
    };

    useEffect(() => {
        setClueCheckboxses(clues.map(clue => ({ id: clue._id, userId: clue.userId, status: 'unchecked' })));
    }, [clues]);

    return (
        <>
            <ScrollView
                style={{
                    flex: 1,
                    backgroundColor: 'white',
                }}
                refreshControl={
                    <RefreshControl
                        refreshing={isFetchingMission || isFetchingClues}
                        onRefresh={refreshPage}
                    />
                }
            >
                {
                    selecting ? (
                        <>
                            <HelperText>
                                請選擇有幫助到您的線索({clueCheckBoxes.filter(clueCheckBox => clueCheckBox.status === 'checked').length}/3)
                            </HelperText>
                            <HelperText type='error'>
                            {selectingErrorMsg}
                            </HelperText>
                        </>
                    ) : null
                }
                {
                    isFetchingMission || isFetchingClues ? (
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
                                    selecting={selecting}
                                    disabled={isLoading}
                                    clueCheckBoxesState={[clueCheckBoxes, setClueCheckboxses]}
                                    setSelectingErrorMsg={setSelectingErrorMsg}
                                />
                            ))
                        ) : (
                            <Title style={{ marginTop: 50, alignSelf: 'center' }}>沒有線索QQ</Title>
                        )
                    )
                }
                <View style={{ height: 70 }} />
            </ScrollView>
            {
                mission.completed ? null : (
                    !(isFetchingMission || isFetchingClues) && clues.length ? (
                        selecting ? (
                            <>
                                <FAB
                                    icon='close'
                                    label='取消'
                                    color={isLoading ? 'white' : colors.primary}
                                    extended
                                    disabled={isLoading}
                                    style={{
                                        position: 'absolute',
                                        right: 10,
                                        bottom: 140,
                                        elevation: 1,
                                    }}
                                    theme={{ colors: { accent: 'white' } }}
                                    onPress={() => {
                                        setSelectingErrorMsg('');
                                        setSelecting(false);
                                    }}
                                />
                                <FAB
                                    icon='check'
                                    label='確定選擇'
                                    color='white'
                                    extended
                                    disabled={isLoading || !clueCheckBoxes.filter(clueCheckBox => clueCheckBox.status === 'checked').length}
                                    style={{
                                        position: 'absolute',
                                        right: 10,
                                        bottom: 70,
                                        elevation: 1,
                                    }}
                                    theme={{ colors: { accent: colors.primary } }}
                                    onPress={handleSubmit}
                                />
                            </>
                        ) : (
                            <FAB
                                icon='check'
                                label='完成任務'
                                color='white'
                                extended
                                disabled={isLoading}
                                style={{
                                    position: 'absolute',
                                    right: 10,
                                    bottom: 70,
                                    elevation: 1,
                                }}
                                theme={{ colors: { accent: colors.primary } }}
                                onPress={() => setSelecting(true)}
                            />
                        )
                    ) : null
                ) 
            }
        </>
    );
};