const { join } = require("path")

module.exports = {
  // ...
  packagerConfig: {
    icon: "./icon.ico", // no file extension required
  },
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {
        // An URL to an ICO file to use as the application icon (displayed in Control Panel > Programs and Features).
        icon: join(__dirname, "icon.ico"),
        // The ICO file to use as the icon for the generated Setup.exe
        // setupIcon: "./icon.ico",
      },
    },
    {
      // Path to a single image that will act as icon for the application
      name: "@electron-forge/maker-deb",
      config: {
        options: {
          icon: join(__dirname, "icon.ico"),
        },
      },
    },
    {
      // Path to the icon to use for the app in the DMG window
      name: "@electron-forge/maker-dmg",
      config: {
        icon: join(__dirname, "icon.icns"),
      },
    },
    // {
    //   name: "@electron-forge/maker-wix",
    //   config: {
    //     icon: join(__dirname, "icon.ico"),
    //     ui: {
    //       choseDirectory: true,
    //       //   images: {
    //       //     // banner: "./icon.png",
    //       //   },
    //     },
    //   },
    // },
  ],
}
