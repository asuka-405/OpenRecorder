const { BrowserWindow } = require("electron")
const path = require("path")

const createWindow = (file, { width, height }) => {
  const window = new BrowserWindow({
    width,
    height,
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
