/**
 * Celestial Judgment - Three.js WebGL Scene Renderer
 * Manages the 3/4 perspective camera, soft contact shadows, stylized cinematic lighting,
 * dynamic Heaven/Hell lighting shifts, and responsive canvas resizing.
 */

class SceneRenderer {
  constructor(canvasContainer) {
    this.container = canvasContainer;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x181a24);
    this.scene.fog = new THREE.FogExp2(0x181a24, 0.04);

    this.width = this.container.clientWidth || window.innerWidth;
    this.height = this.container.clientHeight || window.innerHeight;

    // Camera: Clean stylized 3/4 perspective, centered on soul
    this.baseCamPos = new THREE.Vector3(0, 2.9, 6.8);
    this.baseLookTarget = new THREE.Vector3(0, 1.35, 0);

    this.camera = new THREE.PerspectiveCamera(42, this.width / this.height, 0.1, 100);
    this.camera.position.copy(this.baseCamPos);
    this.camera.lookAt(this.baseLookTarget);

    // Screen-aware framing: the Judge (menus) and Archangel (tribunal) are fitted
    // between the UI chrome instead of being cropped by it on tall/narrow screens.
    this.currentLook = this.baseLookTarget.clone();
    this.framingCache = {};
    this.framingCamera = new THREE.PerspectiveCamera(42, this.width / this.height, 0.1, 100);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
      alpha: false
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.container.appendChild(this.renderer.domElement);

    // Lighting setup
    this.initLights();

    // Camera punch/shake state
    this.shakeIntensity = 0;
    this.cameraOffset = new THREE.Vector3(0, 0, 0);

