const { app, ipcMain, desktopCapturer, Menu, dialog } = require("electron")
const path = require("path")
const { createWindow } = require("./helpers/window")
const { writeFileSync } = require("fs")

app.whenReady().then(() => {
  window = createWindow(
    path.join(__dirname, "ui", "index.html"),
    {
      width: 1900,
      height: 1000,
    },
    path.join(__dirname, "icon.ico")
  )

  // window.webContents.openDevTools()

  ipcMain.handle("show-dialog", async (e, type, options) => {
    if (type === "no-src-record") {
      dialog.showErrorBox(
        "No source found",
        "please select a video source first\n click on the button just below video display to select a source"
      )
    } else if (type === "save-recording") {
      dialog
        .showSaveDialog({
          title: "Save Video",
          buttonLabel: "save",
          defaultPath: `openrecorder-${Date.now()}.webm`,
          filters: {
            name: "WebM Files",
            extentions: ["webm"],
          },
        })
        .then((selected) => {
          console.log(selected)
          window.webContents.send("path-chosen", selected.filePath)
        })
    }
  })

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
