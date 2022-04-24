import React, { useState } from 'react';
import { Portal, Snackbar, Text, useTheme } from 'react-native-paper';
import Context from '../../context';
import { useSelfClues, useSelfCoupons } from '../../hooks';
import DailyCheckIn from './DailyCheckIn';

export default ({ children, userId }) => {
    const { colors } = useTheme();

    const [snackbar, setSnackbar] = useState(false);
    const [snackbarText, setSnackbarText] = useState('');
    const [snackbarAction, setSnackbarAction] = useState({});

    const showSnackbar = (text, action) => {
        setSnackbarText(text);
        setSnackbarAction(action);
        setSnackbar(true);
    };

    const [dailyCheckInDialog, setDailyCheckInDialog] = useState(true);

    const selfCluesHook = useSelfClues(userId);
    const selfCouponsHook = useSelfCoupons(userId);

    return (
        <Context.Provider
            value={{
                ...selfCluesHook,
                ...selfCouponsHook,
                getSelfClueByClueId: clueId => selfCluesHook.selfClues.find(_clue => _clue._id === clueId) || {},
                showSnackbar,
                setDailyCheckInDialog,
            }}
        >
            {children}
            <Portal>
                <Snackbar
                    visible={snackbar}
                    onDismiss={() => {
                        setSnackbar(false);
                        setSnackbarText('');
                        setSnackbarAction({});
                    }}
                    duration={5000}
                    action={snackbarAction}
                    style={{
                        backgroundColor: colors.background2,
                        borderColor: colors.primary,
                        borderWidth: 1,
                    }}
                    theme={{
                        colors: {
                            surface: colors.primary,
                        },
                    }}
                >
                    <Text
                        style={{
                            color: colors.primary,
                            fontSize: 15,
                        }}
                    >
                        {snackbarText}
                    </Text>
                </Snackbar>
                <DailyCheckIn
                    visible={dailyCheckInDialog}
                    close={() => setDailyCheckInDialog(false)}
                    showSnackbar={showSnackbar}
                />
            </Portal>
        </Context.Provider>
    );
};