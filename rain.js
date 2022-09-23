const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");
const math = require("canvas-sketch-util/math");
const eases = require("eases");

const settings = {
  dimensions: [1080, 1080],
  animate: true,
  fps: 60,
};

const particles = [];

const sketch = ({ width, height }) => {
  let particle, x, y, acc;
  let numParticles = 10;

  for (let i = 0; i < numParticles; i++) {
    let t = i / (numParticles - 1);
    x = random.range(0, width);
    y = random.range(0, height);
    acc = random.range(5, 15);

    particle = new Particle({ x, y, acc });
    particles.push(particle);
  }

  return ({ context, width, height }) => {
    context.fillStyle = "#19262f";
    context.fillRect(0, 0, width, height);

    particles.forEach((particle) => {
      particle.update(height);
      particle.draw(context);
    });
  };
};

canvasSketch(sketch, settings);

class Particle {
  constructor({ x, y, acc }) {
    this.x = x;
    this.y = y;

    this.ax = 0;
    this.ay = 0;

    this.vx = 0;
    this.vy = 0;

    this.ix = x;
    this.iy = y;

    this.acc = acc;
  }

  update(height) {
    this.ay += this.acc;

    this.vy = this.acc;

    this.y += this.vy;

    if (this.y > height) {
      this.y = -40;
    }
  }

  draw(context) {
    context.save();
    context.lineWidth = math.mapRange(this.acc, 5, 15, 0.5, 3);
    context.strokeStyle = "#93b6dc";
    context.lineCap = "round";

    context.beginPath();
    context.moveTo(this.x, this.y);
    context.lineTo(this.x, this.y + math.mapRange(this.acc, 5, 15, 10, 20));
    context.stroke();
    context.restore();
  }
}
