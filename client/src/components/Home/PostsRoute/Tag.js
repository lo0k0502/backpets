import React, { useState } from 'react';
import { Chip, useTheme } from 'react-native-paper';

export default ({
    tag,
    tagsState,
    maxLimit,
    onExceedMaxLimit,
    onPress,
    disabled = false,
}) => {
    const { name, selected } = tag ? tag : { name: '未知', selected: false };
    const [tags, setTags] = tagsState ? tagsState : useState([tag]);
    const { colors } = useTheme();

    const handleTagPress = () => {
        if (
            maxLimit !== null
            && tags.filter(tag => tag.selected).length === maxLimit
            && selected === false
        ) {
            if (onExceedMaxLimit() === false ? false : (onExceedMaxLimit() || true)) return;
        }
        setTags(tags => tags.map(tag => tag.name === name ? { name: tag.name, selected: !selected } : tag ));
    };

    return (
        <Chip
            mode='outlined'
            icon={
                name === '貓' ? 'cat'
                : name === '狗' ? 'dog'
                : name === '兔子' ? 'rabbit'
                : name === '魚' ? 'fish'
                : name === '牛' ? 'cow'
                : name === '豬' ? 'pig'
                : name === '羊' ? 'sheep'
                : name === '烏龜' ? 'tortoise'
                : name === '驢' ? 'donkey'
                : name === '鴨子' ? 'duck'
                : name === '大象' ? 'elephant'
                : name === '企鵝' ? 'penguin'
                : name === '貓頭鷹' ? 'owl'
                : name === '熊貓' ? 'panda'
                : name === '老鼠' ? 'rodent'
                : name === '蜘蛛' ? 'spider'
                : null
            }
            ellipsizeMode='tail'
            disabled={disabled}
            selected={selected}
            selectedColor={selected ? 'white' : colors.primary}
            onPress={onPress === undefined ? handleTagPress : onPress}
            style={{
                maxWidth: 100,
                margin: 3,
                backgroundColor: selected ? colors.primary : 'white',
                borderColor: colors.primary,
                borderWidth: 1,
            }}
        >
            {name}
        </Chip>
    );
};