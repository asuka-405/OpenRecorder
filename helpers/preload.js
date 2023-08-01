const { contextBridge, ipcRenderer } = require("electron")
const { writeFileSync } = require("original-fs")

contextBridge.exposeInMainWorld("electron", {
  capture: {
    getMediaSources: () => {
      return ipcRenderer.invoke("get-capture-src")
    },
  },
  dialog: {
    show: (type, options) => {
      return ipcRenderer.invoke("show-dialog", type, options)
    },
  },
  buffer: {
    from: (data, encoding) => {
      return Buffer.from(data, encoding)
    },
  },
  sync: {
    writeFile: (path, data) => writeFileSync(path, data),
  },
  openMenu: (type, items) => ipcRenderer.invoke(type, items),
})

ipcRenderer.on("src-selected", (e, source) => {
  const selectBtn = document.querySelector("#btn-sel-src")
  selectBtn.textContent = source.name
  source.type = "screen-src"
  window.postMessage(JSON.stringify(source), "*")
})

ipcRenderer.on("path-chosen", (e, path) => {
  path = {
    type: "chosen-path",
    path,
  }
  window.postMessage(JSON.stringify(path), "*")
})

ipcRenderer.on("mime-chosen", (e, format) => {
  format = {
    type: "chosen-format",
    ...format,
  }
  window.postMessage(JSON.stringify(format))
})
