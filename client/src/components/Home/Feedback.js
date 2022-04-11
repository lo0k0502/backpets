import React, { useState, useEffect, useContext } from 'react';
import { View, TextInput as NativeTextInput } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/userSlice';
import { addFeedback } from '../../api';
import Context from '../../context';

export default ({ navigation }) => {
    const user = useSelector(selectUser);
    const { showSnackbar } = useContext(Context);

    const [content, setContent] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        setIsLoading(true);

        try {
            await addFeedback({
                userId: user.info._id,
                content,
            });

            showSnackbar('謝謝您!我們已收到您的意見回饋!');
            navigation.goBack();
        } catch (error) {
            console.log('While adding feedback: ', error);
        }

        setIsLoading(false);
    };

    useEffect(() => {
        setContent('');
    }, []);

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