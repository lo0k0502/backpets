export const routes = [
    { name: '使用者', routeName: 'user' },
    { name: '任務', routeName: 'mission' },
    { name: '意見回饋', routeName: 'feedback' },
    { name: '檢舉', routeName: 'violation-report' },
];

export const postTypeENtoCH = (postType) => {
    switch (postType) {
        case 'mission': return '任務';
        case 'report': return '通報';
        case 'putUpForAdoption': return '送養';
        default: throw new Error('Unknown postType!');
    }
};