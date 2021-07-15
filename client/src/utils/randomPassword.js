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

const randomPassword = (length, addUpper, addNum, addSymbol) => {
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

export default randomPassword;