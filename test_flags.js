require('ts-node/register');
const { COUNTRY_DATA } = require('./src/constants/countries');
const badCodes = ['AN', 'BU', 'CE', 'EL', 'KO'];
badCodes.forEach(code => {
    const c = COUNTRY_DATA.find(x => x.code === code);
    if (c) console.log("Found:", c);
    else console.log("Missing:", code);
});
