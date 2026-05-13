
    const container = document.getElementById("canvasContainer");

    const baseCanvas = document.getElementById("baseCanvas");
    const baseCtx = baseCanvas.getContext("2d");

    const overlayCanvas = document.getElementById("overlayCanvas");
    const overlayCtx = overlayCanvas.getContext("2d");

    const traceOverlayCanvas = document.getElementById("traceOverlayCanvas");
    const traceOverlayCtx = traceOverlayCanvas.getContext("2d");

    const darkMQ = window.matchMedia("(prefers-color-scheme: dark)");

    const theme = () => ({
      bg: darkMQ.matches ? "#111111" : "#ffffff",
      stroke: darkMQ.matches ? "#ffffff" : "#000000",
      highlight: "blue",
    });

    const applyTheme = () => {
      document.body.classList.toggle("dark", darkMQ.matches);
    };

    applyTheme();
    darkMQ.addEventListener("change", () => {
      applyTheme();
      redrawAll();
    });

    const resizeCanvases = () => {
      const size = container.offsetWidth;
      [baseCanvas, overlayCanvas, traceOverlayCanvas].forEach(c => {
        c.width = size;
        c.height = size;
      });
    };

    resizeCanvases();

    let isDrawing = false;
    let mouseX = 0;
    let mouseY = 0;

    const drawRectangle = (w, h, x, y, ctx, color = theme().stroke, lineWidth = 2) => {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.rect(x, y, w, h);
      ctx.stroke();
    }

    const drawCircle = (i, ctx) => {
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.arc(130 * i, 130, 25, 0, 2 * Math.PI);
      ctx.stroke();
    }

    const width = 60;
    const height = 60;
    const x = 100;
    const y = 100;

    const gridCount = () => Math.max(1, Math.floor((baseCanvas.width - width) / x));

    const gridOffset = (count) => (baseCanvas.width - (x * (count - 1) + width)) / 2;

    const drawBaseCanvas = () => {
      baseCtx.clearRect(0, 0, baseCanvas.width, baseCanvas.height);
      const count = gridCount();
      const offset = gridOffset(count);
      for (let i = 0; i < count; i++) {
        for (let j = 0; j < count; j++) {
          drawRectangle(width, height, offset + x * i, offset + y * j, baseCtx);
        }
      }
    }

    const drawOverlayCanvas = (mouseX, mouseY) => {
      const count = gridCount();
      const offset = gridOffset(count);
      for (let i = 0; i < count; i++) {
        for (let j = 0; j < count; j++) {
          const rx = offset + x * i;
          const ry = offset + y * j;
          if (Math.random() > 0.5 && !(mouseX > rx && mouseX < rx + width && mouseY > ry && mouseY < ry + height)) {
            drawRectangle(
              width / 1.2,
              height / 1.2,
              rx + width / 12,
              ry + height / 12,
              overlayCtx
            );
          }
        }
      }
    }

    const drawTraceOverlayCanvas = (mouseX, mouseY) => {
      const count = gridCount();
      const offset = gridOffset(count);
      for (let i = 0; i < count; i++) {
        for (let j = 0; j < count; j++) {
          const rx = offset + x * i;
          const ry = offset + y * j;
          if (mouseX > rx && mouseX < rx + width &&
            mouseY > ry && mouseY < ry + height) {
            drawRectangle(
              width / 1.2,
              height / 1.2,
              rx + width / 12,
              ry + height / 12,
              traceOverlayCtx,
              "#4A9EE8",
              4
            );
          }
        }
      }
    }

    const redrawAll = () => {
      drawBaseCanvas();
      overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
      drawOverlayCanvas(mouseX, mouseY);
      traceOverlayCtx.clearRect(0, 0, traceOverlayCanvas.width, traceOverlayCanvas.height);
      drawTraceOverlayCanvas(mouseX, mouseY);
    };

    drawBaseCanvas();

    window.addEventListener("resize", () => {
      resizeCanvases();
      redrawAll();
    });

    setInterval(() => {
      overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
      drawOverlayCanvas(mouseX, mouseY);
    }, 1000);

    const mouseEvent = (event) => {
      if (isDrawing) return;
      isDrawing = true;
      traceOverlayCtx.clearRect(0, 0, traceOverlayCanvas.width, traceOverlayCanvas.height);
      mouseX = event.offsetX;
      mouseY = event.offsetY;

      drawTraceOverlayCanvas(mouseX, mouseY);
      isDrawing = false;
    }

