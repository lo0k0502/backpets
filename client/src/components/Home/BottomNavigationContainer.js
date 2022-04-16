import React, { useState } from 'react';
import { Portal, Snackbar, useTheme } from 'react-native-paper';
import Context from '../../context';
import { useSelfClues } from '../../hooks';

export default ({ children, userId }) => {
    const { colors } = useTheme();

    const [snackbar, setSnackbar] = useState(false);
    const [snackbarText, setSnackbarText] = useState('');
    const [snackbarAction, setSnackbarAction] = useState({});

    const selfCluesHook = useSelfClues(userId);

    return (
        <Context.Provider
            value={{
                ...selfCluesHook,
                getSelfClueByClueId: clueId => selfCluesHook.selfClues.find(_clue => _clue._id === clueId) || {},
                showSnackbar: (text, action) => {
                    setSnackbarText(text);
                    setSnackbarAction(action);
                    setSnackbar(true);
                },
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
                    style={{ backgroundColor: colors.primary }}
                    theme={{ colors: { surface: 'white', accent: colors.background2 } }}
                >
                    {snackbarText}
                </Snackbar>
            </Portal>
        </Context.Provider>
    );
};