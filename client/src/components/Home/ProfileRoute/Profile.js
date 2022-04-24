import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Avatar, List, Divider, useTheme, Badge, TouchableRipple } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../redux/userSlice';
import { SERVERURL } from '../../../api/API';
import Context from '../../../context';
import { constants } from '../../../utils';
import PointIcon from '../../common/PointIcon';

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
  const { selfClues, selfCoupons } = useContext(Context);

  return (
    <View style={styles.root}>
      <View style={[styles.profile, { backgroundColor: colors.primary }]}>
        <Avatar.Image source={{ uri: user.info?.photoId ? `${SERVERURL}/image/${user.info?.photoId}` : null }} size={100} style={styles.avatar} />
        <View style={{ alignItems: 'center', flex: 1, borderLeftWidth: 2, borderColor: colors.border }}>
          <Text ellipsizeMode='tail' style={{ color: 'white', fontSize: 25 }}>
            {user.info?.username}
          </Text>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ alignItems: 'center', paddingHorizontal: '10%' }}>
              <PointIcon mode='light' style={{ margin: 3, marginTop: 4 }} />
              <Text style={styles.points}>點數</Text>
              <Text style={styles.points}>{user.info?.points}</Text>
            </View>
            <TouchableRipple onPress={() => navigation.navigate('Coupon')}>
              <View style={{ alignItems: 'center', paddingHorizontal: '10%' }}>
                <MaterialCommunityIcons name='ticket-confirmation-outline' color='white' size={25} />
                <Text style={styles.points}>兌換券</Text>
                <Text style={styles.points}>{selfCoupons.length}</Text>
              </View>
            </TouchableRipple>
          </View>
        </View>
      </View>

      <ScrollView>
        <List.Section style={{ marginVertical: 0 }}>
          {constants.profileRouteNamesCH.map((title, index) => (
            <ListItem
              key={index}
              title={title}
              right={() => (
                <Badge
                  visible={title === '回報過的線索' && selfClues.filter(clue => clue.awarded && !clue.pointsReceived).length}
                  style={{
                    alignSelf: 'center',
                  }}
                >
                  {selfClues.filter(clue => clue.awarded && !clue.pointsReceived).length}
                </Badge>
              )}
              onItemPress={() => navigation.navigate(constants.profileRouteNames[index])}
            />
          ))}
        </List.Section>
        <View style={{ height: 70 }} />
      </ScrollView>
    </View>
  );
};

const ListItem = ({ title, right, onItemPress }) => (
  <>
    <List.Item
      title={title}
      titleEllipsizeMode='tail'
      onPress={onItemPress}
      right={right}
    />
    <Divider style={styles.divider} />
  </>
);