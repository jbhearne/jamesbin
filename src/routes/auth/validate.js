const upperStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const lowerStr = 'abcdefghijklmnopqrstuvwxyz';
const symbolStr = '!@#$%^&*()_-{}[]?';
const numberStr = '0123456789';

const forIncludes = (password, str) => {
  for (let i = 0; i < str.length; i++) {
    //console.log(password)
    if (password.includes(str[i])) return true;
  }
  return false;
}

module.exports = {
  password (password, options = {}) {
    const { 
      min = 6,
      max = 20, 
      upper = true, 
      lower = true, 
      number = true, 
      symbol = true, 
      exclude = '', 
      include = '', 
    } = options;

    const length = password.length >= min && password.length <= max;
    const upperCheck = upper ? forIncludes(password, upperStr) : true;
    const lowerCheck = lower ? forIncludes(password, lowerStr) : true;
    const numberCheck = number ? forIncludes(password, numberStr) : true;
    const symbolCheck = symbol ? forIncludes(password, symbolStr) : true;
    const excludeCheck =  exclude ? !forIncludes(password, exclude) : true;
    const includeCheck =  include ? forIncludes(password, include) : true;
    const isValid = length && upperCheck && lowerCheck && numberCheck && symbolCheck && excludeCheck && includeCheck;

    const message = {}
    if (!length) message.length = `Password must between ${min} and ${max} characters long.`;
    if (!upperCheck) message.upper = `Password must contain one uppercase leter.`;
    if (!lowerCheck) message.lower = `Password must contain one lowercase leter.`;
    if (!numberCheck) message.number = `Password must contain one number.`;
    if (!symbolCheck) message.symbol = `Password must contain one symbol: ${symbolStr}`;
    if (!excludeCheck) message.exclude = `Password must NOT contain any of the following: ${exclude}`;
    if (!includeCheck) message.include = `Password must contain one of the following: ${include}`;
    if (isValid) message.sucess = `Password accepted`;
    const allMessages = [];
    //message.forEach(msg => allMessages.push(msg));
    for (let msg in message){
      allMessages.push(message[msg])
    }
    const msg = allMessages.join(' | ')

    return {
      isValid: isValid,
      msg: msg,
      messages: message,
      options: {
        min: min,
        max: max, 
        upper: upper, 
        lower: lower, 
        number: number, 
        symbol: symbol, 
        exclude: exclude, 
        include: include,
      },
      strings: {
        upper: upperStr, 
        lower: lowerStr, 
        number: symbolStr, 
        symbol: numberStr,
      }
    } 
  }
}