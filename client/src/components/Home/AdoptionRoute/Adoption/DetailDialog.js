import React from 'react';
import { Image, ScrollView, View } from 'react-native';
import { Button, Dialog } from 'react-native-paper';
import { SERVERURL } from '../../../../api/API';
import PostSubheading from '../../../common/PostSubheading';
import Tag from '../../../common/Tag';

export default ({
    visible,
    close,
    adoption,
}) => {
    const handleClose = () => {
        close();
    };

    return (
        <Dialog visible={visible} onDismiss={handleClose}>
            <Dialog.Title>詳細資訊</Dialog.Title>
            <Dialog.ScrollArea style={{ paddingHorizontal: 0 }}>
                <ScrollView
                    style={{ height: '80%', paddingHorizontal: 20 }}
                    contentContainerStyle={{ paddingBottom: 20 }}
                >
                    <Image
                        source={{ uri: adoption.album_file || `${SERVERURL}/image/626443a00f101c21a243f698` }}
                        style={{ height: 300 }}
                        resizeMode='contain'
                    />
                    <View style={{ flexDirection: 'row', padding: 10 }}>
                        <Tag tag={{ name: adoption.animal_kind, selected: false }} />
                    </View>
                    <PostSubheading label='品種'>
                        {adoption.animal_Variety || '無資料'}
                    </PostSubheading>
                    <PostSubheading label='性別'>
                        {adoption.animal_sex || '無資料'}
                    </PostSubheading>
                    <PostSubheading label='體型'>
                        {adoption.animal_bodytype || '無資料'}
                    </PostSubheading>
                    <PostSubheading label='毛色'>
                        {adoption.animal_colour || '無資料'}
                    </PostSubheading>
                    <PostSubheading label='年紀'>
                        {adoption.animal_age || '無資料'}
                    </PostSubheading>
                    <PostSubheading label='是否絕育'>
                        {adoption.animal_sterilization || '無資料'}
                    </PostSubheading>
                    <PostSubheading label='是否施打狂犬病疫苗'>
                        {adoption.animal_bacterin || '無資料'}
                    </PostSubheading>
                    <PostSubheading label='尋獲地點'>
                        {adoption.animal_foundplace || '無資料'}
                    </PostSubheading>
                    <PostSubheading label='收容所'>
                        {adoption.shelter_name || '無資料'}
                    </PostSubheading>
                    <PostSubheading label='收容所地址'>
                        {adoption.shelter_address || '無資料'}
                    </PostSubheading>
                    <PostSubheading label='收容所電話'>
                        {adoption.shelter_tel || '無資料'}
                    </PostSubheading>
                </ScrollView>
            </Dialog.ScrollArea>
            <Dialog.Actions>
                <Button
                    onPress={handleClose}
                    contentStyle={{ paddingHorizontal: 10 }}
                >
                    取消
                </Button>
            </Dialog.Actions>
        </Dialog>
    );
};