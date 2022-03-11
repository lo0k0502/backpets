import React from 'react';
import { Chip, useTheme } from 'react-native-paper';

export default ({ tag: { name, selected }, tagsState: [tags, setTags], maxLimit, onExceedMaxLimit }) => {
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
            icon={
                name === '狗' ? 'dog'
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
                : 'cat'
            }
            ellipsizeMode='tail'
            selected={selected}
            selectedColor={selected ? 'white' : colors.primary}
            onPress={handleTagPress}
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