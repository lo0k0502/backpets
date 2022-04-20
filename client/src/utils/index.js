import _constants from './constants';
import * as Location from 'expo-location';

export default {
    constants: _constants,
    isEmptyObject,
};

export const constants = _constants;

export const isEmptyObject = (obj) => !Object.keys(obj).length;
export const isAsyncFunction = (fn) => fn instanceof _constants.AsyncFunction;

export const pageNameENtoCH = (pageName) => {
    switch (pageName) {
        case 'ProfileRoute': return '個人檔案';
        case 'Map': return '地圖';
        case 'PostsRoute': return '貼文';
        case 'StoreRoute': return '商店';
        case 'AdoptionRoute': return '領養專區';
        default: throw new Error(`Unknown pageName: ${pageName}`);
    }
};

export const isPageInitialWithSearchbar = (index) => {
    return [false, true, false, false, false][index];
};

export const routeNametoTitle = (routeName) => {
    switch (routeName) {
        case 'BottomNavigation':
        case 'ProfileRoute':
        case 'PostsRoute':
        case 'StoreRoute':
        case 'AdoptionRoute':
        case 'Profile':
            return 'BackPets';
        case 'Coupon': return '持有兌換券';
        case 'EditProfile': return '編輯個人資料';
        case 'PetPassports': return '寵物護照列表';
        case 'SelfMissions': return '發布過的任務';
        case 'SelfPutUpForAdoptions': return '發布過的送養貼文';
        case 'SelfClues': return '回報過的線索';
        case 'PutAdoptionRecord': return '送養紀錄';
        case 'AdoptionRecord': return '領養紀錄';
        case 'PointRecord': return '點數紀錄';
        case 'ChangePassword': return '更改密碼';
        case 'Clue': return '線索';
        case 'Feedback': return '意見回饋';
        case 'Setting': return '設定';
        default: return routeName;
    }
};

export const postTypeENtoCH = (postType) => {
    switch (postType) {
        case 'mission': return '任務';
        case 'report': return '通報';
        case 'putUpForAdoption': return '送養';
        default: throw new Error('Unknown postType!');
    }
};

export const iconCHtoEN = (name) => {
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

export const askForLocationPermission = async () => {
    const previousPermission = await Location.getForegroundPermissionsAsync();
    console.log('previousPermission: ', previousPermission)
    if (previousPermission.status !== 'granted') {
      const askedPermission = await Location.requestForegroundPermissionsAsync();
      console.log('askedPermission: ', askedPermission)
      if (askedPermission.status !== 'granted') {
        return false;
      }
    }
    return true;
};

/**
 * 
 * @param {Number} width 
 * @param {Number} height 
 * @param {Number} maxWidth 
 * @param {Number} maxHeight 
 * @param {Number} shrinkRatio 
 * @returns {{
 *  width: Number,
 *  height: Number,
 * }}
 */
export const shrinkImage = (width, height, maxWidth, maxHeight, shrinkRatio = 2 / 3) => {
    let w = width;
    let h = height;

    maxWidth = maxWidth || Infinity;
    maxHeight = maxHeight || Infinity;
console.log(w, h)
    while (w > maxWidth || h > maxHeight) {
        w *= shrinkRatio;
        h *= shrinkRatio;
        console.log('after', w, h)
    }

    return {
        width: w,
        height: h,
    };
};

export const shrinkImageToTargetSize = (width, height, targetWidth, targetHeight) => {
    let w = width;
    let h = height;

    if (!!targetWidth) {
        w = targetWidth;
        h *= targetWidth / width;
    } else {
        if (!targetHeight) throw new Error('At least one target should be provided!');

        h = targetHeight;
        w *= targetHeight / height;
    }

    return {
        width: w,
        height: h,
    };
};