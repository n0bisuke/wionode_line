起動テスト雛形

```server.js
'use strict'

const HTTP = require('http');
const PORT = process.env.PORT || 3000;

HTTP.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end(`Hello Node.js!!!!!!\n ${process.version}`);
}).listen(PORT);

console.log(`Server running at ${PORT}`);
```