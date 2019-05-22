# Rubix Desktop Wrapper

This is a minimal Electron application based on the [Quick Start Guide](http://electron.atom.io/docs/tutorial/quick-start) within the Electron documentation.


## Setting Up

```bash
# Clone this repository

npm install

# see it in action
npm start
```

## Prepare for windows distribution
**Install electron-packager**
- npm install -g electron-packager

**Build windows distributable**
- npm run package-win

**Create the setup**
- you need to download the "inno setup" and install the software http://www.jrsoftware.org
- build your distributable
- open desktop-wrapper\windows-setup\setup.iss
- Check the file paths, other parameters
- Add a sign tool. Eg: "E:\Office\src\Work Dir\desktop-wrapper\windows-setup\SignTool\signtool.exe" sign /f "E:\Office\src\Work Dir\desktop-wrapper\windows-setup\MFS-BSC.pfx" /t http://timestamp.comodoca.com/authenticode $f
- Click run to create the setup
- Sign tool configuration https://doughennig.blogspot.com/2009/11/executable-signing-with-inno-setup.html

## Prepare distribution for Mac

**Build for Appstore**

- Install .p12 files in mac-sign-materials/certificates
- type `npm run mac-appstore` in console within project directory
- find the .app in release-builds-mac/MubasherTrade-mas-x64 path

**Build for distribution outside Appstore**

- Install .p12 files in mac-sign-materials/certificates/Developer-id
- type `npm run package-mac` in console within project directory
- once that command completes type `npm run create-dmg` in console to create .dmg file
- find the .dmg in release-builds-mac

## Resources for Learning Electron

- [electron.atom.io/docs](http://electron.atom.io/docs) - all of Electron's documentation
- [electron.atom.io/community/#boilerplates](http://electron.atom.io/community/#boilerplates) - sample starter apps created by the community
- [electron/electron-quick-start](https://github.com/electron/electron-quick-start) - a very basic starter Electron app
- [electron/simple-samples](https://github.com/electron/simple-samples) - small applications with ideas for taking them further
- [electron/electron-api-demos](https://github.com/electron/electron-api-demos) - an Electron app that teaches you how to use Electron
- [hokein/electron-sample-apps](https://github.com/hokein/electron-sample-apps) - small demo apps for the various Electron APIs

## License

[CC0 1.0 (Public Domain)](LICENSE.md)
