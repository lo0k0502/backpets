import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Svg, Image as ImageSvg } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { Headline, Avatar, Text } from 'react-native-paper';
import { SERVERURL } from '../../../api/API';

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    container: {
    //   flexDirection: 'column',
    //   alignSelf: 'flex-start',
    },
    bubble: {
        flexDirection: 'row',
        alignSelf: 'flex-start',
        paddingBottom: 5,
        backgroundColor: '#be9a78',
        borderRadius: 10,
        borderColor: '#007a87',
        borderWidth: 0,
    },
    arrow: {
        backgroundColor: 'transparent',
        borderWidth: 16,
        borderColor: 'transparent',
        borderTopColor: '#be9a78',
        alignSelf: 'center',
        marginTop: 0,
    },
    arrowBorder: {
        backgroundColor: 'transparent',
        borderWidth: 0,
        borderColor: 'transparent',
        borderTopColor: '#007a87',
        alignSelf: 'center',
    //   marginTop: -0.5,
    },
    image: {
        alignSelf: 'auto',
        marginHorizontal: 10,
        marginTop: 10,
        borderRadius: 10,
        borderWidth: 0,
    },
    text: {
        fontWeight: '900',
        marginLeft: 10,
    },
});

export default ({ report }) => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <View style={styles.bubble}>
                <View style={styles.root}>
                
                    <Svg width={220} height={120} style={styles.image}>
                        <ImageSvg
                            width={'100%'}
                            height={'100%'}
                            preserveAspectRatio="xMidYMid slice"
                            href={{ uri: `${SERVERURL}/image/${report.photoId}` }}
                        />
                    </Svg>

                    <Text style={ styles.text }>
                        這裏{report.tag}，請小心！
                    </Text>
                    <Text style={ styles.text }>
                        {report.content}
                    </Text>
                </View>
            </View>
            <View style={styles.arrowBorder} />
            <View style={styles.arrow} />
        </View>
    );
};
