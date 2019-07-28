var fs = require('fs');

var readMe = fs.readFileSync('README.md', 'utf8');
console.log(readMe); 
