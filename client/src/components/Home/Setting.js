import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { Divider, List } from 'react-native-paper';
import SelectButton from './SelectButton';
import * as  SecureStorage from 'expo-secure-store';
import { constants, pageNameENtoCH } from '../../utils';
import { useUpdateEffect } from '../../hooks';

export default () => {
    const [initialRoute, setInitialRoute] = useState(constants.pageNames[2]);
    const [menu, setMenu] = useState(false);

    useUpdateEffect(() => {
        (async () => {
            const originalLocalState = JSON.parse(await SecureStorage.getItemAsync('localState'));
            await SecureStorage.setItemAsync('localState', JSON.stringify({
                ...originalLocalState,
                initialRoute,
            }));
        })();
    }, () => {
        (async () => setInitialRoute(JSON.parse(await SecureStorage.getItemAsync('localState')).initialRoute))();
    }, [initialRoute]);

    return (
        <ScrollView
            style={{
                flex: 1,
                backgroundColor: 'white',
            }}
        >
            <List.Section style={{ marginVertical: 0 }}>
                <List.Item
                    title='初始頁面'
                    right={props => (
                        <SelectButton
                            {...props}
                            stateSet={[initialRoute, setInitialRoute]}
                            menuStateSet={[menu, setMenu]}
                            options={constants.pageNames}
                            titles={constants.pageNames.map(name => pageNameENtoCH(name))}
                            optionOnPress={setInitialRoute}
                            uppercase={false}
                        />
                    )}
                />
                <Divider style={{ height: 1 }} />
            </List.Section>
        </ScrollView>
    );
};