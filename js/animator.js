/**
 * Celestial Judgment - Mobile Game Procedural Character Animator
 * Handles elastic squash & stretch, punchy entrances, idle breathing,
 * joyful Heaven ascensions, and panicked Hell abyss drops.
 */

class CharacterAnimator {
  constructor() {
    this.currentSoul = null;
    this.currentAngel = null;
    this.angelTime = 0;
    this.state = "IDLE"; // "ENTRANCE", "IDLE", "HEAVEN", "HELL"
    this.animTime = 0;
    this.idleTime = 0;
    this.onComplete = null;
  }

  setSoul(soul) {
    this.currentSoul = soul;
    this.state = "IDLE";
    this.animTime = 0;
    this.idleTime = Math.random() * 10;
    if (this.currentSoul) {
      this.resetTransforms();
    }
  }

  setAngel(angel) {
    this.currentAngel = angel;
    this.angelTime = 0;
    if (this.currentAngel) {
      this.currentAngel.root.position.set(0, 0.4, 0);
    }
  }

  resetTransforms() {
    if (!this.currentSoul) return;
    const s = this.currentSoul;
    s.root.position.set(0, 0.4, 0);
    s.root.rotation.set(0, 0, 0);
    s.root.scale.set(1, 1, 1);

    s.hips.position.y = 1.05;
    s.torso.rotation.set(0, 0, 0);
    s.head.rotation.set(0, 0, 0);
    s.head.scale.set(1, 1, 1);

    s.leftArm.rotation.set(0, 0, 0);
    s.rightArm.rotation.set(0, 0, 0);

    if (s.mouth) s.mouth.scale.set(1, 1, 1);
  }

  playEntrance(onComplete) {
    this.state = "ENTRANCE";
    this.animTime = 0;
    this.onComplete = onComplete;
    if (this.currentSoul) {
      this.currentSoul.root.position.set(0, 6.0, 0);
      this.currentSoul.root.scale.set(0.85, 1.35, 0.85); // Stretched while falling
    }
    if (window.soundEngine) {
      window.soundEngine.playSoulEnter();
    }
  }

  playHeaven(onComplete) {
    this.state = "HEAVEN";
    this.animTime = 0;
    this.onComplete = onComplete;
    if (window.soundEngine) {
      window.soundEngine.playHeaven();
    }
  }

  playHell(onComplete) {
    this.state = "HELL";
    this.animTime = 0;
    this.onComplete = onComplete;
    if (window.soundEngine) {
      window.soundEngine.playHell();
    }
  }

  update(delta) {
    if (this.currentAngel) {
      this.angelTime += delta;
      const flap = Math.sin(this.angelTime * 2.5);
      this.currentAngel.leftWing.rotation.y = -0.15 + flap * 0.25;
      this.currentAngel.rightWing.rotation.y = 0.15 - flap * 0.25;
      this.currentAngel.root.position.y = 0.4 + Math.sin(this.angelTime * 1.5) * 0.12;
      this.currentAngel.halo.rotation.z = this.angelTime * 0.8;
    }

    if (!this.currentSoul) return;
    const s = this.currentSoul;
    this.animTime += delta;
    this.idleTime += delta;

    switch (this.state) {
      case "ENTRANCE":
        this.updateEntrance(delta, s);
        break;
      case "IDLE":
        this.updateIdle(delta, s);
        break;
      case "HEAVEN":
        this.updateHeaven(delta, s);
        break;
      case "HELL":
        this.updateHell(delta, s);
        break;
    }
  }

  updateEntrance(delta, s) {
    // Total entrance duration: 0.45s (fast and snappy)
    const t = this.animTime / 0.45;

    if (t < 0.55) {
      // Rapid descent (0 -> 0.55)
      const dropT = t / 0.55;
      const easeDrop = dropT * dropT * dropT;
      s.root.position.y = 6.0 * (1 - easeDrop) + 0.4 * easeDrop;
      s.root.scale.set(0.85, 1.3, 0.85);
    } else if (t < 0.75) {
      // Ground Impact & Heavy Squash (0.55 -> 0.75)
      const squashT = (t - 0.55) / 0.2;
      const squashProgress = Math.sin(squashT * Math.PI);
      s.root.position.y = 0.4 - squashProgress * 0.15;
      s.root.scale.set(
        1.0 + squashProgress * 0.35,
        1.0 - squashProgress * 0.35,
        1.0 + squashProgress * 0.35
      );
      s.leftArm.rotation.z = -squashProgress * 0.6;
      s.rightArm.rotation.z = squashProgress * 0.6;
    } else if (t < 1.0) {
      // Elastic Overshoot & Settle (0.75 -> 1.0)
      const reboundT = (t - 0.75) / 0.25;
      const overshoot = Math.sin(reboundT * Math.PI) * 0.15;
      s.root.position.y = 0.4 + overshoot * 0.2;
      s.root.scale.set(1.0 - overshoot, 1.0 + overshoot, 1.0 - overshoot);
      s.leftArm.rotation.z = overshoot * 0.4;
      s.rightArm.rotation.z = -overshoot * 0.4;
    } else {
      // Done
      this.resetTransforms();
      this.state = "IDLE";
      if (this.onComplete) {
        this.onComplete();
        this.onComplete = null;
      }
    }
  }

