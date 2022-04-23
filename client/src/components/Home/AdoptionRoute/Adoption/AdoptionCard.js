import React from 'react';
import { Image, View } from 'react-native';
import { Button, Card, Divider, Text, useTheme } from 'react-native-paper';
import { SERVERURL } from '../../../../api/API';
import { constants } from '../../../../utils';
import Tag from '../../../common/Tag';

export default ({
    item,
    tagSelected = false,
    onDetailPress = () => {},
}) => {
    const { colors } = useTheme();

    return (
        <Card
            style={{
                borderRadius: 0,
                borderBottomWidth: 5,
                borderColor: colors.primary,
                elevation: 0,
            }}
        >
            <View>
                <Image
                    source={{ uri: item.album_file || `${SERVERURL}/image/626443a00f101c21a243f698` }}
                    style={{ height: constants.boxSize }}
                    resizeMode='contain'
                />
                <Text>品種: {item.animal_Variety || '無資料'}</Text>
                <Text>性別: {item.animal_sex || '無資料'}</Text>
                <Text>我在: {item.shelter_name || '無資料'}</Text>
                <View style={{ flexDirection: 'row', paddingHorizontal: 10, paddingBottom: 10 }}>
                    <Tag tag={{ name: item.animal_kind, selected: tagSelected }} />
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
                    dark
                    style={{ flexGrow: 1 }}
                    theme={{ roundness: 0 }}
                    onPress={onDetailPress}
                >
                    詳細資訊
                </Button>
            </Card.Actions>
        </Card>
    );
};