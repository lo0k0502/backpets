import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import React, { useState } from 'react';
import { Image, View } from 'react-native';
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
import { constants, isEmptyObject } from '../../../../utils';
import { Skeleton } from '../../Skeleton';
import Tag from '../Tag';

export default ({
    report,
    tagSelected = false,
    setEditReport = () => {},
    setReportDialog = () => {},
    setViolationReportDialog = () => {},
    setEditReportPoster = () => {},
}) => {
    const navigation = useNavigation();
    const { colors } = useTheme();
    const user = useSelector(selectUser);
    const { user: poster, isFetching } = useUser(report.userId);

    const [menu, setMenu] = useState(false);

    return !(
        isFetching
        || isEmptyObject(poster)
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
            <View>
                <Card.Title
                    title={poster.username} 
                    subtitle={moment(report.post_time).fromNow()} 
                    left={props => (
                        <Avatar.Image
                            {...props}
                            source={{ uri: `${SERVERURL}/image/${poster.photoId}` }}
                            style={{ backgroundColor: 'white' }}
                        />
                    )}
                    right={props => (
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
                            {

                                user.info?._id === poster._id ? (
                                    <>
                                        <Menu.Item
                                            title='編輯通報'
                                            onPress={() => {
                                                setMenu(false);
                                                setEditReport(report);
                                                setReportDialog(true);
                                            }}
                                        />
                                        <Menu.Item title='刪除通報' titleStyle={{ color: 'red' }} onPress={() => {}} />
                                    </>
                                ) : (
                                    <Menu.Item
                                        title='檢舉貼文'
                                        titleStyle={{
                                            color: 'red',
                                        }}
                                        onPress={() => {
                                            setMenu(false);
                                            setEditReport(report);
                                            setEditReportPoster(poster);
                                            setViolationReportDialog(true);
                                        }}
                                    />
                                )
                            }
                        </Menu>
                    )}
                />
                <Image
                    source={{ uri: `${SERVERURL}/image/${report.photoId}` }}
                    style={{ height: 300 }}
                    resizeMode='contain'
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
                    onPress={() => navigation.navigate(constants.pageNames[1], { location: report.location })}
                >
                    前往地圖
                </Button>
            </Card.Actions>
        </Card>
    ) : <Skeleton />;
};