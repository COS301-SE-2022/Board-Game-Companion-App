const fs = require('fs');

fs.writeFile('Procfile', "web: npm run start-api", err => {
  if (err) {
    console.error(err);
  }
});
