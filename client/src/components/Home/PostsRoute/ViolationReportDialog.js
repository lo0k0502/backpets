import moment from 'moment';
import React, { useState } from 'react';
import { ScrollView, TextInput as NativeTextInput, View } from 'react-native';
import { Avatar, Button, Card, Dialog, Divider, HelperText, TextInput } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { addViolationReport, deleteViolationReport } from '../../../api';
import { SERVERURL } from '../../../api/API';
import { selectUser } from '../../../redux/userSlice';
import { constants, isEmptyObject } from '../../../utils';
import { postTypeENtoCH } from '../../../utils';
import TagsView from './TagsView';

export default ({
    postType,
    post = {},
    poster = {},
    visible,
    close,
    refreshPosts = () => {},
    showSnackbar = () => {},
}) => {
    const user = useSelector(selectUser);

    const [isLoading, setIsLoading] = useState(false);// Whether it is during posting, if so, disable inputs and buttons.

    const [categoryTags, setCategoryTags] = useState(constants.violationReportCategories.map(tagName => ({ name: tagName, selected: false })));
    const [content, setContent] = useState('');

    const handleClose = () => {
        close();
    };

    const handleExceedMaxTagLimit = () => {
        const firstSelectedTagIndex = categoryTags.findIndex(tag => tag.selected);

        setCategoryTags(tags => tags.map((tag, index) => {
            if (index === firstSelectedTagIndex) return { ...tag, selected: false };
            return tag;
        }));

        return false;
    };

    const handleSubmit = async () => {
        setIsLoading(true);

        try {
            const result = await addViolationReport({
                userId: user.info._id,
                post_type: postType,
                postId: post._id,
                category: categoryTags.find(tag => tag.selected).name,
                content,
            });

            refreshPosts();
            showSnackbar('已成功檢舉', {
                label: '取消檢舉',
                onPress: async () => {
                    const response = await deleteViolationReport(result.data.result._id);
                    showSnackbar(response.data.success ? '已成功取消檢舉' : '發生錯誤，無法取消檢舉');
                },
            })
            handleClose();
        } catch (error) {
            setIsLoading(false);
            console.log('While adding violationReport:', error);
        }

        setIsLoading(false);
    };

    return (
        <Dialog visible={visible} onDismiss={handleClose}>
            <Dialog.Title>檢舉{postTypeENtoCH(postType)}貼文</Dialog.Title>
            <Dialog.ScrollArea style={{ paddingHorizontal: 0 }}>
                <ScrollView style={{ height: '80%', paddingHorizontal: 20 }}>
                    <HelperText>
                        您正在檢舉以下使用者所發布的貼文
                    </HelperText>
                    <Card.Title
                        title={poster.username} 
                        subtitle={moment(post.post_time).fromNow()} 
                        left={props => (
                            <Avatar.Image
                                {...props}
                                source={{ uri: `${SERVERURL}/image/${poster.photoId}` }}
                                style={{ backgroundColor: 'white' }}
                            />
                        )}
                    />
                    <Divider />
                    <HelperText>
                        請問您為何要檢舉此貼文?(必要)
                    </HelperText>
                    <TagsView maxLimit={1} onExceedMaxLimit={handleExceedMaxTagLimit} tagsState={[categoryTags, setCategoryTags]} />
                    <Divider />
                    <TextInput
                        mode='outlined'
                        label='請詳細說明此貼文對您造成的影響(必要)'
                        disabled={isLoading}
                        value={content}
                        multiline
                        maxLength={200}
                        right={<TextInput.Affix text={`${content.length}/200`} />}
                        render={(innerProps) => (
                            <NativeTextInput
                                {...innerProps}
                                style={[
                                    innerProps.style,
                                    innerProps.multiline ? {
                                        paddingTop: 8,
                                        paddingBottom: 8,
                                        height: 200,
                                    } : null,
                                ]}
                            />
                        )}
                        onChangeText={setContent}
                    />
                    <View style={{ height: 50 }} />
                </ScrollView>
            </Dialog.ScrollArea>
            <Dialog.Actions>
                <Button
                    disabled={isLoading}
                    onPress={handleClose}
                    contentStyle={{ paddingHorizontal: 10 }}
                >
                    取消
                </Button>
                <Button
                    mode='contained'
                    dark
                    disabled={
                        isLoading
                        || !postType
                        || isEmptyObject(post)
                        || isEmptyObject(poster)
                        || !categoryTags.find(tag => tag.selected)
                        || !content
                    }
                    loading={isLoading}
                    onPress={handleSubmit}
                    contentStyle={{ paddingHorizontal: 10 }}
                >
                    檢舉
                </Button>
            </Dialog.Actions>
        </Dialog>
    );
};