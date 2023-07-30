const { app, ipcMain, desktopCapturer, Menu } = require("electron")
const path = require("path")
const { createWindow } = require("./helpers/window")

app.whenReady().then(() => {
  window = createWindow(path.join(__dirname, "ui", "index.html"))
  window.webContents.openDevTools()

  ipcMain.handle("get-capture-src", async () => {
    const sources = await desktopCapturer.getSources({
      types: ["window", "screen"],
    })
    const srcMenu = Menu.buildFromTemplate(
      sources.map((source) => {
        return {
          label: source.name,
          click: () => window.webContents.send("src-selected", source),
        }
      })
    )
    srcMenu.popup()
  })
})

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})
