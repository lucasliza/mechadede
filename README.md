[![Build Status](https://david-dm.org/lzia/mechadede.svg)](https://david-dm.org/lzia/mechadede)
# MechaDédé
![André Marques](http://ejesa.statig.com.br/bancodeimagens/9z/2j/8r/9z2j8r7jvfvu4e5axwmktm0pj.jpg)
## About
A [Discord](https://discordapp.com/) chat bot!

## Local Configuration

Rename `config.json.example` to `config.json` and fill in the required information.

## Local Installation
#### Windows:
**Warning**: Windows may have issues, even if all steps are done, sadly.

- Install [node.js](https://nodejs.org/en/) v4.0 or higher
- Install [python v2.7.3](https://www.python.org) ([32 bit](https://www.python.org/ftp/python/2.7.3/python-2.7.3.msi), [64 bit](https://www.python.org/ftp/python/2.7.3/python-2.7.3.amd64.msi))
- Install [node-gyp](https://github.com/nodejs/node-gyp) (open the [command prompt](http://windows.microsoft.com/en-us/windows/command-prompt-faq) and write `npm install -g node-gyp`)
- Install the Cairo library bundled with GTK [Win64](http://ftp.gnome.org/pub/GNOME/binaries/win64/gtk+/2.22/gtk+-bundle_2.22.1-20101229_win64.zip)/[Win32](http://ftp.gnome.org/pub/GNOME/binaries/win32/gtk+/2.24/gtk+-bundle_2.24.10-20120208_win32.zip)
- Run `npm-install.bat` to install the Node dependencies
- Run `launch.bat` to start the bot

#### Linux:
- Install [node.js](https://nodejs.org/en/) v4.0 or higher
- Install [Cairo](https://cairographics.org/download/) and other libraries (`sudo apt-get install libcairo2-dev libjpeg62-turbo-dev libpango1.0-dev libgif-dev g++-4.8`)
- Install [node-gyp](https://github.com/nodejs/node-gyp) (open the [terminal](http://www.howtogeek.com/140679/beginner-geek-how-to-start-using-the-linux-terminal/) and write `sudo npm install -g node-gyp`)
- [cd](https://en.wikipedia.org/wiki/Cd_%28command%29) to the root directory and run `npm install`
- Run `npm start` or `npm forever`


## Updating

Updating MechaDede is just like any other NodeJS app. Just run `git pull && npm install`.

---

## Feature Requests

Have a feature in mind? I'd love to hear about it. Feel free to [open an issue](https://github.com/lzia/mechadede/issues/new) and let me know.
