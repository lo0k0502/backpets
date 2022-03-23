import React, { useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Avatar, List, Divider, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../redux/userSlice';
import { SERVERURL } from '../../../api/API';

const styles = StyleSheet.create({
  root: {
    backgroundColor: 'white',
    flex: 1,
  },
  profile: {
    flexDirection: 'row',
    padding: '10%',
  },
  avatar: {
    maxWidth: '40%',
    backgroundColor: 'white',
    marginRight: '10%',
  },
  points: {
    color: 'white',
    fontSize: 15,
  },
  divider: {
    backgroundColor: '#cbc3bc',
    height: 2,
  },
});

export default ({ navigation }) => {
  const user = useSelector(selectUser);
  const { colors } = useTheme();

  return (
    <View style={styles.root}>
      <View style={[ styles.profile, { backgroundColor: colors.primary } ]}>
        <Avatar.Image source={{ uri: user.info?.photoId ? `${SERVERURL}/image/${user.info?.photoId}` : null }} size={100} style={styles.avatar} />
        <View style={{ alignItems: 'center', flex: 1, borderLeftWidth: 2, borderColor: colors.accent }}>
          <Text ellipsizeMode='tail' style={{ color: 'white', fontSize: 25 }}>
            {user.info?.username}
          </Text>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ alignItems: 'center', marginRight: 5 }}>
              <MaterialCommunityIcons name='currency-usd' color='white' size={25} />
              <Text style={styles.points}>點數</Text>
              <Text style={styles.points}>{user.info?.points}</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <MaterialCommunityIcons name='ticket-confirmation-outline' color='white' size={25} />
              <Text style={styles.points}>禮券</Text>
              <Text style={styles.points}>{user.info?.couponIds.length}</Text>
            </View>
          </View>
        </View>
      </View>

      <List.Section>
        {[ '修改個人資料', '編輯寵物護照', '發布過的貼文', '兌換紀錄', '點數紀錄', '修改密碼' ].map((title, index) => (
          <ListItem
            key={index}
            title={title}
            navigation={navigation}
          />
        ))}
      </List.Section>
    </View>
  );
};

const ListItem = ({ title, navigation }) => (
  <>
    <List.Item
      title={title}
      titleEllipsizeMode='tail'
      onPress={() => {
        switch (title) {
          case '修改個人資料': {
            navigation.navigate('EditProfile');
            break;
          }
          case '編輯寵物護照': {
            navigation.navigate('PetPassports');
            break;
          }
          case '發布過的貼文': {
            navigation.navigate('SelfMissions');
            break;
          }
          case '修改密碼': {
            navigation.navigate('ChangePassword');
            break;
          }
          default: {
            return;
          }
        }
      }}
    />
    <Divider style={styles.divider} />
  </>
);