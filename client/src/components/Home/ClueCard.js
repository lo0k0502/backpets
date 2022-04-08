import React, { useContext, useState } from 'react';
import { View } from 'react-native';
import {
    Card,
    Avatar,
    Paragraph,
    useTheme,
    Checkbox,
    Subheading,
    Button,
    Caption,
    Divider,
} from 'react-native-paper';
import moment from 'moment';
import { usePet, useUser } from '../../hooks';
import { SERVERURL } from '../../api/API';
import { unwrapResult } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { updatePoints } from '../../redux/userReducer';
import { selectUser } from '../../redux/userSlice';
import { isEmptyObject } from '../../utils';
import { Skeleton } from './Skeleton';
import Context from '../../context';

export default ({
    clue,
    self = false,
    refreshClues = () => {},
    selecting = false,
    disabled = false,
    clueCheckBoxesState,
    setSelectingErrorMsg = () => {},
}) => {
    const [clueCheckBoxes, setClueCheckboxses] = clueCheckBoxesState || [[], () => {}];
    const user = useSelector(selectUser);
    const { colors } = useTheme();
    const { user: poster, isFetching: isFetchingPoster } = useUser(clue.userId);
    const { getMissionById, isFetchingAllMissions } = useContext(Context);

    const mission = getMissionById(clue.missionId);

    const { pet, isFetching: isFetchingPet } = usePet(mission.petId);
    const { user: missionPoster, isFetching: isFetchingMissionPoster } = useUser(pet.userId);

    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch();

    const receivePoints = async () => {
        setIsLoading(true);

        try {
            unwrapResult(await dispatch(updatePoints({ clueId: clue._id, points: 10 })));

            refreshClues();
        } catch (error) {
            console.log('While receiving points: ', error);
        }

        setIsLoading(false);
    };

    return !(
        isFetchingPoster
        || isFetchingAllMissions
        || isFetchingPet
        || isFetchingMissionPoster
        || isEmptyObject(poster)
        || isEmptyObject(mission)
        || isEmptyObject(pet)
        || isEmptyObject(missionPoster)
        || !user.info?._id
    ) ? (
        <Card
            style={{
                justifyContent: 'center',
                borderRadius: 0,
                borderBottomWidth: 10,
                borderColor: '#be9a78',
                marginHorizontal: '5%',
                elevation: 0,
            }}
        >
            <View style={{ alignItems: 'flex-start' }}>
                <Card.Title
                    title={poster.username}
                    subtitle={moment(clue.post_time).fromNow()}
                    left={props => (
                        <Avatar.Image
                            {...props}
                            source={{ uri: `${SERVERURL}/image/${poster.photoId}` }}
                            style={{ backgroundColor: 'white' }}
                        />
                    )}
                    right={props => (
                        !self && selecting ? (
                            <Checkbox.Item
                                {...props}
                                label='選擇'
                                disabled={disabled}
                                status={clueCheckBoxes.find(clueCheckbox => clueCheckbox.id === clue._id).status}
                                onPress={() => {
                                    if (disabled) return;
                                    if (clueCheckBoxes.find(clueCheckbox => clueCheckbox.id !== clue._id && clueCheckbox.userId === clue.userId && clueCheckbox.status === 'checked')) {
                                        return setSelectingErrorMsg('不可選擇同一個人!');
                                    }
                                    if (clueCheckBoxes.filter(clueCheckbox => clueCheckbox.status === 'checked').length >= 3) {
                                        return setSelectingErrorMsg('最多只可選擇三個!');
                                    }

                                    setSelectingErrorMsg('');
                                    
                                    setClueCheckboxses(state => state.map(clueCheckbox => (
                                        clueCheckbox.id === clue._id ? (
                                            {
                                                ...clueCheckbox,
                                                status: clueCheckbox.status === 'checked' ? 'unchecked' : 'checked',
                                            }
                                        ) : clueCheckbox
                                    )));
                                }}
                            />
                        ) : (
                            self && clue.awarded ? (
                                <Caption {...props}>獲獎</Caption>
                            ) : null
                        )
                    )}
                />
                <Card.Cover
                    source={{ uri: `${SERVERURL}/image/${clue.photoId}` }}
                    style={{
                        width: 300,
                        height: 200,
                        alignSelf: 'center',
                        marginVertical: 5,
                    }}
                />
                <Paragraph style={{ padding: 10 }}>
                    <Subheading style={{ color: colors.primary }}>{'說明:\n'}</Subheading>
                    {clue.content}
                </Paragraph>
                {
                    self ? (
                        <>
                            <View
                                style={{
                                    width: '100%',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                            >
                                <Subheading style={{ padding: 10, color: colors.primary }}>
                                    回報給: 
                                </Subheading>
                                <Card.Title
                                    title={missionPoster.username}
                                    subtitle={moment(mission.post_time).fromNow() + '的任務'}
                                    left={props => (
                                        <Avatar.Image
                                            {...props}
                                            source={{ uri: `${SERVERURL}/image/${missionPoster.photoId}` }}
                                            style={{ backgroundColor: 'white' }}
                                        />
                                    )}
                                />
                            </View>
                        </>
                    ) : null
                }
            </View>
            {
                clue.awarded && user.info?._id === poster._id ? (
                    <>
                        <Divider
                            style={{
                                backgroundColor: colors.primary,
                                width: '95%',
                                height: 1,
                                alignSelf: 'center',
                            }}
                        />
                        <Card.Actions style={{ flexDirection: 'row', padding: 0 }}>
                            <Button
                                dark
                                disabled={clue.pointsReceived || isLoading}
                                loading={isLoading}
                                style={{ flexGrow: 1 }}
                                theme={{ roundness: 0 }}
                                onPress={receivePoints}
                            >
                                {clue.pointsReceived ? '點數已領取' : '領取點數'}
                            </Button>
                        </Card.Actions>
                    </>
                ) : null
            }
        </Card>
    ) : <Skeleton />;
};