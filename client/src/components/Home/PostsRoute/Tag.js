import React, { useState } from 'react';
import { Chip, useTheme } from 'react-native-paper';
import { iconCHtoEN } from '../../../utils';

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
            icon={iconCHtoEN(name)}
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