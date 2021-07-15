import React from 'react';
import { View, Text } from 'react-native';

const UpdateProfile = ({ user }) => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems:'center'}}>
            <Text>{user?.result.username}</Text>
        </View>
    );
};

export default UpdateProfile;