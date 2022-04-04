import React from 'react';
import { Button, Menu } from 'react-native-paper';

export default ({ stateSet, menuStateSet, options, optionOnPress = () => {} }) => {
    if (!stateSet) throw new Error('stateSet is required!');
    if (!menuStateSet) throw new Error('menuStateSet is required!');
    if (!options) throw new Error('options is required!');

    const [state, setState] = stateSet;
    const [menu, setMenu] = menuStateSet;

    return (
        <Menu
            visible={menu}
            onDismiss={() => setMenu(false)}
            anchor={(
                <Button
                    mode='contained'
                    dark
                    onPress={() => setMenu(true)}
                    style={{ elevation: 0 }}
                >
                    {state}
                </Button>
            )}
            theme={{ roundness: 0 }}
        >
            {options.map((option, index) => (
                <Menu.Item
                    key={index}
                    title={option}
                    onPress={() => {
                        optionOnPress(option);
                        setState(option);
                        setMenu(false);
                    }}
                />
            ))}
        </Menu>
    );
};