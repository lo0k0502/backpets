import React from 'react';
import { View } from 'react-native';
import { Card, Avatar, Paragraph, useTheme, Text, Checkbox } from 'react-native-paper';
import moment from 'moment';
import { useUser } from '../../../hooks';
import { SERVERURL } from '../../../api/API';

export default ({
    clue,
    selecting,
    disabled,
    clueCheckBoxesState: [clueCheckBoxes, setClueCheckboxses],
    setSelectingErrorMsg,
}) => {
    const { colors } = useTheme();
    const { user: poster } = useUser(clue.userId);

    return (
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
                            source={{ uri: poster.photoId ? `${SERVERURL}/image/${poster.photoId}` : null }}
                            style={{ backgroundColor: 'white' }}
                        />
                    )}
                    right={props => (
                        selecting ? (
                            <Checkbox.Item
                                {...props}
                                label='選擇'
                                disabled={disabled}
                                status={clueCheckBoxes.find(clueCheckbox => clueCheckbox.id === clue._id).status}
                                theme={{ colors: { accent: colors.primary } }}
                                onPress={() => {
                                    if (disabled) return;
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
                        ) : null
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
                    <Text style={{ color: colors.primary }}>{'說明:\n'}</Text>
                    {clue.content}
                </Paragraph>
            </View>
        </Card>
    );
};