  updateIdle(delta, s) {
    // Polished mobile game idle breathing and slight bobbing
    const breathe = Math.sin(this.idleTime * 3.2);
    const sideSway = Math.sin(this.idleTime * 1.6);
    const headTilt = Math.sin(this.idleTime * 1.2 + 0.5);

    // Torso breathing squash & stretch
    s.torso.scale.set(1 - breathe * 0.02, 1 + breathe * 0.03, 1 - breathe * 0.02);
    s.torso.position.y = breathe * 0.015;
    s.torso.rotation.z = sideSway * 0.02;

    // Head subtle bob
    s.head.rotation.z = headTilt * 0.04;
    s.head.rotation.y = sideSway * 0.05;

    // Gentle arm sway
    s.leftArm.rotation.z = -0.06 - breathe * 0.03;
    s.rightArm.rotation.z = 0.06 + breathe * 0.03;
    s.leftArm.rotation.x = sideSway * 0.03;
    s.rightArm.rotation.x = -sideSway * 0.03;

    // Occasional blink
    const blinkCycle = this.idleTime % 3.8;
    if (blinkCycle > 3.65 && s.leftEye && s.rightEye) {
      s.leftEye.scale.y = 0.1;
      s.rightEye.scale.y = 0.1;
    } else if (s.leftEye && s.rightEye) {
      s.leftEye.scale.y = 1.0;
      s.rightEye.scale.y = 1.0;
    }
  }

  updateHeaven(delta, s) {
    // Total Heaven reaction duration: 0.55s
    const t = this.animTime / 0.55;

    if (t < 0.15) {
      // Anticipation crouch (0 -> 0.15)
      const antT = t / 0.15;
      s.root.position.y = 0.4 - antT * 0.1;
      s.root.scale.set(1 + antT * 0.15, 1 - antT * 0.15, 1 + antT * 0.15);
      s.head.rotation.x = -antT * 0.2;
    } else if (t < 1.0) {
      // Joyful Ascension & Praise Pose (0.15 -> 1.0)
      const riseT = (t - 0.15) / 0.85;
      const easeRise = riseT * riseT * (3 - 2 * riseT); // Smooth cubic hermite

      s.root.position.y = 0.3 + easeRise * 4.2;
      s.root.scale.set(
        Math.max(0.1, 1.05 - riseT * 0.4),
        Math.max(0.1, 1.15 - riseT * 0.3),
        Math.max(0.1, 1.05 - riseT * 0.4)
      );

      // Arms raised to the heavens in praise
      s.leftArm.rotation.z = -Math.PI * 0.85 * Math.min(1, riseT * 2);
      s.rightArm.rotation.z = Math.PI * 0.85 * Math.min(1, riseT * 2);
      s.leftArm.rotation.x = -0.3;
      s.rightArm.rotation.x = -0.3;

      // Head tilted upward in awe
      s.head.rotation.x = -0.55;

      // Joyful open mouth
      if (s.mouth) {
        s.mouth.scale.set(1.4, 2.0, 1.0);
      }

      // Gentle spin upwards
      s.root.rotation.y = riseT * Math.PI * 0.6;
    } else {
      // Done
      if (this.onComplete) {
        this.onComplete();
        this.onComplete = null;
      }
    }
  }

  updateHell(delta, s) {
    // Total Hell reaction duration: 0.52s
    const t = this.animTime / 0.52;

    if (t < 0.18) {
      // Shock & Horror Reaction (0 -> 0.18)
      const shockT = t / 0.18;
      s.root.scale.set(0.92, 1.12, 0.92);

      // Wide horrified eyes & open gasp
      if (s.leftEye && s.rightEye) {
        s.leftEye.scale.set(1.4, 1.4, 1.4);
        s.rightEye.scale.set(1.4, 1.4, 1.4);
      }
      if (s.mouth) {
        s.mouth.scale.set(1.8, 2.8, 1.2);
      }

      // Hands to head panic pose
      s.leftArm.rotation.z = -Math.PI * 0.7 * shockT;
      s.rightArm.rotation.z = Math.PI * 0.7 * shockT;
      s.head.rotation.z = Math.sin(shockT * 20) * 0.1;
    } else if (t < 1.0) {
      // Plunge into the Abyss & Arm Flailing (0.18 -> 1.0)
      const dropT = (t - 0.18) / 0.82;
      const easeDrop = dropT * dropT * 1.5; // Accelerating fall

      s.root.position.y = 0.4 - easeDrop * 4.8;

      // Stretch vertically while plummeting
      s.root.scale.set(
        Math.max(0.1, 0.9 - dropT * 0.5),
        Math.max(0.1, 1.25 - dropT * 0.4),
        Math.max(0.1, 0.9 - dropT * 0.5)
      );

      // Hectic arm flailing
      const flail = Math.sin(this.animTime * 35);
      s.leftArm.rotation.z = -Math.PI * 0.8 + flail * 0.4;
      s.rightArm.rotation.z = Math.PI * 0.8 - flail * 0.4;
      s.leftArm.rotation.x = flail * 0.5;
      s.rightArm.rotation.x = -flail * 0.5;

      // Head shaking in terror
      s.head.rotation.y = Math.sin(this.animTime * 40) * 0.2;
    } else {
      // Done
      if (this.onComplete) {
        this.onComplete();
        this.onComplete = null;
      }
    }
  }
}

window.characterAnimator = new CharacterAnimator();
