export let refreshTokens = [];

export const addRefreshToken = (refreshToken) => {
    refreshTokens.push(refreshToken);
    console.log('User logged in, refreshTokens: ', refreshTokens);
};
export const deleteRefreshToken = (refreshToken) => {
    refreshTokens = refreshTokens.filter(token => token !== refreshToken);
    console.log('User logged out, refreshTokens: ', refreshTokens);
};