const fs = require('fs');

fs.writeFile('Procfile', "web: npm run start-client", err => {
  if (err) {
    console.error(err);
  }
});