    // Resize listener
    window.addEventListener('resize', () => this.onResize());
  }

  initLights() {
    // 1. Hemisphere Light (Soft celestial sky fill + warm stone bounce)
    this.hemiLight = new THREE.HemisphereLight(0xd9e8fa, 0x3d383b, 0.75);
    this.scene.add(this.hemiLight);

    // 2. Key Directional Light (Soft sunbeam from upper-left with contact shadows)
    this.keyLight = new THREE.DirectionalLight(0xfff5e6, 1.1);
    this.keyLight.position.set(-3.8, 7.5, 4.5);
    this.keyLight.castShadow = true;
    this.keyLight.shadow.mapSize.width = 2048;
    this.keyLight.shadow.mapSize.height = 2048;
    this.keyLight.shadow.camera.near = 0.5;
    this.keyLight.shadow.camera.far = 20;
    this.keyLight.shadow.camera.left = -4;
    this.keyLight.shadow.camera.right = 4;
    this.keyLight.shadow.camera.top = 4;
    this.keyLight.shadow.camera.bottom = -2;
    this.keyLight.shadow.bias = -0.0008;
    this.scene.add(this.keyLight);

    // 3. Rim / Silhouette Light (Behind character, makes low-poly geometry pop)
    this.rimLight = new THREE.DirectionalLight(0xbfe0ff, 0.45);
    this.rimLight.position.set(2.5, 4.0, -5.0);
    this.scene.add(this.rimLight);

    // 4. Dedicated Warm Golden Rim Light for the Judge
    this.judgeRim = new THREE.DirectionalLight(0xffdf66, 1.3);
    this.judgeRim.position.set(0, 3.2, -4.5);
    this.scene.add(this.judgeRim);

    // 5. Environmental Flank Lights (Left: Heaven Ivory/Gold, Right: Hell Deep Red/Ember)
    this.heavenLight = new THREE.PointLight(0xfff6cf, 1.1, 14, 1.2);
    this.heavenLight.position.set(-4.5, 3.5, 0.5);
    this.scene.add(this.heavenLight);

    this.hellLight = new THREE.PointLight(0xff2a00, 1.2, 14, 1.3);
    this.hellLight.position.set(4.5, 2.5, 0.5);
    this.scene.add(this.hellLight);

    // 6. Dynamic Judgment Lights
    // Heaven Warm Spotlight
    this.heavenSpot = new THREE.SpotLight(0xffea88, 0, 12, Math.PI / 4, 0.4);
    this.heavenSpot.position.set(0, 7.0, 0);
    this.heavenSpot.target.position.set(0, 0, 0);
    this.scene.add(this.heavenSpot);
    this.scene.add(this.heavenSpot.target);

    // Hell Underworld Crimson Pointlight
    this.hellPoint = new THREE.PointLight(0xff2200, 0, 8, 1.8);
    this.hellPoint.position.set(0, 0.2, 0);
    this.scene.add(this.hellPoint);
  }

  triggerHeavenLighting() {
    this.heavenSpot.intensity = 3.5;
    this.keyLight.color.setHex(0xffea9f);
    this.cameraOffset.set(0, 0.15, -0.4); // Subtle gentle float up & in
  }

  triggerHellLighting() {
    this.hellPoint.intensity = 4.0;
    this.keyLight.color.setHex(0xff7744);
    this.shakeIntensity = 0.08; // Subtle shudder
    this.cameraOffset.set(0, -0.15, 0.2); // Subtle camera dip
  }

  triggerAngelLighting() {
    this.hemiLight.intensity = 0.25;
    this.keyLight.intensity = 0.3;
    this.keyLight.color.setHex(0x3b4c68);
    this.heavenSpot.intensity = 4.5;
    this.heavenSpot.color.setHex(0xfffae0);
    this.cameraOffset.set(0, 0, 0); // Angel framing is handled by getFraming("angel")
    this.shakeIntensity = 0;
  }

  resetLighting() {
    this.hemiLight.intensity = 0.75;
    this.keyLight.intensity = 1.1;
    this.rimLight.intensity = 0.45;
    this.judgeRim.intensity = 1.3;
    this.heavenLight.intensity = 1.1;
    this.hellLight.intensity = 1.2;
    this.heavenSpot.intensity = 0;
    this.hellPoint.intensity = 0;
    this.keyLight.color.setHex(0xfff5e6);
    this.cameraOffset.set(0, 0, 0);
    this.shakeIntensity = 0;
  }

  onResize() {
    this.width = this.container.clientWidth || window.innerWidth;
    this.height = this.container.clientHeight || window.innerHeight;
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
    this.framingCache = {};
  }

  // Pixel band (relative to the canvas) the subject must fit into, measured from the live UI.
  measureBand(kind) {
    const h = this.height;
    const origin = this.container.getBoundingClientRect().top;
    const rectOf = (sel) => {
      const el = document.querySelector(sel);
      const r = el && el.getBoundingClientRect();
      return r && r.height > 0 ? r : null;
    };

    if (kind === "menu") {
      const logo = rectOf(".celestai-brand-header");
      const altar = rectOf(".menu-altar-controls");
      if (!logo || !altar) return null;
      return { top: logo.bottom - origin + 8, bottom: altar.top - origin - 4 };
    }
    if (kind === "angel") {
      const dialog = rectOf(".angel-dialog-box");
      return { top: h * 0.04, bottom: (dialog ? dialog.top - origin : h * 0.72) - 12 };
    }
    return null;
  }

  // Finds a camera position/look target (same viewing angle as the base camera) that maps
  // the subject's top/bottom points onto the requested pixel band.
  solveFraming(topPoint, bottomPoint, band) {
    const cam = this.framingCamera;
    cam.aspect = this.width / this.height;
    cam.updateProjectionMatrix();

    const dir = this.baseCamPos.clone().sub(this.baseLookTarget);
    const baseDist = dir.length();
    dir.normalize();

    const toPx = (v) => (1 - (v.clone().project(cam).y + 1) / 2) * this.height;
    const look = new THREE.Vector3();
    let best = null;

    for (let scale = 0.7; scale <= 2.8; scale += 0.02) {
      for (let lookY = 0.2; lookY <= 3.0; lookY += 0.02) {
        look.set(0, lookY, 0);
        cam.position.copy(look).addScaledVector(dir, baseDist * scale);
        cam.lookAt(look);
        cam.updateMatrixWorld();
        const err = (toPx(topPoint) - band.top) ** 2 + (toPx(bottomPoint) - band.bottom) ** 2;
        if (!best || err < best.err) {
          best = { err, pos: cam.position.clone(), look: look.clone() };
        }
      }
    }
    return best;
  }

  getFraming(kind) {
    if (this.framingCache[kind]) return this.framingCache[kind];

    const fallback = {
      menu: { top: this.height * 0.13, bottom: this.height * 0.76 },
      angel: { top: this.height * 0.04, bottom: this.height * 0.7 }
    }[kind];
    const measured = this.measureBand(kind);
    const band = measured || fallback;

    // Subject extents in world space (Judge on its dais / hovering Archangel)
    const points = kind === "menu"
      ? { top: new THREE.Vector3(0, 3.5, 0), bottom: new THREE.Vector3(0, -0.56, 1.9) }
      : { top: new THREE.Vector3(0, 3.5, 0), bottom: new THREE.Vector3(0, 0.45, 0.65) };

    const framing = this.solveFraming(points.top, points.bottom, band);
    // Only cache real measurements so a hidden screen doesn't pin the fallback
    if (measured) this.framingCache[kind] = framing;
    return framing;
  }

  activeFramingKind() {
    let judgeVisible = false;
    let angelPresent = false;
    for (const child of this.scene.children) {
      if (child.name === "AngelRoot") angelPresent = true;
      if (child.name === "JudgeRoot" && child.visible) judgeVisible = true;
    }
    if (angelPresent) return "angel";
    if (judgeVisible) return "menu";
    return null;
  }

  render(delta) {
    // Camera shake decay & smooth lerp
    let shakeX = 0;
    let shakeY = 0;
    if (this.shakeIntensity > 0.001) {
      shakeX = (Math.random() - 0.5) * this.shakeIntensity;
      shakeY = (Math.random() - 0.5) * this.shakeIntensity;
      this.shakeIntensity = Math.max(0, this.shakeIntensity - delta * 0.4);
    }

    const framingKind = this.activeFramingKind();
    const framing = framingKind ? this.getFraming(framingKind) : null;
    const targetLook = framing ? framing.look : this.baseLookTarget;
    const targetPos = (framing ? framing.pos.clone() : this.baseCamPos.clone()).add(this.cameraOffset);
    targetPos.x += shakeX;
    targetPos.y += shakeY;

    this.camera.position.lerp(targetPos, 0.08);
    this.currentLook.lerp(targetLook, 0.08);
    this.camera.lookAt(this.currentLook);

    // Decay dynamic lights smoothly
    if (this.heavenSpot.intensity > 0) {
      this.heavenSpot.intensity = Math.max(0, this.heavenSpot.intensity - delta * 2.8);
    }
    if (this.hellPoint.intensity > 0) {
      this.hellPoint.intensity = Math.max(0, this.hellPoint.intensity - delta * 3.2);
    }

    this.renderer.render(this.scene, this.camera);
  }
}

window.SceneRenderer = SceneRenderer;
