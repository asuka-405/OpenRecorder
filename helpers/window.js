const { BrowserWindow } = require("electron")
const path = require("path")

const createWindow = (file) => {
  const window = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    },
  })

  window.loadFile(file)
  return window
}

module.exports = { createWindow }
