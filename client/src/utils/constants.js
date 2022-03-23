import { Platform } from 'react-native';

const animalTagsArray = [
    '貓',
    '狗',
    '兔子',
    '鳥類',
    '昆蟲',
    '魚',
    '烏龜',
    '家禽',
    '熊貓',
    '鼠類',
    '爬蟲類',
    '其他',
];

const reportTagsArray = [
    '流浪動物',
    '具攻擊性',
    '受傷動物',
    '死亡動物',
    '其他',
];

const iconCHtoEN = (name) => {
    switch (name) {
        case '貓': return 'cat';
        case '狗': return 'dog';
        case '兔子': return 'rabbit';
        case '魚': return 'fish';
        case '昆蟲': return 'bee';
        case '鳥類': return 'owl';
        case '牛': return 'cow';
        case '豬': return 'pig';
        case '羊': return 'sheep';
        case '烏龜': return 'tortoise';
        case '驢': return 'donkey';
        case '家禽': return 'duck';
        case '大象': return 'elephant';
        case '企鵝': return 'penguin';
        case '貓頭鷹': return 'owl';
        case '熊貓': return 'panda';
        case '鼠類': return 'rodent';
        case '爬蟲類': return 'google-downasaur';
        case '蜘蛛': return 'spider';
        case '流浪動物': return 'paw';
        case '具攻擊性': return 'close-octagon-outline';
        case '受傷動物': return 'needle';
        case '死亡動物': return 'emoticon-dead-outline';
        case '其他': return 'pound';
        default: return null;
    }
};

const backIcon = Platform.OS === 'ios' ? 'chevron-left' : 'arrow-left';

export {
    animalTagsArray,
    reportTagsArray,
    backIcon,
    iconCHtoEN,
};