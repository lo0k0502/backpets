import React from 'react';
import { View, ScrollView } from 'react-native';
import Tag from './Tag';

export default ({ 
  maxLimit = null, 
  onExceedMaxLimit = () => true, 
  tagsState,
  style = {},
}) => {
  const [tags, setTags] = tagsState;

  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ padding: '2%', backgroundColor: 'white', ...style }}
      >
        {tags.map((tag, index) => (
          <Tag
            key={index}
            tag={tag}
            tagsState={[tags, setTags]}
            maxLimit={maxLimit}
            onExceedMaxLimit={onExceedMaxLimit}
          />
        ))}
        <View style={{ width: 15 }} />
      </ScrollView>
    </View>
  );
};