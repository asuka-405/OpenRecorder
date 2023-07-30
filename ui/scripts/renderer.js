const { capture, dialog, blob } = window.electron

const videoDisplay = document.querySelector("#capture-display")
const selectBtn = document.querySelector("#btn-sel-src")
const recordBtn = document.querySelector("#btn-play-pause")
let source
let recording = false
let mediaRecorder
const recordedChunks = []

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
        mimeType: "video/webm; codecs=vp9",
      })
      mediaRecorder.ondataavailable = handleDataAvailable
      mediaRecorder.onstop = handleStop

      videoDisplay.srcObject = stream
      videoDisplay.muted = true
      videoDisplay.play()
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
  } else {
    recordBtn.querySelector("#text").textContent = "Stop Recording"
    recordBtn.querySelector("img").src = "./assets/stop.svg"
    mediaRecorder.start()
  }
  recording = !recording
})

function handleDataAvailable(e) {
  console.log("started")
  recordedChunks.push(e.data)
}
async function handleStop(e) {
  const arrayBuffer = new Blob(recordedChunks, {
    type: "video/webm; codecs=vp9",
  }).arrayBuffer()

  blob.save(arrayBuffer)
}
