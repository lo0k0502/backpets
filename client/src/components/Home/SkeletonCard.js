import React from 'react';
import { useTheme } from 'react-native-paper';
import SkeletonContent from 'react-native-skeleton-content';

export default () => {
    const { colors } = useTheme();

    return (
        <SkeletonContent
            containerStyle={{
                flexWrap: 'wrap',
                flexDirection: 'row',
                alignItems: 'center',
                borderRadius: 0,
                borderBottomWidth: 10,
                borderColor: '#be9a78',
                marginHorizontal: '5%',
                padding: 10,
                elevation: 0,
            }}
            boneColor={colors.boneColor}
            highlightColor={colors.boneHighlightColor}
            layout={[
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
            ]}
            isLoading
        />
    );
};