#!/bin/sh

git remote add heroku https://git.heroku.com/board-game-companion-app-api.git
git pull heroku main
git add .
git commit -m "deploy"
git push heroku main