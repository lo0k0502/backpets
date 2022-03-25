import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import React, { useState } from 'react';
import { View } from 'react-native';
import {
    Avatar,
    Button,
    Card,
    Divider,
    IconButton,
    Menu,
    Paragraph,
    Subheading,
    useTheme,
} from 'react-native-paper';
import { useSelector } from 'react-redux';
import { SERVERURL } from '../../../../api/API';
import { useUser } from '../../../../hooks';
import { selectUser } from '../../../../redux/userSlice';
import Tag from '../Tag';

export default ({
    report,
    tagSelected = false,
    setEditReport = () => {},
    setEditReportDialog = () => {},
}) => {
    const navigation = useNavigation();
    const { colors } = useTheme();
    const user = useSelector(selectUser);
    const { user: poster } = useUser(report.userId);

    const [menu, setMenu] = useState(false);

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
                    subtitle={moment(report.post_time).fromNow()} 
                    left={props => (
                        <Avatar.Image
                            {...props}
                            source={{ uri: poster.photoId ? `${SERVERURL}/image/${poster.photoId}` : null }}
                            style={{ backgroundColor: 'white' }}
                        />
                    )}
                    right={props => (
                        user.info?._id === poster._id ? (
                            <Menu
                                {...props}
                                visible={menu}
                                onDismiss={() => setMenu(false)}
                                anchor={(
                                    <IconButton
                                        icon='dots-vertical'
                                        size={30}
                                        onPress={() => setMenu(true)}
                                    />
                                )}
                                theme={{ roundness: 0 }}
                            >
                                <Menu.Item
                                    title='編輯通報'
                                    onPress={() => {
                                        setMenu(false);
                                        setEditReport(report);
                                        setEditReportDialog(true);
                                    }}
                                />
                                <Menu.Item title='刪除通報' titleStyle={{ color: 'red' }} onPress={() => {}} />
                            </Menu>
                        ) : null
                    )}
                />
                <Card.Cover
                    source={{ uri: `${SERVERURL}/image/${report.photoId}` }}
                    style={{
                        width: 300,
                        height: 200,
                        alignSelf: 'center',
                        marginVertical: 5,
                    }}
                />
                <Paragraph style={{ padding: 10 }}>
                    <Subheading style={{ color: colors.primary }}>{'說明:\n'}</Subheading>
                    {report.content}
                </Paragraph>
                <View style={{ flexDirection: 'row', paddingHorizontal: 10, paddingBottom: 10 }}>
                    <Tag tag={{ name: report.tag, selected: tagSelected }} />
                </View>
                <Divider
                    style={{
                        backgroundColor: colors.primary,
                        width: '95%',
                        height: 1,
                        alignSelf: 'center',
                    }}
                />
            </View>
            <Card.Actions style={{ flexDirection: 'row', padding: 0 }}>
                <Button
                    icon='map-marker-outline'
                    dark
                    style={{ flexGrow: 1 }}
                    theme={{ roundness: 0 }}
                    onPress={() => navigation.navigate('Map', { location: report.location })}
                >
                    前往地圖
                </Button>
            </Card.Actions>
        </Card>
    );
};