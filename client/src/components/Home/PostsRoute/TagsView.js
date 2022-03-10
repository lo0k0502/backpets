import React from 'react';
import { View, ScrollView } from 'react-native';
import Tag from './Tag';

export default ({ tagsState: [tags, setTags] }) => {
  return (
    <View>
      <ScrollView
        horizontal
        style={{
          padding: '1%',
          backgroundColor: 'white',
        }}
      >
        {tags.map((tag, index) => <Tag key={index} tag={tag} setTags={setTags} />)}
      </ScrollView>
    </View>
  );
};