// app/digitalgift/BirthdayFireworks.tsx
"use client";
import { useEffect, useRef } from 'react';

const PI2 = Math.PI * 2;
const random = (min: number, max: number) => (Math.random() * (max - min + 1) + min) | 0;
const timestamp = () => new Date().getTime();

class Birthday {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  fireworks: Firework[];
  counter: number;
  spawnA: number;
  spawnB: number;
  spawnC: number;
  spawnD: number;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.resize();

    this.fireworks = [];
    this.counter = 0;

    window.onresize = this.resize.bind(this);
    this.canvas.addEventListener('click', this.onClick.bind(this));
    this.canvas.addEventListener('touchstart', this.onClick.bind(this));
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    const center = (this.width / 2) | 0;
    this.spawnA = center - center / 4 | 0;
    this.spawnB = center + center / 4 | 0;

    this.height = this.canvas.height = window.innerHeight;
    this.spawnC = this.height * 0.1;
    this.spawnD = this.height * 0.5;
  }

  onClick(evt: MouseEvent | TouchEvent) {
    const x = (evt as MouseEvent).clientX || (evt as TouchEvent).touches[0].pageX;
    const y = (evt as MouseEvent).clientY || (evt as TouchEvent).touches[0].pageY;

    const count = random(3, 10);
    for (let i = 0; i < count; i++) {
      this.fireworks.push(
        new Firework(
          random(this.spawnA, this.spawnB),
          this.height,
          x,
          y,
          random(0, 260),
          random(30, 110)
        )
      );
    }

    this.counter = -1;
  }

  update(delta: number) {
    this.ctx.globalCompositeOperation = 'hard-light';
    this.ctx.fillStyle = `rgba(20,20,20,${7 * delta})`;
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.ctx.globalCompositeOperation = 'lighter';
    for (const firework of this.fireworks) firework.update(delta, this.ctx);

    this.counter += delta * 3;
    if (this.counter >= 1) {
      this.fireworks.push(
        new Firework(
          random(this.spawnA, this.spawnB),
          this.height,
          random(0, this.width),
          random(this.spawnC, this.spawnD),
          random(0, 360),
          random(30, 110)
        )
      );
      this.counter = 0;
    }

    if (this.fireworks.length > 1000) {
      this.fireworks = this.fireworks.filter(firework => !firework.dead);
    }
  }
}

class Firework {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  shade: number;
  offsprings: number;
  history: { x: number; y: number }[];
  madeChilds?: boolean;
  dead: boolean;

  constructor(x: number, y: number, targetX: number, targetY: number, shade: number, offsprings: number) {
    this.x = x;
    this.y = y;
    this.targetX = targetX;
    this.targetY = targetY;
    this.shade = shade;
    this.offsprings = offsprings;
    this.dead = false;
    this.history = [];
  }

  update(delta: number, ctx: CanvasRenderingContext2D) {
    if (this.dead) return;

    const xDiff = this.targetX - this.x;
    const yDiff = this.targetY - this.y;
    if (Math.abs(xDiff) > 3 || Math.abs(yDiff) > 3) {
      this.x += xDiff * 2 * delta;
      this.y += yDiff * 2 * delta;

      this.history.push({ x: this.x, y: this.y });

      if (this.history.length > 20) this.history.shift();
    } else {
      if (this.offsprings && !this.madeChilds) {
        const babies = this.offsprings / 2;
        for (let i = 0; i < babies; i++) {
          const targetX = this.x + this.offsprings * Math.cos((PI2 * i) / babies);
          const targetY = this.y + this.offsprings * Math.sin((PI2 * i) / babies);
          birthday.fireworks.push(new Firework(this.x, this.y, targetX, targetY, this.shade, 0));
        }
      }
      this.madeChilds = true;
      this.history.shift();
    }

    if (this.history.length === 0) this.dead = true;
    else {
      for (let i = 0; this.history.length > i; i++) {
        const point = this.history[i];
        ctx.beginPath();
        ctx.fillStyle = `hsl(${this.shade},100%,${i}%)`;
        ctx.arc(point.x, point.y, 1, 0, PI2, false);
        ctx.fill();
      }
    }
  }
}

let birthday: Birthday;

const BirthdayFireworks = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      birthday = new Birthday(canvasRef.current);
      let then = timestamp();

      const loop = () => {
        requestAnimationFrame(loop);

        const now = timestamp();
        const delta = (now - then) / 1000;
        then = now;
        birthday.update(delta);
      };

      loop();
    }

    return () => {
      window.onresize = null;
    };
  }, []);

  return (
    <>
      <h1 style={styles.h1}>Happy Birthday Sarjak! </h1>
      <h4 style={styles.h4}>Wishing you a day full of smiles and a whole year filled with joy ❤️</h4>
      <canvas ref={canvasRef} style={styles.canvas} />
      <div style={styles.button} id="testbutton">Click Here</div>
    </>
  );
};

const styles = {
  h1: {
    position: 'absolute' as 'absolute',
    top: '10%',
    left: '50%',
    transform: 'translate(-50%, -30%)',
    color: '#fff',
    fontFamily: 'Source Sans Pro',
    fontSize: '7vw', // Adjusts based on viewport width for responsiveness
    fontWeight: 900,
    userSelect: 'none' as 'none',
    textAlign: 'center' as 'center',
  },
  h4: {
    position: 'absolute' as 'absolute',
    top: '53%',
    left: '50%',
    transform: 'translate(-50%, -30%)',
    color: '#fff',
    fontFamily: 'Source Sans Pro',
    fontSize: '5vw', // Adjusts based on viewport width for responsiveness
    fontWeight: 900,
    userSelect: 'none' as 'none',
    textAlign: 'center' as 'center',
  },
  canvas: {
    display: 'block',
    width: '100%',
    height: '100%',
  },
  button: {
    width: '150px',
    height: '50px',
    borderRadius: '180px',
    position: 'absolute' as 'absolute',
    left: '50%',
    bottom: '10%',
    transform: 'translateX(-50%)',
    background: 'linear-gradient(60deg, #f79533, #f37055, #ef4e7b, #a166ab, #5073b8, #1098ad, #07b39b, #6fba82)',
    cursor: 'pointer',
    lineHeight: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'rgba(235,235,235,1)',
    fontWeight: 'bold',
    fontSize: '20px', // Adjusts based on viewport width for responsiveness
    userSelect: 'none' as 'none',
    boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.4)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  buttonHover: {
    transform: 'scale(1.05)',
    boxShadow: '0px 12px 20px rgba(0, 0, 0, 0.5)',
  },
};

export default BirthdayFireworks;
