const { capture } = window.electron

const selectBtn = document.querySelector("#btn-sel-src")

selectBtn.addEventListener("click", () => capture.getMediaSources())
