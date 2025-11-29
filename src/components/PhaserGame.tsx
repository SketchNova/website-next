"use client"
import React, { useEffect, useRef, useState } from "react";
import * as Phaser from "phaser";

interface HudState {
  speed: number;
  lap: number;
  lastLapTime: number;
  bestLapTime: number;
  position: number;
  totalCars: number;
}

interface TouchControlState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
}

// Car graphics generator with explicit texture key
const generateCarGraphic = (scene: any, key: string, color: number, size: number = 30) => {
  const graphics = scene.add.graphics();

  // Car body - sleek racing car shape
  graphics.fillStyle(color, 1);
  graphics.beginPath();
  graphics.moveTo(size / 2, 0); // front
  graphics.lineTo(size * 0.7, size * 0.3);
  graphics.lineTo(size * 0.7, size * 0.7);
  graphics.lineTo(size / 2, size); // back
  graphics.lineTo(size * 0.3, size * 0.7);
  graphics.lineTo(size * 0.3, size * 0.3);
  graphics.closePath();
  graphics.fillPath();

  // Windows - darker
  graphics.fillStyle(0x0f172a, 0.8);
  graphics.fillRect(size * 0.35, size * 0.2, size * 0.3, size * 0.2);
  graphics.fillRect(size * 0.35, size * 0.6, size * 0.3, size * 0.15);

  // Headlights
  graphics.fillStyle(0xffff00, 0.9);
  graphics.fillRect(size * 0.4, size * 0.05, size * 0.1, size * 0.08);
  graphics.fillRect(size * 0.5, size * 0.05, size * 0.1, size * 0.08);

  graphics.generateTexture(key, size, size);
  graphics.destroy();
};

// Tire mark graphics
const generateTireMark = (scene: any) => {
  const graphics = scene.add.graphics();
  graphics.fillStyle(0x444444, 0.6);
  graphics.fillRect(0, 0, 8, 8);
  graphics.generateTexture("tireMark", 8, 8);
  graphics.destroy();
};

