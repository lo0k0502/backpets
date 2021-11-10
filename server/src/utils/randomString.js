const codeArray = (low, high) => {
    const array = [];
    for (let i = low; i <= high; i++) {
        array.push(i);
    }
    return array;
};

const uppercase = codeArray(65, 90);
const lowercase = codeArray(97, 122);
const number = codeArray(48, 57);
const symbol = codeArray(33, 47).concat(codeArray(58, 64)).concat(codeArray(91, 96)).concat(codeArray(123, 126));

/**
 * @param {Number} length length of the random password
 * @param {boolean} addUpper whether uppercase letters should be included
 * @param {boolean} addNum whether numbers should be included
 * @param {boolean} addSymbol whether symbols should be included
 * @returns {string}
 */
export default (length, addUpper = false, addNum = false, addSymbol = false) => {
    let codes = lowercase;
    if (addUpper) codes = codes.concat(uppercase);
    if (addNum) codes = codes.concat(number);
    if (addSymbol) codes = codes.concat(symbol);

    const array = [];
    for (let i = 0; i < length; i++) {
        const code = Math.floor(Math.random() * codes.length);
        const charCode = codes[code];
        array.push(String.fromCharCode(charCode));
    }
    return array.join('');
};