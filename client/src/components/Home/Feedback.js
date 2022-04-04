import React, { useState } from 'react';
import { View, TextInput as NativeTextInput, Linking, Alert } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/userSlice';
import { addFeedback } from '../../api';

export default ({ navigation }) => {
    const user = useSelector(selectUser);

    const [content, setContent] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        setIsLoading(true);

        try {
            await addFeedback({
                userId: user.info._id,
                content,
            });

            Alert.alert('謝謝您!', '我們已收到您的意見回饋!', [{ text: 'OK', onPress: navigation.goBack }]);
        } catch (error) {
            console.log('While adding feedback: ', error);
        }

        setIsLoading(false);
    };

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: 'white',
                padding: '5%',
            }}
        >
            <TextInput
                mode='outlined'
                label='請寫下您對我們的建議與感想～'
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
            <Button
                mode='contained'
                dark
                disabled={
                    isLoading
                    || !content
                    || !user.info?._id
                }
                loading={isLoading}
                style={{
                    width: '60%',
                    height: 50,
                    marginTop: '5%',
                    alignSelf: 'center',
                }}
                contentStyle={{ width: '100%', height: '100%' }}
                onPress={handleSubmit}
            >
                提交
            </Button>
        </View>
    );
};