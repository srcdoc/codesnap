const download = document.querySelector("#download");
const code = document.querySelector("#code");
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

function getLongestText(source) {
  return source.reduce((max, val) => (
    max.length < val.length && (max = val), max
  ), "");
}

function doSetupCanvas(fontsize) {
  let margin = 12,
    rad = 8,
    color,
    i = 0,
    colors = {"ff5f5a": 10, "ffbe2e": 30, "2aca44": 50};

  ctx.fillStyle = "#303841";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = fontsize + "px monospace";

  for(color in colors) {
    ctx.beginPath();
    // Drawing circle
    ctx.arc(margin + colors[color] + i * 5, rad + margin, rad, 0, 2 * Math.PI);
    ctx.fillStyle = "#" + color;
    ctx.fill();
    i++;
  }
}

function buildSnap(source) {
  canvas.width = 300; // Set default width
  canvas.height = 150; // Set default height

  let fontsize = 17, textWidth, maxLineWidth, textX, line, lineAlign, lineWidth;

  doSetupCanvas(fontsize);

  // Render source code in canvas
  if (source && (source[0] !== '' || source.length > 1)) {
    textWidth = ctx.measureText(getLongestText(source)).width;

    canvas.width = textWidth + 80; // 80 is right margin of canvas
    canvas.height = (fontsize * source.length) + 74; // 74 bottom margin

    doSetupCanvas(fontsize);

    maxLineWidth = ctx.measureText(source.length).width;

    for(i = 0; i < source.length; i++) {
      line = (i + 1).toString(); // getting line number
      lineWidth = ctx.measureText(line).width;

      lineAlign = maxLineWidth - lineWidth;
      textX = lineAlign + 15; // 15 is left line margin

      // Handle Line number
      ctx.fillStyle = "#0fb6b6";
      ctx.fillText(line, textX, fontsize * (i + 3.5));

      // Handle Source code
      ctx.fillStyle = "#2aca44";
      // 25 is line gap
      ctx.fillText(source[i], textX + lineWidth + 25, fontsize * (i + 3.5));
    }
  }
}

code.addEventListener("input", () => buildSnap(code.value.split(/[\r\n]/g)));
buildSnap();

// Handle Download System
download.addEventListener("click", () => {
  let anchor = document.createElement("a");
  anchor.href = canvas.toDataURL("image/png");
  anchor.download = Date.now();
  anchor.click();
});