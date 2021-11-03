const MegaHash = require('./main.js');
const MegaMap = require('./MegaMap.js');

// Add MegaMap as static member
MegaHash.MegaMap = MegaMap;

module.exports = MegaHash;
