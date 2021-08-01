export let refreshTokens = [];

export const addRefreshToken = (refreshToken) => refreshTokens.push(refreshToken);
export const deleteRefreshToken = (refreshToken) => refreshTokens = refreshTokens.filter(token => token !== refreshToken);