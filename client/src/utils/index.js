import * as _constants from './constants';

export default {
    constants: _constants,
    isEmptyObject,
};

export const constants = _constants;

export const isEmptyObject = (obj) => !Object.keys(obj).length;