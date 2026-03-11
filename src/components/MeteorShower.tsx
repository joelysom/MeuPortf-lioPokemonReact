import React, { useEffect, useRef } from 'react';
import styles from './MeteorShower.module.css';

interface Shape {
  x: number;
  y: number;
  c: number;
  r: number;
  l: number;
  sl: number;
  ga: number;
  v: {
    x: number;
    y: number;
  };
  init: (x: number, y: number, c: number) => void;
  draw: () => void;
  updateParams: () => void;
  render: () => void;
  ctx: CanvasRenderingContext2D;
}

const MeteorShower: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.getContext) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let X = canvas.width = window.innerWidth;
    let Y = canvas.height = window.innerHeight;
    let shapeNum = 800;
    const shapes: any[] = [];
    const startColor = 200; // Azul ciano fixo

    if (X < 768) {
      shapeNum = 400;
    }

    const rand = (min: number, max: number) => {
      return Math.floor(Math.random() * (max - min + 1) + min);
    };

    class Shape {
      ctx: CanvasRenderingContext2D;
      x: number = 0;
      y: number = 0;
      c: number = 0;
      r: number = 0;
      l: number = 0;
      sl: number = 0;
      ga: number = 0;
      v: { x: number; y: number } = { x: 0, y: 0 };

      constructor(ctx: CanvasRenderingContext2D, x: number, y: number, c: number) {
        this.ctx = ctx;
        this.init(x, y, c);
      }

      init(x: number, y: number, c: number) {
        this.x = x;
        this.y = y;
        this.c = c;
        this.r = rand(1, 2);
        this.l = rand(0, 100);
        this.sl = this.l;
        this.ga = Math.random() * 0.7;
        this.v = {
          x: rand(-1, 1) * Math.random(),
          y: 0
        };
      }

      draw() {
        const ctx = this.ctx;
        ctx.save();
        ctx.globalAlpha = this.ga;
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = `hsl(${this.c}, 100%, 50%)`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.restore();
      }

      updateParams() {
        const ratio = this.l / this.sl * 1.1;
        this.r *= ratio;
        this.x += this.v.x;
        this.v.y = Y / 2 - this.y;
        this.y += this.v.y / 30;
        this.l -= 1;
        if (this.l < 0) {
          this.c = (this.c + 10) % 360;
          this.init(rand(0, X), Y / 2 * Math.random(), this.c);
        }
      }

      render() {
        this.updateParams();
        this.draw();
        ctx.translate(0, Y);
        ctx.scale(1, -1);
        this.draw();
        ctx.resetTransform();
      }
    }

    for (let i = 0; i < shapeNum; i++) {
      const s = new Shape(ctx, rand(0, X), Y / 2 * Math.random(), startColor);
      shapes.push(s);
    }

    const render = () => {
      ctx.globalCompositeOperation = 'darken';
      ctx.globalAlpha = 0.02;
      ctx.fillStyle = 'rgb(5, 11, 26)';
      ctx.fillRect(0, 0, X, Y);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      for (let i = 0; i < shapes.length; i++) {
        shapes[i].render();
      }
      requestAnimationFrame(render);
    };

    render();

    const onResize = () => {
      X = canvas.width = window.innerWidth;
      Y = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas ref={canvasRef} className={styles.backgroundCanvas}></canvas>
  );
};

export default MeteorShower;
