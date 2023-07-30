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
  blob: {
    save: (arrayBuffer) => {
      ipcRenderer.send("save-blob", {
        data: Array.from(new Uint8Array(arrayBuffer)),
        type: arrayBuffer.type,
      })
    },
  },
})

ipcRenderer.on("src-selected", (e, source) => {
  const selectBtn = document.querySelector("#btn-sel-src")
  selectBtn.textContent = source.name
  source.type = "screen-src"
  window.postMessage(JSON.stringify(source), "*")
})
