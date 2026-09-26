/**
 * Celestial Judgment - Surreal Celestial Courtroom Environment
 * Low-poly judgment dais, celestial pillars, floating clouds, Heaven arch, Hell chasm,
 * flickering candles, scales of justice, and dynamic particle systems.
 */

class CelestialEnvironment {
  constructor(scene) {
    this.scene = scene;
    this.clouds = [];
    this.candles = [];
    this.particles = [];
    this.heavenParticles = null;
    this.hellParticles = null;
    this.trapdoors = [];
    this.scalesBeam = null;
    this.scalesLeftPan = null;
    this.scalesRightPan = null;
    this.heavenBeam = null;
    this.hellGlow = null;

    this.initEnvironment();
  }

  initEnvironment() {
    const root = new THREE.Group();
    root.name = "EnvironmentRoot";
    this.scene.add(root);

    // Common materials
    const stoneMat = new THREE.MeshStandardMaterial({
      color: 0x5a6375,
      roughness: 0.85,
      flatShading: true
    });

    const lightStoneMat = new THREE.MeshStandardMaterial({
      color: 0x8a95a5,
      roughness: 0.8,
      flatShading: true
    });

    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xffd23f,
      roughness: 0.35,
      metalness: 0.75,
      flatShading: true
    });

    const obsidianMat = new THREE.MeshStandardMaterial({
      color: 0x221a24,
      roughness: 0.7,
      metalness: 0.3,
      flatShading: true
    });

    const lavaMat = new THREE.MeshBasicMaterial({
      color: 0xff4500
    });

    const cloudMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.95,
      flatShading: true
    });

    // ==========================================
    // 1. FLOATING CENTRAL COURT ISLAND & DAIS
    // ==========================================
    // Large base island
    const baseGeo = new THREE.CylinderGeometry(6.5, 3.5, 4.0, 10);
    const baseIsland = new THREE.Mesh(baseGeo, stoneMat);
    baseIsland.position.y = -2.1;
    baseIsland.receiveShadow = true;
    root.add(baseIsland);

    // Stepped upper judgment platform
    const daisGeo1 = new THREE.CylinderGeometry(5.2, 5.5, 0.4, 12);
    const dais1 = new THREE.Mesh(daisGeo1, lightStoneMat);
    dais1.position.y = 0.05;
    dais1.receiveShadow = true;
    root.add(dais1);

    const daisGeo2 = new THREE.CylinderGeometry(3.6, 3.9, 0.25, 12);
    const dais2 = new THREE.Mesh(daisGeo2, stoneMat);
    dais2.position.y = 0.25;
    dais2.receiveShadow = true;
    root.add(dais2);

    // Inner rune circle ring
    const ringGeo = new THREE.RingGeometry(1.6, 1.85, 12);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xe2c974,
      side: THREE.DoubleSide
    });
    const runeRing = new THREE.Mesh(ringGeo, ringMat);
    runeRing.rotation.x = -Math.PI / 2;
    runeRing.position.y = 0.38;
    root.add(runeRing);

    // Trapdoor floor segments at center (Opens during Hell judgment)
    const trapGeo = new THREE.CylinderGeometry(1.4, 1.4, 0.1, 10, 1, false, 0, Math.PI);
    const leftTrap = new THREE.Mesh(trapGeo, stoneMat);
    leftTrap.position.set(-0.7, 0.37, 0);
    leftTrap.receiveShadow = true;
    root.add(leftTrap);

    const rightTrap = new THREE.Mesh(trapGeo, stoneMat);
    rightTrap.position.set(0.7, 0.37, 0);
    rightTrap.rotation.y = Math.PI;
    rightTrap.receiveShadow = true;
    root.add(rightTrap);
    this.trapdoors = [leftTrap, rightTrap];

    // Under-trapdoor pit (molten lava inside center hole)
    const pitGeo = new THREE.CylinderGeometry(1.3, 0.8, 1.5, 8);
    const pit = new THREE.Mesh(pitGeo, lavaMat);
    pit.position.y = -0.5;
    root.add(pit);

    // ==========================================
    // 2. CELESTIAL COLUMNS & ARCHITECTURE
    // ==========================================
    const createColumn = (x, z, height = 4.8, isHell = false) => {
      const colGroup = new THREE.Group();
      colGroup.position.set(x, 0.25, z);

      const mat = isHell ? obsidianMat : lightStoneMat;
      const capMat = isHell ? lavaMat : goldMat;

      // Base
      const base = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.4, 0.8), mat);
      base.castShadow = true;
      base.receiveShadow = true;
      colGroup.add(base);

      // Shaft (fluted faceted cylinder)
      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.34, height, 7), mat);
      shaft.position.y = height / 2 + 0.2;
      shaft.castShadow = true;
      shaft.receiveShadow = true;
      colGroup.add(shaft);

      // Capital
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.32, 0.35, 7), capMat);
      cap.position.y = height + 0.35;
      cap.castShadow = true;
      colGroup.add(cap);

      root.add(colGroup);
      return colGroup;
    };

    // Background columns
    createColumn(-3.8, -2.5, 5.2, false);
    createColumn(-2.4, -3.8, 6.0, false);
    createColumn(2.4, -3.8, 6.0, true);
    createColumn(3.8, -2.5, 5.2, true);

    // ==========================================
    // 3. HEAVEN PORTAL ARCH (Left flank)
    // ==========================================
    const heavenGroup = new THREE.Group();
    heavenGroup.position.set(-4.2, 0.3, 0.2);
    heavenGroup.rotation.y = Math.PI / 4;

    // Glowing Arch
    const archCurve = new THREE.TorusGeometry(1.8, 0.16, 5, 12, Math.PI);
    const heavenArch = new THREE.Mesh(archCurve, goldMat);
    heavenArch.position.y = 1.8;
    heavenArch.rotation.z = Math.PI;
    heavenGroup.add(heavenArch);

    // Halo ring inside arch
    const haloGeo = new THREE.TorusGeometry(0.9, 0.08, 4, 12);
    const haloMat = new THREE.MeshBasicMaterial({ color: 0xffec99 });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.position.y = 2.1;
    heavenGroup.add(halo);

    // Warm volumetric light beam mesh (fades in on Heaven verdict)
    const beamGeo = new THREE.ConeGeometry(2.5, 8.0, 10, 1, true);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0xffea78,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide
    });
    this.heavenBeam = new THREE.Mesh(beamGeo, beamMat);
    this.heavenBeam.position.set(0, 4.0, 0);
    this.heavenBeam.rotation.x = Math.PI;
    root.add(this.heavenBeam);

    root.add(heavenGroup);

    // ==========================================
    // 4. HELL CHASM & CHAINS (Right flank)
    // ==========================================
    const hellGroup = new THREE.Group();
    hellGroup.position.set(4.2, 0.3, 0.2);
    hellGroup.rotation.y = -Math.PI / 4;

    // Jagged obsidian spires
    const spire1 = new THREE.Mesh(new THREE.ConeGeometry(0.35, 2.8, 5), obsidianMat);
    spire1.position.set(-0.6, 1.4, 0);
    spire1.rotation.z = -0.15;
    hellGroup.add(spire1);

    const spire2 = new THREE.Mesh(new THREE.ConeGeometry(0.45, 3.6, 5), obsidianMat);
    spire2.position.set(0, 1.8, 0);
    hellGroup.add(spire2);

    const spire3 = new THREE.Mesh(new THREE.ConeGeometry(0.3, 2.2, 5), obsidianMat);
    spire3.position.set(0.6, 1.1, 0);
    spire3.rotation.z = 0.2;
    hellGroup.add(spire3);

    // Molten brazier on right side
    const brazierGeo = new THREE.CylinderGeometry(0.45, 0.25, 0.7, 6);
    const brazier = new THREE.Mesh(brazierGeo, obsidianMat);
    brazier.position.set(3.4, 0.6, 1.6);
    root.add(brazier);

    // Low-poly flame in brazier
    const flameGeo = new THREE.ConeGeometry(0.25, 0.6, 5);
    const flameMat = new THREE.MeshBasicMaterial({ color: 0xff3b00 });
    const flame = new THREE.Mesh(flameGeo, flameMat);
    flame.position.set(3.4, 1.1, 1.6);
    root.add(flame);
    this.brazierFlame = flame;

    // Chains hanging from above
    const chainMat = new THREE.MeshStandardMaterial({
      color: 0x333333,
      metalness: 0.8,
      roughness: 0.5,
      flatShading: true
    });

    for (let c = 0; c < 3; c++) {
      const chainGroup = new THREE.Group();
      chainGroup.position.set(3.8 + (c - 1) * 0.4, 5.0, -1.0 + c * 0.3);
      for (let link = 0; link < 7; link++) {
        const linkMesh = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.04, 4, 8), chainMat);
        linkMesh.position.y = -link * 0.28;
        linkMesh.rotation.y = (link % 2) * (Math.PI / 2);
        chainGroup.add(linkMesh);
      }
      root.add(chainGroup);
    }

    // Hell floor glow (fades in on Hell verdict)
    const hellGlowGeo = new THREE.CylinderGeometry(2.0, 2.4, 0.2, 10);
    const hellGlowMat = new THREE.MeshBasicMaterial({
      color: 0xff2200,
      transparent: true,
      opacity: 0
    });
    this.hellGlow = new THREE.Mesh(hellGlowGeo, hellGlowMat);
    this.hellGlow.position.set(0, 0.35, 0);
    root.add(this.hellGlow);

    root.add(hellGroup);

    // ==========================================
    // 4B. COMPREHENSIVE HEAVEN REALM (Left Background & Flank)
    // ==========================================
    const heavenDistant = new THREE.Group();
    heavenDistant.position.set(-6.5, 1.8, -5.2);

    // Custom realm materials
    const crystalWaterMat = new THREE.MeshStandardMaterial({
      color: 0x8ce8f5,
      transparent: true,
      opacity: 0.75,
      roughness: 0.2,
      flatShading: true
    });
    const angelMat = new THREE.MeshStandardMaterial({
      color: 0xfbf7ed,
      roughness: 0.5,
      flatShading: true
    });
    const darkSmokeMat = new THREE.MeshStandardMaterial({
      color: 0x1a161f,
      roughness: 0.95,
      transparent: true,
      opacity: 0.65,
      flatShading: true
    });

    // 1. Main Floating Celestial Island
    const hIslandGeo = new THREE.CylinderGeometry(2.4, 0.4, 2.2, 7);
    const hIsland = new THREE.Mesh(hIslandGeo, lightStoneMat);
    hIsland.position.y = -0.3;
    heavenDistant.add(hIsland);

    // Upper marble terrace & gold rim
    const hTerrace = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.3, 0.25, 7), lightStoneMat);
    hTerrace.position.y = 0.85;
    heavenDistant.add(hTerrace);

    const hGoldRim = new THREE.Mesh(new THREE.TorusGeometry(2.2, 0.08, 5, 7), goldMat);
    hGoldRim.rotation.x = Math.PI / 2;
    hGoldRim.position.y = 0.98;
    heavenDistant.add(hGoldRim);

    // 2. Celestial Temple Towers (White & Gold Spire)
    const hTowerBase = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.8, 1.8, 6), lightStoneMat);
    hTowerBase.position.set(-0.8, 1.8, -0.4);
    heavenDistant.add(hTowerBase);

    const hTowerSpire = new THREE.Mesh(new THREE.ConeGeometry(0.65, 2.2, 6), goldMat);
    hTowerSpire.position.set(-0.8, 3.8, -0.4);
    heavenDistant.add(hTowerSpire);

    const hTowerSmall = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.5, 1.2, 6), lightStoneMat);
    hTowerSmall.position.set(0.9, 1.5, 0.3);
    heavenDistant.add(hTowerSmall);

    const hTowerSmallSpire = new THREE.Mesh(new THREE.ConeGeometry(0.38, 1.5, 6), goldMat);
    hTowerSmallSpire.position.set(0.9, 2.85, 0.3);
    heavenDistant.add(hTowerSmallSpire);

    // 3. Glowing Celestial Gate Arch
    const hGatePillarL = new THREE.Mesh(new THREE.BoxGeometry(0.24, 2.2, 0.24), lightStoneMat);
    hGatePillarL.position.set(-0.1, 2.0, 0.6);
    heavenDistant.add(hGatePillarL);

    const hGatePillarR = new THREE.Mesh(new THREE.BoxGeometry(0.24, 2.2, 0.24), lightStoneMat);
    hGatePillarR.position.set(0.7, 2.0, 0.6);
    heavenDistant.add(hGatePillarR);

    const hGateArch = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.25, 0.26), goldMat);
    hGateArch.position.set(0.3, 3.15, 0.6);
    heavenDistant.add(hGateArch);

    const hGateSunburst = new THREE.Mesh(new THREE.CircleGeometry(0.45, 8), new THREE.MeshBasicMaterial({ color: 0xfff6cf, side: THREE.DoubleSide }));
    hGateSunburst.position.set(0.3, 2.5, 0.58);
    heavenDistant.add(hGateSunburst);

    // 4. Cascading Low-Poly Celestial Waterfall
    const waterfallTiers = [];
    const wfGeo1 = new THREE.BoxGeometry(0.65, 0.8, 0.1);
    const wf1 = new THREE.Mesh(wfGeo1, crystalWaterMat);
    wf1.position.set(-1.4, 0.2, 0.7);
    wf1.rotation.x = 0.2;
    heavenDistant.add(wf1);
    waterfallTiers.push(wf1);

    const wfGeo2 = new THREE.BoxGeometry(0.5, 0.9, 0.08);
    const wf2 = new THREE.Mesh(wfGeo2, crystalWaterMat);
    wf2.position.set(-1.4, -0.6, 0.9);
    wf2.rotation.x = -0.15;
    heavenDistant.add(wf2);
    waterfallTiers.push(wf2);

    // 5. Stylized Low-Poly Angelic Statue
    const angelStatue = new THREE.Group();
    angelStatue.position.set(1.4, 1.0, 0.7);
    const aBody = new THREE.Mesh(new THREE.ConeGeometry(0.28, 1.2, 5), angelMat);
    aBody.position.y = 0.6;
    angelStatue.add(aBody);
    const aHead = new THREE.Mesh(new THREE.DodecahedronGeometry(0.14, 0), angelMat);
    aHead.position.y = 1.25;
    angelStatue.add(aHead);
    const aHalo = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.03, 4, 8), goldMat);
    aHalo.rotation.x = Math.PI / 2;
    aHalo.position.y = 1.45;
    angelStatue.add(aHalo);
    const aWingL = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.8, 4), goldMat);
    aWingL.position.set(-0.25, 0.8, -0.1);
    aWingL.rotation.z = 0.6;
    angelStatue.add(aWingL);
    const aWingR = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.8, 4), goldMat);
    aWingR.position.set(0.25, 0.8, -0.1);
    aWingR.rotation.z = -0.6;
    angelStatue.add(aWingR);
    heavenDistant.add(angelStatue);

    root.add(heavenDistant);
    this.heavenDistant = heavenDistant;
    this.waterfallTiers = waterfallTiers;

    // ==========================================
    // 4C. COMPREHENSIVE HELL REALM (Right Background & Flank)
    // ==========================================
    const hellDistant = new THREE.Group();
    hellDistant.position.set(6.5, 1.5, -5.2);

    // 1. Main Jagged Volcanic Crag Island
    const hlIslandGeo = new THREE.CylinderGeometry(2.3, 0.3, 2.4, 6);
    const hlIsland = new THREE.Mesh(hlIslandGeo, obsidianMat);
    hlIsland.position.y = -0.4;
    hellDistant.add(hlIsland);

    // Volcanic basalt terrace & molten cracks
    const hlTerrace = new THREE.Mesh(new THREE.CylinderGeometry(2.1, 2.3, 0.25, 6), obsidianMat);
    hlTerrace.position.y = 0.8;
    hellDistant.add(hlTerrace);

    const hlLavaPool = new THREE.Mesh(new THREE.CircleGeometry(1.2, 7), lavaMat);
    hlLavaPool.rotation.x = -Math.PI / 2;
    hlLavaPool.position.y = 0.94;
    hellDistant.add(hlLavaPool);

    // 2. Gothic Infernal Needle Spire Towers
    const hlSpire1 = new THREE.Mesh(new THREE.ConeGeometry(0.65, 3.6, 5), obsidianMat);
    hlSpire1.position.set(0.8, 2.5, -0.4);
    hlSpire1.rotation.z = -0.08;
    hellDistant.add(hlSpire1);

    const hlSpire1Cap = new THREE.Mesh(new THREE.ConeGeometry(0.3, 1.2, 5), lavaMat);
    hlSpire1Cap.position.set(0.8, 4.4, -0.4);
    hellDistant.add(hlSpire1Cap);

    const hlSpire2 = new THREE.Mesh(new THREE.ConeGeometry(0.48, 2.4, 5), obsidianMat);
    hlSpire2.position.set(-0.9, 1.8, 0.3);
    hlSpire2.rotation.z = 0.12;
    hellDistant.add(hlSpire2);

    // 3. Infernal Horned Gate Arch
    const hlHornL = new THREE.Mesh(new THREE.ConeGeometry(0.25, 2.6, 5), obsidianMat);
    hlHornL.position.set(-0.5, 2.0, 0.6);
    hlHornL.rotation.z = -0.25;
    hellDistant.add(hlHornL);

    const hlHornR = new THREE.Mesh(new THREE.ConeGeometry(0.25, 2.6, 5), obsidianMat);
    hlHornR.position.set(0.4, 2.0, 0.6);
    hlHornR.rotation.z = 0.25;
    hellDistant.add(hlHornR);

    const hlPortalRift = new THREE.Mesh(new THREE.CircleGeometry(0.4, 6), new THREE.MeshBasicMaterial({ color: 0xff2200, side: THREE.DoubleSide }));
    hlPortalRift.position.set(-0.05, 2.2, 0.58);
    hellDistant.add(hlPortalRift);

    // 4. Low-Poly Dark Smoke Puffs
    const smokePuffs = [];
    const smGeo1 = new THREE.DodecahedronGeometry(0.35, 0);
    const sm1 = new THREE.Mesh(smGeo1, darkSmokeMat);
    sm1.position.set(-0.3, 1.4, 0.8);
    hellDistant.add(sm1);
    smokePuffs.push({ mesh: sm1, baseY: 1.4, speed: 0.8 });

    const smGeo2 = new THREE.DodecahedronGeometry(0.28, 0);
    const sm2 = new THREE.Mesh(smGeo2, darkSmokeMat);
    sm2.position.set(0.3, 1.8, 0.5);
    hellDistant.add(sm2);
    smokePuffs.push({ mesh: sm2, baseY: 1.8, speed: 1.1 });

    root.add(hellDistant);
    this.hellDistant = hellDistant;
    this.smokePuffs = smokePuffs;

    // ==========================================
    // 5. SCALES OF JUSTICE (Background centerpiece)
    // ==========================================
    const scalesRoot = new THREE.Group();
    scalesRoot.position.set(0, 0.25, -4.5);

    // Scales Stand
    const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.2, 4.2, 6), goldMat);
    stand.position.y = 2.1;
    scalesRoot.add(stand);

    // Balance Beam
    this.scalesBeam = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.1, 0.1), goldMat);
    this.scalesBeam.position.y = 4.1;
    scalesRoot.add(this.scalesBeam);

    // Left Pan (Heaven)
    this.scalesLeftPan = new THREE.Group();
    this.scalesLeftPan.position.set(-1.6, 3.4, 0);
    const leftPanMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.1, 0.18, 7), goldMat);
    this.scalesLeftPan.add(leftPanMesh);
    scalesRoot.add(this.scalesLeftPan);

    // Right Pan (Hell)
    this.scalesRightPan = new THREE.Group();
    this.scalesRightPan.position.set(1.6, 3.4, 0);
    const rightPanMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.1, 0.18, 7), obsidianMat);
    this.scalesRightPan.add(rightPanMesh);
    scalesRoot.add(this.scalesRightPan);

    root.add(scalesRoot);

    // ==========================================
    // 6. LOW-POLY CANDLES WITH FLICKERING FLAMES
    // ==========================================
    const candlePositions = [
      [-2.8, 0.35, 2.2],
      [-3.2, 0.35, 1.6],
      [2.8, 0.35, 2.2],
      [-1.5, 0.35, 3.4],
      [1.5, 0.35, 3.4]
    ];

    candlePositions.forEach((pos) => {
      const candleGroup = new THREE.Group();
      candleGroup.position.set(pos[0], pos[1], pos[2]);

      const wax = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.08, 0.35, 6),
        new THREE.MeshStandardMaterial({ color: 0xf4eedb, roughness: 0.9, flatShading: true })
      );
      wax.position.y = 0.175;
      candleGroup.add(wax);

      const wick = new THREE.Mesh(
        new THREE.CylinderGeometry(0.01, 0.01, 0.08, 4),
        new THREE.MeshBasicMaterial({ color: 0x222222 })
      );
      wick.position.y = 0.38;
      candleGroup.add(wick);

      const cFlame = new THREE.Mesh(
        new THREE.ConeGeometry(0.06, 0.16, 5),
        new THREE.MeshBasicMaterial({ color: 0xffaa00 })
      );
      cFlame.position.y = 0.46;
      candleGroup.add(cFlame);

      root.add(candleGroup);
      this.candles.push(cFlame);
    });

    // ==========================================
    // 7. LOW-POLY VOLUMETRIC CLOUDS
    // ==========================================
    this.createCloudCluster(root, cloudMat);

    // ==========================================
    // 8. PARTICLE SYSTEMS
    // ==========================================
    this.initParticles(root);
  }

  createCloudCluster(root, mat) {
    const cloudConfigs = [
      { x: -7, y: -0.5, z: -3, scale: 1.4 },
      { x: 7, y: -0.8, z: -4, scale: 1.6 },
      { x: -5, y: -1.2, z: 4, scale: 1.2 },
      { x: 5, y: -1.0, z: 3.5, scale: 1.3 },
      { x: 0, y: -2.8, z: 6, scale: 2.0 },
      { x: -8, y: 1.5, z: -6, scale: 1.8 },
      { x: 8, y: 1.2, z: -7, scale: 1.9 }
    ];

    cloudConfigs.forEach((cfg) => {
      const cloud = new THREE.Group();
      cloud.position.set(cfg.x, cfg.y, cfg.z);

      // Create compound faceted cloud puffs
      const numPuffs = 5 + Math.floor(Math.random() * 4);
      for (let p = 0; p < numPuffs; p++) {
        const radius = (0.6 + Math.random() * 0.8) * cfg.scale;
        const puffGeo = new THREE.DodecahedronGeometry(radius, 0);
        const puff = new THREE.Mesh(puffGeo, mat);
        puff.position.set(
          (Math.random() - 0.5) * 1.8 * cfg.scale,
          (Math.random() - 0.4) * 0.8 * cfg.scale,
          (Math.random() - 0.5) * 1.5 * cfg.scale
        );
        cloud.add(puff);
      }

      root.add(cloud);
      this.clouds.push({
        group: cloud,
        baseX: cfg.x,
        speed: 0.15 + Math.random() * 0.2
      });
    });
  }

  initParticles(root) {
    // 1. Ambient Celestial Motes
    const moteCount = 60;
    const moteGeo = new THREE.BufferGeometry();
    const motePos = new Float32Array(moteCount * 3);

    for (let i = 0; i < moteCount; i++) {
      motePos[i * 3] = (Math.random() - 0.5) * 14;
      motePos[i * 3 + 1] = 0.5 + Math.random() * 7;
      motePos[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    moteGeo.setAttribute('position', new THREE.BufferAttribute(motePos, 3));

    const moteMat = new THREE.PointsMaterial({
      color: 0xfff6cf,
      size: 0.12,
      transparent: true,
      opacity: 0.75
    });
    this.ambientMotes = new THREE.Points(moteGeo, moteMat);
    root.add(this.ambientMotes);

    // 2. Heaven Sparkle Burst System
    const hCount = 80;
    const hGeo = new THREE.BufferGeometry();
    const hPos = new Float32Array(hCount * 3);
    this.heavenVelocities = [];

    for (let i = 0; i < hCount; i++) {
      hPos[i * 3] = (Math.random() - 0.5) * 1.2;
      hPos[i * 3 + 1] = 0.5 + Math.random() * 2;
      hPos[i * 3 + 2] = (Math.random() - 0.5) * 1.2;
      this.heavenVelocities.push({
        vx: (Math.random() - 0.5) * 1.2,
        vy: 2.0 + Math.random() * 3.0,
        vz: (Math.random() - 0.5) * 1.2,
        life: 0
      });
    }
    hGeo.setAttribute('position', new THREE.BufferAttribute(hPos, 3));
    this.heavenParticles = new THREE.Points(
      hGeo,
      new THREE.PointsMaterial({ color: 0xffdf59, size: 0.22, transparent: true, opacity: 0 })
    );
    root.add(this.heavenParticles);

    // 3. Hell Fire & Smoke Ember System
    const fCount = 80;
    const fGeo = new THREE.BufferGeometry();
    const fPos = new Float32Array(fCount * 3);
    this.hellVelocities = [];

    for (let i = 0; i < fCount; i++) {
      fPos[i * 3] = (Math.random() - 0.5) * 1.4;
      fPos[i * 3 + 1] = 0.1;
      fPos[i * 3 + 2] = (Math.random() - 0.5) * 1.4;
      this.hellVelocities.push({
        vx: (Math.random() - 0.5) * 2.0,
        vy: 1.0 + Math.random() * 2.5,
        vz: (Math.random() - 0.5) * 2.0,
        life: 0
      });
    }
    fGeo.setAttribute('position', new THREE.BufferAttribute(fPos, 3));
    this.hellParticles = new THREE.Points(
      fGeo,
      new THREE.PointsMaterial({ color: 0xff3b00, size: 0.25, transparent: true, opacity: 0 })
    );
    root.add(this.hellParticles);

    // 4. Subtle Left Flank Heaven Particles (Soft white & pale gold celestial dust)
    const hDustCount = 45;
    const hDustGeo = new THREE.BufferGeometry();
    const hDustPos = new Float32Array(hDustCount * 3);
    for (let i = 0; i < hDustCount; i++) {
      hDustPos[i * 3] = -5.8 + Math.random() * 4.0;
      hDustPos[i * 3 + 1] = 0.5 + Math.random() * 6.0;
      hDustPos[i * 3 + 2] = -3.5 + Math.random() * 6.0;
    }
    hDustGeo.setAttribute('position', new THREE.BufferAttribute(hDustPos, 3));
    this.heavenAmbientMotes = new THREE.Points(
      hDustGeo,
      new THREE.PointsMaterial({ color: 0xfffae6, size: 0.14, transparent: true, opacity: 0.7 })
    );
    root.add(this.heavenAmbientMotes);

    // 5. Subtle Right Flank Hell Particles (Tiny embers & warm ash)
    const hEmberCount = 45;
    const hEmberGeo = new THREE.BufferGeometry();
    const hEmberPos = new Float32Array(hEmberCount * 3);
    for (let i = 0; i < hEmberCount; i++) {
      hEmberPos[i * 3] = 1.8 + Math.random() * 4.2;
      hEmberPos[i * 3 + 1] = 0.3 + Math.random() * 5.5;
      hEmberPos[i * 3 + 2] = -3.5 + Math.random() * 6.0;
    }
    hEmberGeo.setAttribute('position', new THREE.BufferAttribute(hEmberPos, 3));
    this.hellAmbientEmbers = new THREE.Points(
      hEmberGeo,
      new THREE.PointsMaterial({ color: 0xff4d1a, size: 0.12, transparent: true, opacity: 0.75 })
    );
    root.add(this.hellAmbientEmbers);
  }

  triggerHeavenFX() {
    if (this.heavenBeam) {
      this.heavenBeam.material.opacity = 0.65;
    }
    if (this.heavenParticles) {
      this.heavenParticles.material.opacity = 0.95;
      const pos = this.heavenParticles.geometry.attributes.position.array;
      for (let i = 0; i < this.heavenVelocities.length; i++) {
        pos[i * 3] = (Math.random() - 0.5) * 1.0;
        pos[i * 3 + 1] = 0.5;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 1.0;
        this.heavenVelocities[i].life = 1.0;
      }
      this.heavenParticles.geometry.attributes.position.needsUpdate = true;
    }
  }

  triggerHellFX() {
    if (this.hellGlow) {
      this.hellGlow.material.opacity = 0.85;
    }
    // Open trapdoors
    if (this.trapdoors.length === 2) {
      this.trapdoors[0].rotation.z = -Math.PI / 3;
      this.trapdoors[1].rotation.z = Math.PI / 3;
    }

    if (this.hellParticles) {
      this.hellParticles.material.opacity = 1.0;
      const pos = this.hellParticles.geometry.attributes.position.array;
      for (let i = 0; i < this.hellVelocities.length; i++) {
        pos[i * 3] = (Math.random() - 0.5) * 1.2;
        pos[i * 3 + 1] = 0.2;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 1.2;
        this.hellVelocities[i].life = 1.0;
      }
      this.hellParticles.geometry.attributes.position.needsUpdate = true;
    }
  }

  resetEffects() {
    if (this.heavenBeam) {
      this.heavenBeam.material.opacity = 0;
    }
    if (this.hellGlow) {
      this.hellGlow.material.opacity = 0;
    }
    if (this.heavenParticles) {
      this.heavenParticles.material.opacity = 0;
    }
    if (this.hellParticles) {
      this.hellParticles.material.opacity = 0;
    }
    if (this.trapdoors.length === 2) {
      this.trapdoors[0].rotation.z = 0;
      this.trapdoors[1].rotation.z = 0;
    }
  }

  update(delta, time) {
    // 1. Drift clouds slowly
    this.clouds.forEach((c) => {
      c.group.position.x = c.baseX + Math.sin(time * 0.15 * c.speed) * 0.8;
      c.group.position.y += Math.sin(time * 0.4 + c.baseX) * 0.002;
    });

    // 2. Flicker candle & brazier flames
    const flameScale = 1.0 + Math.sin(time * 18) * 0.18 + Math.cos(time * 30) * 0.1;
    this.candles.forEach((candle, idx) => {
      candle.scale.set(flameScale, flameScale * (0.9 + (idx % 3) * 0.1), flameScale);
    });
    if (this.brazierFlame) {
      const bScale = 1.0 + Math.sin(time * 12) * 0.25;
      this.brazierFlame.scale.set(bScale, bScale * 1.15, bScale);
    }

    // 3. Subtle tilting of the Scales of Justice
    if (this.scalesBeam) {
      const tilt = Math.sin(time * 0.8) * 0.08;
      this.scalesBeam.rotation.z = tilt;
      if (this.scalesLeftPan && this.scalesRightPan) {
        this.scalesLeftPan.position.y = 3.4 - tilt * 1.6;
        this.scalesRightPan.position.y = 3.4 + tilt * 1.6;
      }
    }

    // 4. Ambient motes rising
    if (this.ambientMotes) {
      const pos = this.ambientMotes.geometry.attributes.position.array;
      for (let i = 1; i < pos.length; i += 3) {
        pos[i] += delta * 0.35;
        if (pos[i] > 7.5) pos[i] = 0.5;
      }
      this.ambientMotes.geometry.attributes.position.needsUpdate = true;
    }

    // 4B. Subtle Left/Right Flank ambient particles
    if (this.heavenAmbientMotes) {
      const pos = this.heavenAmbientMotes.geometry.attributes.position.array;
      for (let i = 1; i < pos.length; i += 3) {
        pos[i] += delta * 0.28;
        if (pos[i] > 6.8) pos[i] = 0.5;
      }
      this.heavenAmbientMotes.geometry.attributes.position.needsUpdate = true;
    }
    if (this.hellAmbientEmbers) {
      const pos = this.hellAmbientEmbers.geometry.attributes.position.array;
      for (let i = 1; i < pos.length; i += 3) {
        pos[i] += delta * 0.38;
        if (pos[i] > 6.4) pos[i] = 0.3;
      }
      this.hellAmbientEmbers.geometry.attributes.position.needsUpdate = true;
    }

    // 4C. Gentle floating of distant background structures
    if (this.heavenDistant) {
      this.heavenDistant.position.y = 1.8 + Math.sin(time * 0.5) * 0.08;
    }
    if (this.hellDistant) {
      this.hellDistant.position.y = 1.5 + Math.sin(time * 0.6 + 1.2) * 0.06;
    }

    // 4D. Waterfall ripple & dark smoke puff rise
    if (this.waterfallTiers) {
      this.waterfallTiers.forEach((wf, idx) => {
        wf.scale.y = 1.0 + Math.sin(time * 3.5 + idx) * 0.08;
      });
    }
    if (this.smokePuffs) {
      this.smokePuffs.forEach((puff, idx) => {
        puff.mesh.position.y = puff.baseY + Math.sin(time * puff.speed + idx) * 0.12;
        puff.mesh.scale.setScalar(0.9 + Math.sin(time * 2.0 + idx) * 0.15);
      });
    }

    // 5. Active Heaven particles update
    if (this.heavenParticles && this.heavenParticles.material.opacity > 0) {
      const pos = this.heavenParticles.geometry.attributes.position.array;
      for (let i = 0; i < this.heavenVelocities.length; i++) {
        const v = this.heavenVelocities[i];
        if (v.life > 0) {
          pos[i * 3] += v.vx * delta;
          pos[i * 3 + 1] += v.vy * delta;
          pos[i * 3 + 2] += v.vz * delta;
          v.life -= delta * 1.4;
        }
      }
      this.heavenParticles.geometry.attributes.position.needsUpdate = true;
      this.heavenParticles.material.opacity = Math.max(0, this.heavenParticles.material.opacity - delta * 0.8);
      if (this.heavenBeam && this.heavenBeam.material.opacity > 0) {
        this.heavenBeam.material.opacity = Math.max(0, this.heavenBeam.material.opacity - delta * 0.7);
      }
    }

    // 6. Active Hell particles update
    if (this.hellParticles && this.hellParticles.material.opacity > 0) {
      const pos = this.hellParticles.geometry.attributes.position.array;
      for (let i = 0; i < this.hellVelocities.length; i++) {
        const v = this.hellVelocities[i];
        if (v.life > 0) {
          pos[i * 3] += v.vx * delta;
          pos[i * 3 + 1] += v.vy * delta;
          pos[i * 3 + 2] += v.vz * delta;
          v.life -= delta * 1.6;
        }
      }
      this.hellParticles.geometry.attributes.position.needsUpdate = true;
      this.hellParticles.material.opacity = Math.max(0, this.hellParticles.material.opacity - delta * 0.9);
      if (this.hellGlow && this.hellGlow.material.opacity > 0) {
        this.hellGlow.material.opacity = Math.max(0, this.hellGlow.material.opacity - delta * 0.8);
      }
    }
  }
}

window.CelestialEnvironment = CelestialEnvironment;
