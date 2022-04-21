import React from 'react';
import { useTheme } from 'react-native-paper';
import SkeletonContent from '@vitu.soares/react-native-skeleton-content';
import { constants } from '../../utils';

export const Skeleton = ({ mode = 'card' }) => {
    const { colors } = useTheme();

    const _containerStyles = {
        'card': {
            flexWrap: 'wrap',
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: 0,
            borderBottomWidth: 10,
            borderColor: '#be9a78',
            marginHorizontal: '5%',
            padding: 10,
            elevation: 0,
        },
        'item': {
            flexWrap: 'wrap',
            flexDirection: 'row',
            alignItems: 'center',
        },
        'grid': {
            borderRadius: 0,
            borderBottomWidth: 5,
            borderColor: colors.primary,
            elevation: 0,
        }
    };

    const _layouts = {
        'card': [
            {
                key: 'avatar',
                flexGrow: 0.1,
                width: 50,
                height: 50,
                margin: 10,
                borderRadius: 50,
            },
            {
                key: 'username',
                flexGrow: 4.9,
                width: 220,
                height: 20,
                margin: 10,
                borderRadius: 20,
            },
            {
                key: 'content1',
                flexGrow: 4,
                width: 220,
                height: 20,
                margin: 10,
                borderRadius: 20,
            },
            {
                key: 'content2',
                flexGrow: 4,
                width: 220,
                height: 20,
                margin: 10,
                marginRight: 60,
                borderRadius: 20,
            },
            {
                key: 'content3',
                flexGrow: 4,
                width: 220,
                height: 20,
                margin: 10,
                marginRight: 60,
                borderRadius: 20,
            },
            {
                key: 'content4',
                flexGrow: 4,
                width: 220,
                height: 20,
                margin: 10,
                borderRadius: 20,
            },
            {
                key: 'content5',
                flexGrow: 4,
                width: 220,
                height: 20,
                margin: 10,
                marginRight: 60,
                borderRadius: 20,
            },
        ],
        'item': [
            {
                key: 'avatar',
                flexGrow: 0.1,
                width: 50,
                height: 50,
                margin: 15,
                borderRadius: 50,
            },
            {
                key: 'title',
                flexGrow: 4.9,
                width: 220,
                height: 20,
                marginRight: 15,
                borderRadius: 20,
            },
        ],
        'grid': [
            {
                key: 'image',
                width: '100%',
                height: constants.boxSize,
            }
        ],
    };

    return (
        <SkeletonContent
            containerStyle={_containerStyles[mode]}
            boneColor={colors.boneColor}
            highlightColor={colors.boneHighlightColor}
            layout={_layouts[mode]}
            isLoading
        />
    );
};