const { contextBridge, ipcRenderer } = require("electron")

contextBridge.exposeInMainWorld("electron", {
  capture: {
    getMediaSources: () => {
      return ipcRenderer.invoke("get-capture-src")
    },
  },
})

ipcRenderer.on("src-selected", (e, source) => {
  const selectBtn = document.querySelector("#btn-sel-src")
  selectBtn.textContent = source.name
})