export default function PhaserGame(): JSX.Element {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hud, setHud] = useState<HudState>({ speed: 0, lap: 0, lastLapTime: 0, bestLapTime: 0, position: 1, totalCars: 3 });
  const [gameStarted, setGameStarted] = useState(false);
  const [touchControls, setTouchControls] = useState<TouchControlState>({ forward: false, backward: false, left: false, right: false });
  const gameRef = useRef<Phaser.Game | null>(null);
  const sceneRef = useRef<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [canvasMissing, setCanvasMissing] = useState(false);
  const [capturedConsole, setCapturedConsole] = useState<string[]>([]);

  // Canvas detection + global error / console capture
  useEffect(() => {
    const checkCanvas = () => {
      try {
        if (!containerRef.current) {
          setCanvasMissing(true);
          return;
        }
        const canvas = containerRef.current.querySelector("canvas");
        setCanvasMissing(!Boolean(canvas));
      } catch (e) {
        // ignore
      }
    };

    const mo = new MutationObserver(() => checkCanvas());
    if (containerRef.current) mo.observe(containerRef.current, { childList: true, subtree: true });
    const poll = setInterval(checkCanvas, 500);

    const onWindowError = (ev: ErrorEvent) => {
      try {
        const msg = ev?.message || String(ev);
        setError((prev) => prev || msg);
      } catch (e) {}
    };
    const onUnhandledRejection = (ev: any) => {
      try {
        const msg = ev?.reason?.message || String(ev?.reason || ev);
        setError((prev) => prev || msg);
      } catch (e) {}
    };

    const origConsoleError = console.error;
    const origConsoleLog = console.log;
    console.error = (...args: any[]) => {
      try {
        setCapturedConsole((prev) => [...prev.slice(-20), args.map((a) => String(a)).join(" ")]);
      } catch (e) {}
      origConsoleError.apply(console, args as any);
    };
    console.log = (...args: any[]) => {
      try {
        setCapturedConsole((prev) => [...prev.slice(-20), args.map((a) => String(a)).join(" ")]);
      } catch (e) {}
      origConsoleLog.apply(console, args as any);
    };

    window.addEventListener("error", onWindowError);
    window.addEventListener("unhandledrejection", onUnhandledRejection);

    checkCanvas();

    return () => {
      try {
        mo.disconnect();
      } catch (e) {}
      clearInterval(poll);
      window.removeEventListener("error", onWindowError);
      window.removeEventListener("unhandledrejection", onUnhandledRejection);
      console.error = origConsoleError;
      console.log = origConsoleLog;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameStarted]);

  useEffect(() => {
    if (!containerRef.current || !gameStarted) return;

    class CarScene extends Phaser.Scene {
      cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
      keys!: { w: Phaser.Input.Keyboard.Key; s: Phaser.Input.Keyboard.Key; a: Phaser.Input.Keyboard.Key; d: Phaser.Input.Keyboard.Key };
      player!: Phaser.Physics.Arcade.Sprite;
      aiCars: Array<{ sprite: Phaser.Physics.Arcade.Sprite; speed: number; targetRotation: number; pathIndex: number; laps: number; lapStartTime: number; lastLapTime: number; bestLapTime: number; tireMarks: Phaser.GameObjects.Sprite[] }> = [];
      walls!: Phaser.Physics.Arcade.StaticGroup;
      speed = 0;
      lap = 0;
      lapStartTime = 0;
      lastLapTime = 0;
      bestLapTime = Infinity;
      checkpointPassed = false;
      trackWaypoints: Phaser.Math.Vector2[] = [];
      particleEmitter: any;
      lastTireMarkTime = 0;

      constructor() {
        super({ key: "CarScene" });
      }

      preload() {
        // no external assets; we generate textures in create
      }

      create() {
        const width = 1000;
        const height = 700;

        // create gradient background
        const bg = this.add.graphics();
        bg.fillStyle(0x0f172a, 1);
        bg.fillRect(0, 0, width, height);
        
        // add some detail to the background (grass/field)
        bg.fillStyle(0x1e293b, 0.5);
        for (let x = 0; x < width; x += 40) {
          for (let y = 0; y < height; y += 40) {
            if ((x + y) % 80 === 0) {
              bg.fillRect(x, y, 40, 40);
            }
          }
        }

        // draw professional track with road markings
        const trackGraphics = this.add.graphics();
        
        // outer grass border
        trackGraphics.fillStyle(0x2d5016, 1);
        trackGraphics.fillRect(50, 50, width - 100, height - 100);
        
        // track surface (asphalt)
        trackGraphics.fillStyle(0x1a1a1a, 1);
        trackGraphics.fillRect(100, 100, width - 200, height - 200);
        
        // center grass (inner)
        trackGraphics.fillStyle(0x2d5016, 1);
        trackGraphics.fillRect(250, 200, width - 500, height - 400);
        
        // road markings - white dashed lines
        trackGraphics.lineStyle(2, 0xffffff, 0.7);
        const dashSpacing = 20;
        // outer line
        for (let i = 0; i < width - 100; i += dashSpacing * 2) {
          trackGraphics.lineBetween(100 + i, 100, 100 + i + dashSpacing, 100);
          trackGraphics.lineBetween(100 + i, height - 100, 100 + i + dashSpacing, height - 100);
        }
        for (let i = 0; i < height - 100; i += dashSpacing * 2) {
          trackGraphics.lineBetween(100, 100 + i, 100, 100 + i + dashSpacing);
          trackGraphics.lineBetween(width - 100, 100 + i, width - 100, 100 + i + dashSpacing);
        }
        
        // finish line (thick yellow/checkered)
        trackGraphics.fillStyle(0xffff00, 0.8);
        for (let i = 0; i < 200; i += 20) {
          if (Math.floor(i / 20) % 2 === 0) {
            trackGraphics.fillRect(400 + i, height - 180, 20, 20);
          }
        }

        // generate car textures (explicit keys)
        generateCarGraphic(this, "car_player", 0xe11d48, 40); // red player car
        generateCarGraphic(this, "car_ai1", 0x3b82f6, 40); // blue AI car
        generateCarGraphic(this, "car_ai2", 0x8b5cf6, 40); // purple AI car
        generateTireMark(this);

        // create player
        this.player = this.physics.add.sprite(width / 2, height - 250, "car_player");
        this.player.setOrigin(0.5, 0.5);
        this.player.setCollideWorldBounds(true);
        this.player.setDrag(180);
        this.player.setMaxVelocity(600);
        this.player.setBounce(0.3);

        // create particle emitter for tire smoke
        this.particleEmitter = this.add.particles(0xcccccc);
        this.particleEmitter.createEmitter({
          speed: { min: -200, max: 200 },
          angle: { min: 240, max: 300 },
          scale: { start: 0.5, end: 0 },
          lifespan: 300,
          emitting: false,
        });

        // create walls as static group
        this.walls = this.physics.add.staticGroup();

        // outer boundary
        this.walls.create(width / 2, 80, undefined).setDisplaySize(width - 100, 80).refreshBody();
        this.walls.create(width / 2, height - 80, undefined).setDisplaySize(width - 100, 80).refreshBody();
        this.walls.create(80, height / 2, undefined).setDisplaySize(80, height - 100).refreshBody();
        this.walls.create(width - 80, height / 2, undefined).setDisplaySize(80, height - 100).refreshBody();

        // inner boundary (hole)
        this.walls.create(width / 2, 220, undefined).setDisplaySize(width - 500, 80).refreshBody();
        this.walls.create(width / 2, height - 220, undefined).setDisplaySize(width - 500, 80).refreshBody();
        this.walls.create(220, height / 2, undefined).setDisplaySize(80, height - 400).refreshBody();
        this.walls.create(width - 220, height / 2, undefined).setDisplaySize(80, height - 400).refreshBody();

        // checkpoint - finish line
        const checkpoint = this.add.rectangle(width / 2, height - 170, 300, 20, 0x00ff00);
        this.physics.add.existing(checkpoint, true);
        this.physics.add.overlap(this.player, checkpoint as unknown as Phaser.GameObjects.GameObject, () => {
          if (!this.checkpointPassed) {
            this.lap += 1;
            this.checkpointPassed = true;
            const now = this.time.now;
            if (this.lapStartTime > 0) {
              this.lastLapTime = Math.round((now - this.lapStartTime) / 1000);
              if (this.lastLapTime < this.bestLapTime) {
                this.bestLapTime = this.lastLapTime;
              }
            }
            this.lapStartTime = now;
            this.emitHud();
            this.time.delayedCall(500, () => {
              this.checkpointPassed = false;
            });
          }
        });

        // collisions between player and walls
        this.physics.add.collider(this.player, this.walls, () => {
          this.player.setVelocity(this.player.body.velocity.x * -0.3, this.player.body.velocity.y * -0.3);
          const smoke = this.particleEmitter.emitParticleAt(this.player.x, this.player.y, 5);
        });

        // spawn 2 AI cars
        this.spawnAICars();

        // collision between AI cars and walls
        this.aiCars.forEach((aiCar) => {
          this.physics.add.collider(aiCar.sprite, this.walls, () => {
            aiCar.sprite.setVelocity(aiCar.sprite.body.velocity.x * -0.3, aiCar.sprite.body.velocity.y * -0.3);
          });
        });

        // collision between player and AI cars
        this.aiCars.forEach((aiCar) => {
          this.physics.add.collider(this.player, aiCar.sprite, () => {
            const dx = this.player.x - aiCar.sprite.x;
            const dy = this.player.y - aiCar.sprite.y;
            const dist = Math.hypot(dx, dy);
            if (dist > 0) {
              const nx = dx / dist;
              const ny = dy / dist;
              this.player.setVelocity(this.player.body.velocity.x + nx * 150, this.player.body.velocity.y + ny * 150);
              aiCar.sprite.setVelocity(aiCar.sprite.body.velocity.x - nx * 150, aiCar.sprite.body.velocity.y - ny * 150);
            }
          });
        });

        // AI lap detection
        this.aiCars.forEach((aiCar) => {
          this.physics.add.overlap(aiCar.sprite, checkpoint as unknown as Phaser.GameObjects.GameObject, () => {
            if (aiCar.lapStartTime === 0 || this.time.now - aiCar.lapStartTime > 1000) {
              aiCar.laps += 1;
              const now = this.time.now;
              if (aiCar.lapStartTime > 0) {
                aiCar.lastLapTime = Math.round((now - aiCar.lapStartTime) / 1000);
                if (aiCar.lastLapTime < aiCar.bestLapTime) {
                  aiCar.bestLapTime = aiCar.lastLapTime;
                }
              }
              aiCar.lapStartTime = now;
            }
          });
        });

        // controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keys = {
          w: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
          s: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
          a: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
          d: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
        };

        this.emitHud();
        sceneRef.current = this;
      }

      spawnAICars() {
        const positions = [
          { x: 500, y: 350, texture: "car_ai1" },
          { x: 480, y: 450, texture: "car_ai2" },
        ];

        positions.forEach((pos) => {
          const aiSprite = this.physics.add.sprite(pos.x, pos.y, pos.texture);
          aiSprite.setOrigin(0.5, 0.5);
          aiSprite.setCollideWorldBounds(true);
          aiSprite.setDrag(180);
          aiSprite.setMaxVelocity(550);
          aiSprite.setBounce(0.3);

          this.aiCars.push({
            sprite: aiSprite,
            speed: 0,
            targetRotation: 0,
            pathIndex: 0,
            laps: 0,
            lapStartTime: 0,
            lastLapTime: 0,
            bestLapTime: Infinity,
            tireMarks: [],
          });
        });
      }

      updateAICars() {
        const rotationSpeed = 0.05;
        const accel = 10;

        this.aiCars.forEach((aiCar) => {
          const waypoints = [
            new Phaser.Math.Vector2(500, 600),
            new Phaser.Math.Vector2(800, 450),
            new Phaser.Math.Vector2(800, 200),
            new Phaser.Math.Vector2(500, 100),
            new Phaser.Math.Vector2(200, 200),
            new Phaser.Math.Vector2(200, 450),
          ];

          const target = waypoints[aiCar.pathIndex % waypoints.length];
          const dx = target.x - aiCar.sprite.x;
          const dy = target.y - aiCar.sprite.y;
          const dist = Math.hypot(dx, dy);

          const targetAngle = Math.atan2(dy, dx) + Math.PI / 2;
          let angleDiff = targetAngle - aiCar.sprite.rotation;
          if (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
          if (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;

          if (Math.abs(angleDiff) > 0.1) {
            aiCar.sprite.rotation += Math.sign(angleDiff) * rotationSpeed;
          }

          this.physics.velocityFromRotation(aiCar.sprite.rotation - Math.PI / 2, accel, aiCar.sprite.body.velocity as Phaser.Math.Vector2);

          if (dist < 60) {
            aiCar.pathIndex += 1;
          }
        });
      }

      emitHud() {
        const position = 1 + this.aiCars.filter((ai) => ai.laps > this.lap || (ai.laps === this.lap && ai.sprite.x > this.player.x)).length;
        (this.game as any).events.emit("hud", {
          speed: Math.round(this.player.body.velocity.length()),
          lap: this.lap,
          lastLapTime: this.lastLapTime,
          bestLapTime: this.bestLapTime === Infinity ? 0 : this.bestLapTime,
          position,
          totalCars: 1 + this.aiCars.length,
        });
      }

      update() {
        if (!this.player) return;

        const rotationSpeed = 0.065;
        const accel = 12;

        // rotation
        if (this.cursors.left.isDown || this.keys.a.isDown) {
          this.player.rotation -= rotationSpeed;
        } else if (this.cursors.right.isDown || this.keys.d.isDown) {
          this.player.rotation += rotationSpeed;
        }

        // acceleration
        if (this.cursors.up.isDown || this.keys.w.isDown) {
          this.physics.velocityFromRotation(this.player.rotation - Math.PI / 2, accel, this.player.body.velocity as Phaser.Math.Vector2);
          // emit tire particles
          if (this.time.now - this.lastTireMarkTime > 50) {
            this.particleEmitter.emitParticleAt(this.player.x, this.player.y, 2);
            this.lastTireMarkTime = this.time.now;
          }
        } else if (this.cursors.down.isDown || this.keys.s.isDown) {
          this.physics.velocityFromRotation(this.player.rotation - Math.PI / 2, -accel * 0.6, this.player.body.velocity as Phaser.Math.Vector2);
        } else {
          (this.player.body as Phaser.Physics.Arcade.Body).velocity.scale(0.96);
        }

        this.updateAICars();
        this.emitHud();
      }

      applyTouchControl(controls: TouchControlState) {
        if (!this.player) return;

        const rotationSpeed = 0.065;
        const accel = 12;

        if (controls.left) {
          this.player.rotation -= rotationSpeed;
        } else if (controls.right) {
          this.player.rotation += rotationSpeed;
        }

        if (controls.forward) {
          this.physics.velocityFromRotation(this.player.rotation - Math.PI / 2, accel, this.player.body.velocity as Phaser.Math.Vector2);
          if (this.time.now - this.lastTireMarkTime > 50) {
            this.particleEmitter.emitParticleAt(this.player.x, this.player.y, 2);
            this.lastTireMarkTime = this.time.now;
          }
        } else if (controls.backward) {
          this.physics.velocityFromRotation(this.player.rotation - Math.PI / 2, -accel * 0.6, this.player.body.velocity as Phaser.Math.Vector2);
        } else {
          (this.player.body as Phaser.Physics.Arcade.Body).velocity.scale(0.96);
        }
      }
    }

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
        width: 1000,
        height: 700,
      parent: containerRef.current,
        backgroundColor: "#0f172a",
        physics: { default: "arcade", arcade: { gravity: { y: 0 }, debug: false, tileBias: 16 } },
      scene: [CarScene],
        render: { pixelArt: false, antialias: true },
    };

    let game: Phaser.Game | null = null;
    try {
      game = new Phaser.Game(config);
      gameRef.current = game;

      // listen for HUD events and update React state
      const hudListener = (data: any) => setHud(data);
      (game as any).events.on("hud", hudListener);

      // clear any previous error
      setError(null);

      return () => {
        try {
          (game as any).events.off("hud", hudListener);
          game.destroy(true);
          gameRef.current = null;
        } catch (e) {
          // ignore
        }
      };
    } catch (err: any) {
      console.error("Failed to initialize Phaser game:", err);
      setError(err?.message || String(err));
      // ensure gameRef is cleared
      gameRef.current = null;
      return () => {};
    }
  }, [gameStarted]);

  // apply touch controls every frame
  useEffect(() => {
    const interval = setInterval(() => {
      if (sceneRef.current) {
        sceneRef.current.applyTouchControl(touchControls);
      }
    }, 1000 / 60); // 60fps

    return () => clearInterval(interval);
  }, [touchControls]);

  const handleTouchButtonDown = (button: keyof TouchControlState) => {
    setTouchControls((prev) => ({ ...prev, [button]: true }));
  };

  const handleTouchButtonUp = (button: keyof TouchControlState) => {
    setTouchControls((prev) => ({ ...prev, [button]: false }));
  };

  return (
    <div className="flex flex-col items-center w-full min-h-screen">
      {/* Debug banner (always visible) */}
      <div style={{ position: "fixed", top: 8, left: 8, zIndex: 9999, background: "rgba(0,0,0,0.6)", color: "#fff", padding: "6px 8px", borderRadius: 6, fontSize: 12 }}>
        Debug: gameStarted={String(gameStarted)} error={error ? "yes" : "no"}
      </div>
      {!gameStarted ? (
        <div className="flex flex-col items-center justify-center w-full min-h-screen gap-8 bg-slate-900">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-100 mb-4">2D Car Racing Game</h1>
            <p className="text-slate-400 mb-6">Race against 2 AI opponents around the track!</p>
            <p className="text-slate-300 text-sm mb-4">🏁 Cross the green line to complete laps</p>
            <p className="text-slate-300 text-sm">🚗 Red = You, Blue & Purple = AI</p>
          </div>
          <button
            onClick={() => setGameStarted(true)}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition"
          >
            Start Race
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between gap-4 mt-4 w-full px-4 max-w-2xl">
            <div className="text-slate-300">Speed: {hud.speed}</div>
            <div className="text-slate-300">Lap: {hud.lap}</div>
            <div className="text-slate-300">Position: {hud.position}/{hud.totalCars}</div>
          </div>
          <div className="flex items-center justify-between gap-4 mt-2 mb-4 w-full px-4 max-w-2xl">
            <div className="text-slate-400 text-sm">Last: {hud.lastLapTime}s</div>
            <div className="text-slate-400 text-sm">Best: {hud.bestLapTime}s</div>
          </div>

          <div className="flex justify-center w-full relative">
            <div ref={containerRef} className="w-[1000px] h-[700px] bg-transparent relative" />

            {canvasMissing && (
              <div className="absolute left-0 right-0 top-0 bottom-0 flex items-center justify-center pointer-events-none">
                <div className="bg-red-900/90 text-white px-4 py-3 rounded-lg shadow-lg">
                  <div className="font-semibold">Game canvas not detected</div>
                  <div className="text-sm mt-1">Open DevTools → Console for errors.</div>
                </div>
              </div>
            )}
          </div>

          {error && (
              <div className="mt-4 p-4 bg-red-700 text-white rounded max-w-2xl">
                <strong>Game error:</strong>
                <div className="mt-1 text-sm font-mono break-words">{error}</div>
              </div>
            )}

          {/* If the canvas didn't mount, show a hint */}
          <div className="mt-2 text-sm text-slate-500">
            If you don't see the game canvas, open DevTools → Console and look for errors.
          </div>

          <div className="mt-4 text-slate-400 text-sm">W/A/S/D or Arrow Keys to drive</div>

          {/* Touch controls overlay */}
          <div className="flex gap-4 mt-6 mb-4">
            <button
              onMouseDown={() => handleTouchButtonDown("left")}
              onMouseUp={() => handleTouchButtonUp("left")}
              onTouchStart={() => handleTouchButtonDown("left")}
              onTouchEnd={() => handleTouchButtonUp("left")}
              className="w-16 h-16 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition active:bg-slate-500"
            >
              ←
            </button>
            <div className="flex flex-col gap-2">
              <button
                onMouseDown={() => handleTouchButtonDown("forward")}
                onMouseUp={() => handleTouchButtonUp("forward")}
                onTouchStart={() => handleTouchButtonDown("forward")}
                onTouchEnd={() => handleTouchButtonUp("forward")}
                className="w-16 h-16 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition active:bg-slate-500"
              >
                ↑
              </button>
              <button
                onMouseDown={() => handleTouchButtonDown("backward")}
                onMouseUp={() => handleTouchButtonUp("backward")}
                onTouchStart={() => handleTouchButtonDown("backward")}
                onTouchEnd={() => handleTouchButtonUp("backward")}
                className="w-16 h-16 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition active:bg-slate-500"
              >
                ↓
              </button>
            </div>
            <button
              onMouseDown={() => handleTouchButtonDown("right")}
              onMouseUp={() => handleTouchButtonUp("right")}
              onTouchStart={() => handleTouchButtonDown("right")}
              onTouchEnd={() => handleTouchButtonUp("right")}
              className="w-16 h-16 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition active:bg-slate-500"
            >
              →
            </button>
          </div>

          <button
            onClick={() => setGameStarted(false)}
            className="px-6 py-2 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg transition mb-4"
          >
            Exit Race
          </button>
        </>
      )}
    </div>
  );
}
