import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Headline, Text } from 'react-native-paper';
import { usePet } from '../../../hooks';

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    container: {
    //   flexDirection: 'column',
    //   alignSelf: 'flex-start',
    },
    bubble: {
      width: 140,
      flexDirection: 'row',
      alignSelf: 'flex-start',
      backgroundColor: '#be9a78',
      paddingHorizontal: 10,
      paddingVertical: 6,
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
      marginTop: -1,
    },
    arrowBorder: {
      backgroundColor: 'transparent',
      borderWidth: 0,
      borderColor: 'transparent',
      borderTopColor: '#007a87',
      alignSelf: 'center',
    //   marginTop: -0.5,
    },
});

export default ({ mission }) => {
    const navigation = useNavigation();
    const { pet } = usePet(mission.petId);

    return (
        <View style={styles.container}>
            <View style={styles.bubble}>
                <View style={styles.root}>
                    <Text style={{ fontWeight: '900' }}>
                        我家的{pet.breed}不見了
                    </Text>
                    <Text>{mission.content}</Text>
                </View>
            </View>
            <View style={styles.arrowBorder} />
            <View style={styles.arrow} />
        </View>
    );
};
