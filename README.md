# POS

### First Terminal

> cd client

> yarn install / npm install

> yarn start / npm run start

### Second Terminal

> cd server

> yarn install / npm install

> yarn dev / npm dev

## Building

### First Terminal

> cd client

> yarn build / npm build

### Second Terminal

- #### install nexe
- > npm i nexe -g

> cd server

> nexe server.js -r "../client/build/\*_/_" -r "." -o POS.exe
