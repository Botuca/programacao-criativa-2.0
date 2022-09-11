const canvasSketch = require("canvas-sketch");
const math = require("canvas-sketch-util/math");
const random = require("canvas-sketch-util/random");
const Color = require("canvas-sketch-util/color");
const risoColors = require("riso-colors");

const seed = random.getRandomSeed();

const settings = {
  dimensions: [1080, 1080],
  name: seed,
};

const sketch = ({ context, width, height }) => {
  random.setSeed(seed);

  let x, y, w, h, fill, stroke, blend;

  const num = random.range(20, 1000);
  const degrees = random.range(0, 360);
  // const degrees = 90;

  const rects = [];

  const rectColors = ["#FBFCFF", "#EEB300", "#7E1F86", "#08759D"];

  const mask = {
    radius: width * 0.4,
    sides: 4,
    x: width * 0.5,
    y: height * 0.5,
  };

  for (let i = 0; i < num; i++) {
    x = random.range(0, width);
    y = random.range(0, height);
    w = random.range(100, 800);
    h = random.range(10, 100);

    fill = random.pick(rectColors);
    stroke = random.pick(rectColors);

    blend = random.value() > 0.5 ? "overlay" : "source-over";

    rects.push({ x, y, w, h, fill, stroke, blend });
  }

  return ({ context, width, height }) => {
    // context.fillStyle = random.pick(risoColors).hex;
    context.fillStyle = "#080808";
    context.fillRect(0, 0, width, height);

    context.save();
    context.translate(mask.x, mask.y);

    drawPolygon({ context, radius: mask.radius, sides: mask.sides });

    context.clip();

    rects.forEach((rect) => {
      const { x, y, w, h, fill, stroke, blend } = rect;
      let shadowColor;

      context.save();
      context.translate(-mask.x, -mask.y);
      context.translate(x, y);
      context.strokeStyle = stroke;
      context.fillStyle = fill;
      context.lineWidth = 10;

      context.globalCompositeOperation = "source-over";

      drawSkewedRect({ context, w, h, degrees });

      shadowColor = Color.offsetHSL(fill, 0, 0, -20);
      shadowColor.rgba[3] = 0.5;

      context.shadowColor = Color.style(shadowColor.rgba);
      context.shadowOffsetX = -10;
      context.shadowOffsetY = 20;

      context.fill();

      context.shadowColor = null;
      context.stroke();

      context.globalCompositeOperation = "source-over";

      context.lineWidth = 2;
      context.strokeStyle = "black";
      context.stroke();

      context.restore();
    });

    context.restore();

    //polygon outline
    context.save();
    context.translate(mask.x, mask.y);
    context.lineWidth = 20;

    drawPolygon({
      context,
      radius: mask.radius - context.lineWidth,
      sides: mask.sides,
    });

    context.globalCompositeOperation = "color-burn";
    context.strokeStyle = random.pick(rectColors);
    context.stroke();

    context.restore();
  };
};

const drawSkewedRect = ({ context, w = 600, h = 200, degrees = -45 }) => {
  const angle = math.degToRad(degrees);
  const rx = Math.cos(angle) * w;
  const ry = Math.sin(angle) * w;

  context.save();
  context.translate(rx * -0.5, (ry + h) * -0.5);

  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(rx, ry);
  context.lineTo(rx, ry + h);
  context.lineTo(0, h);
  context.closePath();

  context.restore();
};

const drawPolygon = ({ context, radius = 100, sides = 3 }) => {
  const slice = (Math.PI * 2) / sides;

  context.beginPath();
  context.moveTo(0, -radius);

  for (let i = 1; i < sides; i++) {
    const theta = i * slice - Math.PI * 0.5;
    context.lineTo(Math.cos(theta) * radius, Math.sin(theta) * radius);
  }

  context.closePath();
};

canvasSketch(sketch, settings);
