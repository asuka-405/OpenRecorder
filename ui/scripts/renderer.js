const { capture, dialog, buffer, openMenu, sync } = window.electron

const videoDisplay = document.querySelector("#capture-display")
const selectBtn = document.querySelector("#btn-sel-src")
const recordBtn = document.querySelector("#btn-play-pause")
const mimeBtn = document.querySelector("#btn-sel-file-type")
const timerDisplay = document.querySelector("#timer")

let source
let recording = false
let mediaRecorder
let saveExtn = "webm"
let mediaMimeType = "video/webm; codecs=vp9"
const recordedChunks = []
const curBuffer = {
  buffer: undefined,
}

function formatTime(milliseconds) {
  const pad = (num) => num.toString().padStart(2, "0")
  const ms = pad(milliseconds % 100)
  const sec = pad(Math.floor((milliseconds / 1000) % 60))
  const min = pad(Math.floor((milliseconds / (1000 * 60)) % 60))
  const hr = pad(Math.floor((milliseconds / (1000 * 60 * 60)) % 24))
  return `${hr}:${min}:${sec}.${ms}`
}

let timer
let time = 0
function startTimer() {
  if (timer) {
    timerDisplay.innerHTML = "00:00:00:00"
    clearInterval(timer)
  }
  timer = setInterval(() => {
    time += 10
    timerDisplay.innerHTML = formatTime(time)
  }, 10)
}

mimeBtn.addEventListener("click", () => {
  openMenu("select-mime", mediaFormats)
})

window.onmessage = async (e) => {
  if (e.source === window) {
    const data = JSON.parse(e.data)
    if (data.type === "screen-src") {
      source = { ...data }
      if (!source) setTimeout(() => {}, 1000)

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          mandatory: {
            chromeMediaSource: "desktop",
            chromeMediaSourceId: source.id,
          },
        },
        video: {
          mandatory: {
            chromeMediaSource: "desktop",
            chromeMediaSourceId: source.id,
          },
        },
      })

      mediaRecorder = new MediaRecorder(stream, {
        mimeType: mediaMimeType,
      })
      mediaRecorder.ondataavailable = handleDataAvailable
      mediaRecorder.onstop = handleStop

      videoDisplay.srcObject = stream
      videoDisplay.muted = true
      videoDisplay.play()
    } else if (data.type === "chosen-path") {
      sync.writeFile(data.path, curBuffer.buffer)
    } else if (data.type === "chosen-format") {
      delete data.type
      mediaMimeType = data.mimeType
      saveExtn = data.extention
    }
  }
}

selectBtn.addEventListener("click", async () => {
  capture.getMediaSources()
})

recordBtn.addEventListener("click", () => {
  if (!source) {
    dialog.show("no-src-record")
    return
  }
  if (recording) {
    recordBtn.querySelector("#text").textContent = "Start Recording"
    recordBtn.querySelector("img").src = "./assets/play.svg"
    mediaRecorder.stop()
    clearInterval(timer)
  } else {
    recordBtn.querySelector("#text").textContent = "Stop Recording"
    recordBtn.querySelector("img").src = "./assets/stop.svg"
    mediaRecorder.start()
    startTimer()
  }
  recording = !recording
})

function handleDataAvailable(e) {
  recordedChunks.push(e.data)
}
async function handleStop(e) {
  const cur = await buffer.from(
    await new Blob(recordedChunks, {
      type: mediaMimeType,
    }).arrayBuffer()
  )
  curBuffer.buffer = cur
  dialog.show("save-recording", saveExtn)
  recordedChunks.splice(0, recordedChunks.length)
}
