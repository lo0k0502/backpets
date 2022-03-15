import { Platform } from 'react-native';

const tagsArray = [
    '貓',
    '狗',
    '兔子',
    '鳥類',
    '魚',
    '烏龜',
    '鴨子',
    '熊貓',
    '鼠',
    '爬蟲類',
    '其他',
];

const animalIconCHtoEN = (name) => {
    switch (name) {
        case '貓': return 'cat';
        case '狗': return 'dog';
        case '兔子': return 'rabbit';
        case '魚': return 'fish';
        case '牛': return 'cow';
        case '豬': return 'pig';
        case '羊': return 'sheep';
        case '烏龜': return 'tortoise';
        case '驢': return 'donkey';
        case '鴨子': return 'duck';
        case '大象': return 'elephant';
        case '企鵝': return 'penguin';
        case '貓頭鷹': return 'owl';
        case '熊貓': return 'panda';
        case '老鼠': return 'rodent';
        case '蜘蛛': return 'spider';
        default: return null;
    }
};

const backIcon = Platform.OS === 'ios' ? 'chevron-left' : 'arrow-left';

export {
    tagsArray,
    backIcon,
    animalIconCHtoEN,
};