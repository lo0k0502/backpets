export default {
    isEmptyObject,
};

export const isEmptyObject = (obj) => !Object.keys(obj).length;