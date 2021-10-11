interface resetTokenUser {
    username: string,
    email: string,
    resetToken: string,
};

export let resetTokenUsers: Array<resetTokenUser> = [];

export const addResetTokenUser = (user: resetTokenUser) => {
    resetTokenUsers.push(user);
};
export const deleteResetTokenUser = (targetUser: resetTokenUser) => {
    resetTokenUsers = resetTokenUsers.filter(user => !(user.username === targetUser.username && user.email === targetUser.email));
};