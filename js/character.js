/**
 * Celestial Judgment - Low-Poly Character Procedural Generator
 * Generates faceted, stylized 3D characters with chunky mobile proportions,
 * distinct silhouettes, unique life accessories, and an articulated hierarchy.
 */

class CharacterFactory {
  constructor() {
    this.sharedMaterials = this.initMaterials();
  }

  initMaterials() {
    // Clean matte low-poly materials with flat shading
    const createMat = (color, roughness = 0.8) => {
      return new THREE.MeshStandardMaterial({
        color: color,
        roughness: roughness,
        metalness: 0.1,
        flatShading: true
      });
    };

    return {
      skin1: createMat(0xffd1b3), // Fair
      skin2: createMat(0xe0ac69), // Warm tan
      skin3: createMat(0x8d5524), // Rich bronze
      skin4: createMat(0xc68642), // Olive tan
      white: createMat(0xf0f2f5),
      darkGrey: createMat(0x2a2c33),
      black: createMat(0x1a1b20),
      navy: createMat(0x1e2d42),
      militaryGreen: createMat(0x3e5235),
      denimBlue: createMat(0x2b4c7e),
      burglarStripe: createMat(0x222226),
      gold: new THREE.MeshStandardMaterial({
        color: 0xffd700,
        roughness: 0.3,
        metalness: 0.8,
        flatShading: true
      }),
      crimson: createMat(0xa31d24),
      straw: createMat(0xd4af37),
      leather: createMat(0x5c3317),
      wood: createMat(0x734b28),
      teal: createMat(0x1f8074),
      purple: createMat(0x5e2d79),
      cyanGlow: new THREE.MeshBasicMaterial({ color: 0x00f0ff }),
      orangeGlow: new THREE.MeshBasicMaterial({ color: 0xff7700 }),
      eyeWhite: createMat(0xffffff, 0.4),
      eyePupil: createMat(0x111116, 0.2)
    };
  }

  createSoul(archetype) {
    const root = new THREE.Group();
    root.name = "SoulRoot";

    // Randomize skin tone subtly
    const skins = [this.sharedMaterials.skin1, this.sharedMaterials.skin2, this.sharedMaterials.skin3, this.sharedMaterials.skin4];
    const skinMat = skins[Math.floor(Math.random() * skins.length)];

    // Articulation Hierarchy:
    // root -> hips -> torso -> neck -> head
    //               -> leftArm, rightArm
    //      -> leftLeg, rightLeg
    const hips = new THREE.Group();
    hips.position.y = 1.05;
    root.add(hips);

    const torso = new THREE.Group();
    hips.add(torso);

    const headGroup = new THREE.Group();
    headGroup.position.y = 1.05;
    torso.add(headGroup);

    // ==========================================
    // 1. HEAD (Large, readable, expressive silhouette)
    // ==========================================
    const headGeo = new THREE.BoxGeometry(0.72, 0.75, 0.72);
    const headMesh = new THREE.Mesh(headGeo, skinMat);
    headMesh.castShadow = true;
    headGroup.add(headMesh);

    // Eyes (Chunky expressive eyes)
    const eyeGeo = new THREE.BoxGeometry(0.14, 0.18, 0.08);
    const pupilGeo = new THREE.BoxGeometry(0.08, 0.1, 0.06);

    const leftEye = new THREE.Mesh(eyeGeo, this.sharedMaterials.eyeWhite);
    leftEye.position.set(-0.18, 0.08, 0.36);
    headGroup.add(leftEye);

    const leftPupil = new THREE.Mesh(pupilGeo, this.sharedMaterials.eyePupil);
    leftPupil.position.set(-0.18, 0.08, 0.39);
    headGroup.add(leftPupil);

    const rightEye = new THREE.Mesh(eyeGeo, this.sharedMaterials.eyeWhite);
    rightEye.position.set(0.18, 0.08, 0.36);
    headGroup.add(rightEye);

    const rightPupil = new THREE.Mesh(pupilGeo, this.sharedMaterials.eyePupil);
    rightPupil.position.set(0.18, 0.08, 0.39);
    headGroup.add(rightPupil);

    // Eyebrows
    const browGeo = new THREE.BoxGeometry(0.2, 0.05, 0.06);
    const leftBrow = new THREE.Mesh(browGeo, this.sharedMaterials.black);
    leftBrow.position.set(-0.17, 0.2, 0.38);
    headGroup.add(leftBrow);

    const rightBrow = new THREE.Mesh(browGeo, this.sharedMaterials.black);
    rightBrow.position.set(0.17, 0.2, 0.38);
    headGroup.add(rightBrow);

    // Stylized Simple Mouth
    const mouthGeo = new THREE.BoxGeometry(0.18, 0.05, 0.04);
    const mouth = new THREE.Mesh(mouthGeo, this.sharedMaterials.crimson);
    mouth.position.set(0, -0.18, 0.36);
    headGroup.add(mouth);

    // ==========================================
    // 2. TORSO & PELVIS
    // ==========================================
    const torsoGeo = new THREE.CylinderGeometry(0.42, 0.34, 0.85, 6);
    let torsoMat = this.sharedMaterials.navy;
    let pantsMat = this.sharedMaterials.darkGrey;

    // Pelvis
    const pelvisGeo = new THREE.CylinderGeometry(0.34, 0.32, 0.3, 6);
    const pelvisMesh = new THREE.Mesh(pelvisGeo, pantsMat);
    pelvisMesh.position.y = -0.15;
    pelvisMesh.castShadow = true;
    hips.add(pelvisMesh);

    // ==========================================
    // 3. LIMBS (Chunky, readable arms and legs)
    // ==========================================
    // Arms
    const armGeo = new THREE.CylinderGeometry(0.11, 0.1, 0.7, 5);
    const handGeo = new THREE.BoxGeometry(0.18, 0.18, 0.18);

    // Left Arm
    const leftArm = new THREE.Group();
    leftArm.position.set(-0.54, 0.35, 0);
    torso.add(leftArm);

    const leftArmMesh = new THREE.Mesh(armGeo, torsoMat);
    leftArmMesh.position.y = -0.35;
    leftArmMesh.castShadow = true;
    leftArm.add(leftArmMesh);

    const leftHand = new THREE.Mesh(handGeo, skinMat);
    leftHand.position.y = -0.72;
    leftHand.castShadow = true;
    leftArm.add(leftHand);

    // Right Arm
    const rightArm = new THREE.Group();
    rightArm.position.set(0.54, 0.35, 0);
    torso.add(rightArm);

    const rightArmMesh = new THREE.Mesh(armGeo, torsoMat);
    rightArmMesh.position.y = -0.35;
    rightArmMesh.castShadow = true;
    rightArm.add(rightArmMesh);

    const rightHand = new THREE.Mesh(handGeo, skinMat);
    rightHand.position.y = -0.72;
    rightHand.castShadow = true;
    rightArm.add(rightHand);

    // Legs
    const legGeo = new THREE.CylinderGeometry(0.14, 0.12, 0.8, 5);
    const footGeo = new THREE.BoxGeometry(0.22, 0.16, 0.34);

    // Left Leg
    const leftLeg = new THREE.Group();
    leftLeg.position.set(-0.2, 0, 0);
    root.add(leftLeg);

    const leftLegMesh = new THREE.Mesh(legGeo, pantsMat);
    leftLegMesh.position.y = 0.55;
    leftLegMesh.castShadow = true;
    leftLeg.add(leftLegMesh);

    const leftFoot = new THREE.Mesh(footGeo, this.sharedMaterials.black);
    leftFoot.position.set(0, 0.1, 0.06);
    leftFoot.castShadow = true;
    leftLeg.add(leftFoot);

    // Right Leg
    const rightLeg = new THREE.Group();
    rightLeg.position.set(0.2, 0, 0);
    root.add(rightLeg);

    const rightLegMesh = new THREE.Mesh(legGeo, pantsMat);
    rightLegMesh.position.y = 0.55;
    rightLegMesh.castShadow = true;
    rightLeg.add(rightLegMesh);

    const rightFoot = new THREE.Mesh(footGeo, this.sharedMaterials.black);
    rightFoot.position.set(0, 0.1, 0.06);
    rightFoot.castShadow = true;
    rightLeg.add(rightFoot);

    // ==========================================
    // 4. ARCHETYPE CUSTOMIZATION & ACCESSORIES
    // ==========================================
    const accessories = new THREE.Group();
    accessories.name = "Accessories";
    root.add(accessories);

    switch (archetype) {
      case "doctor":
        torsoMat = this.sharedMaterials.white;
        pantsMat = this.sharedMaterials.teal;

        // Stethoscope around neck
        const stethRing = new THREE.TorusGeometry(0.28, 0.035, 4, 12, Math.PI * 1.3);
        const stethMesh = new THREE.Mesh(stethRing, this.sharedMaterials.darkGrey);
        stethMesh.rotation.x = Math.PI / 2.2;
        stethMesh.rotation.z = Math.PI;
        stethMesh.position.set(0, 0.5, 0.1);
        torso.add(stethMesh);

        // Medical bag in right hand
        const medBagGeo = new THREE.BoxGeometry(0.35, 0.28, 0.2);
        const medBag = new THREE.Mesh(medBagGeo, this.sharedMaterials.white);
        medBag.position.set(0, -0.22, 0);
        medBag.castShadow = true;

        // Red cross on bag
        const crossH = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.06, 0.22), this.sharedMaterials.crimson);
        const crossV = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.18, 0.22), this.sharedMaterials.crimson);
        medBag.add(crossH);
        medBag.add(crossV);
        rightHand.add(medBag);

        // Short neat doctor hair
        const docHair = new THREE.Mesh(new THREE.BoxGeometry(0.74, 0.2, 0.74), this.sharedMaterials.darkGrey);
        docHair.position.y = 0.38;
        headGroup.add(docHair);
        break;

      case "soldier":
        torsoMat = this.sharedMaterials.militaryGreen;
        pantsMat = this.sharedMaterials.militaryGreen;

        // Helmet
        const helmetGeo = new THREE.CylinderGeometry(0.48, 0.44, 0.35, 8);
        const helmet = new THREE.Mesh(helmetGeo, this.sharedMaterials.militaryGreen);
        helmet.position.y = 0.36;
        helmet.castShadow = true;
        headGroup.add(helmet);

        const brimGeo = new THREE.CylinderGeometry(0.52, 0.52, 0.06, 8);
        const brim = new THREE.Mesh(brimGeo, this.sharedMaterials.militaryGreen);
        brim.position.y = 0.22;
        headGroup.add(brim);

        // Dog tags
        const dogTag = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.12, 0.02), this.sharedMaterials.gold);
        dogTag.position.set(0, 0.25, 0.35);
        torso.add(dogTag);

        // Canteen on hip
        const canteen = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.2, 6), this.sharedMaterials.darkGrey);
        canteen.position.set(-0.35, 0, 0);
        hips.add(canteen);
        break;

      case "businessman":
        torsoMat = this.sharedMaterials.navy;
        pantsMat = this.sharedMaterials.navy;

        // White shirt collar
        const shirtV = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.3, 0.36), this.sharedMaterials.white);
        shirtV.position.set(0, 0.3, 0.15);
        torso.add(shirtV);

        // Red tie
        const tieGeo = new THREE.BoxGeometry(0.09, 0.45, 0.05);
        const tie = new THREE.Mesh(tieGeo, this.sharedMaterials.crimson);
        tie.position.set(0, 0.15, 0.35);
        torso.add(tie);

        // Briefcase
        const caseGeo = new THREE.BoxGeometry(0.42, 0.32, 0.12);
        const briefcase = new THREE.Mesh(caseGeo, this.sharedMaterials.leather);
        briefcase.position.set(0, -0.22, 0);
        briefcase.castShadow = true;

        const handle = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.08, 0.04), this.sharedMaterials.gold);
        handle.position.y = 0.18;
        briefcase.add(handle);
        rightHand.add(briefcase);

        // Slicked dark hair
        const bizHair = new THREE.Mesh(new THREE.BoxGeometry(0.74, 0.22, 0.76), this.sharedMaterials.black);
        bizHair.position.y = 0.36;
        headGroup.add(bizHair);
        break;

      case "farmer":
        torsoMat = this.sharedMaterials.white;
        pantsMat = this.sharedMaterials.denimBlue;

        // Blue Overalls bib
        const bib = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.5, 0.35), this.sharedMaterials.denimBlue);
        bib.position.set(0, 0.05, 0.15);
        torso.add(bib);

        // Straw hat
        const hatBrim = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.68, 0.06, 8), this.sharedMaterials.straw);
        hatBrim.position.y = 0.38;
        headGroup.add(hatBrim);

        const hatCrown = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.42, 0.35, 8), this.sharedMaterials.straw);
        hatCrown.position.y = 0.55;
        headGroup.add(hatCrown);

        // Wheat stalk in mouth
        const wheatStalk = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.4, 4), this.sharedMaterials.gold);
        wheatStalk.rotation.z = Math.PI / 3;
        wheatStalk.position.set(0.15, -0.18, 0.38);
        headGroup.add(wheatStalk);
        break;

      case "thief":
        torsoMat = this.sharedMaterials.burglarStripe;
        pantsMat = this.sharedMaterials.black;

        // Burglar beanie
        const beanie = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.46, 0.3, 8), this.sharedMaterials.black);
        beanie.position.y = 0.44;
        headGroup.add(beanie);

        // Domino eye mask
        const maskGeo = new THREE.BoxGeometry(0.65, 0.18, 0.05);
        const mask = new THREE.Mesh(maskGeo, this.sharedMaterials.black);
        mask.position.set(0, 0.08, 0.38);
        headGroup.add(mask);

        // Loot bag over left shoulder
        const sackGeo = new THREE.DodecahedronGeometry(0.32, 0);
        const sack = new THREE.Mesh(sackGeo, this.sharedMaterials.leather);
        sack.position.set(-0.35, 0.3, -0.2);
        sack.castShadow = true;
        torso.add(sack);
        break;

      case "artist":
        torsoMat = this.sharedMaterials.white;
        pantsMat = this.sharedMaterials.darkGrey;

        // French beret tilted
        const beret = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.42, 0.15, 8), this.sharedMaterials.purple);
        beret.position.set(0.1, 0.45, 0);
        beret.rotation.z = -0.25;
        headGroup.add(beret);

        // Artist palette in left hand
        const paletteGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.03, 7);
        const palette = new THREE.Mesh(paletteGeo, this.sharedMaterials.wood);
        palette.rotation.x = Math.PI / 2;
        palette.position.set(0, -0.15, 0.1);
        leftHand.add(palette);

        // Paint spots on palette
        const dot1 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.04, 4), this.sharedMaterials.crimson);
        dot1.position.set(-0.1, 0.02, 0);
        palette.add(dot1);

        const dot2 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.04, 4), this.sharedMaterials.cyanGlow);
        dot2.position.set(0.1, 0.02, 0.08);
        palette.add(dot2);

        const dot3 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.04, 4), this.sharedMaterials.gold);
        dot3.position.set(0.05, 0.02, -0.1);
        palette.add(dot3);

        // Paintbrush in right hand
        const brush = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.4, 4), this.sharedMaterials.wood);
        brush.position.set(0, -0.1, 0);
        rightHand.add(brush);
        break;

      case "scientist":
        torsoMat = this.sharedMaterials.white;
        pantsMat = this.sharedMaterials.darkGrey;

        // Cyber visor
        const visor = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.15, 0.12), this.sharedMaterials.cyanGlow);
        visor.position.set(0, 0.08, 0.38);
        headGroup.add(visor);

        // Chemical flask
        const flaskGeo = new THREE.ConeGeometry(0.16, 0.3, 6);
        const flask = new THREE.Mesh(flaskGeo, this.sharedMaterials.cyanGlow);
        flask.rotation.x = Math.PI;
        flask.position.set(0, -0.2, 0);
        rightHand.add(flask);
        break;

      case "chef":
        torsoMat = this.sharedMaterials.white;
        pantsMat = this.sharedMaterials.black;

        // Puffy chef toque hat
        const toqueBase = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.18, 8), this.sharedMaterials.white);
        toqueBase.position.y = 0.44;
        headGroup.add(toqueBase);

        const toqueTop = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.36, 0.35, 8), this.sharedMaterials.white);
        toqueTop.position.y = 0.68;
        headGroup.add(toqueTop);

        // Rolling pin in right hand
        const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.5, 6), this.sharedMaterials.wood);
        pin.position.set(0, -0.15, 0);
        pin.rotation.z = Math.PI / 4;
        rightHand.add(pin);
        break;

      case "king":
        torsoMat = this.sharedMaterials.crimson;
        pantsMat = this.sharedMaterials.white;

        // Royal crown
        const crownBase = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.4, 0.22, 6), this.sharedMaterials.gold);
        crownBase.position.y = 0.48;
        headGroup.add(crownBase);

        // Ruby in crown
        const crownGem = new THREE.Mesh(new THREE.DodecahedronGeometry(0.08, 0), this.sharedMaterials.crimson);
        crownGem.position.set(0, 0.52, 0.38);
        headGroup.add(crownGem);

        // Scepter in right hand
        const scepterShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.65, 5), this.sharedMaterials.gold);
        scepterShaft.position.set(0, -0.1, 0);
        const scepterOrb = new THREE.Mesh(new THREE.DodecahedronGeometry(0.12, 0), this.sharedMaterials.gold);
        scepterOrb.position.y = 0.35;
        scepterShaft.add(scepterOrb);
        rightHand.add(scepterShaft);
        break;

      case "astronaut":
        torsoMat = this.sharedMaterials.white;
        pantsMat = this.sharedMaterials.white;

        // Bulky space helmet
        const astroHelm = new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.88, 0.86), this.sharedMaterials.white);
        astroHelm.position.y = 0.05;
        headGroup.add(astroHelm);

        const goldVisor = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.45, 0.15), this.sharedMaterials.gold);
        goldVisor.position.set(0, 0.05, 0.42);
        headGroup.add(goldVisor);

        // Oxygen backpack
        const pack = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.7, 0.28), this.sharedMaterials.white);
        pack.position.set(0, 0, -0.32);
        pack.castShadow = true;
        torso.add(pack);
        break;

      default:
        // Default neat hair
        const defaultHair = new THREE.Mesh(new THREE.BoxGeometry(0.74, 0.25, 0.74), this.sharedMaterials.darkGrey);
        defaultHair.position.y = 0.38;
        headGroup.add(defaultHair);
        break;
    }

    // Apply materials to torso & limbs
    const torsoMesh = new THREE.Mesh(torsoGeo, torsoMat);
    torsoMesh.position.y = 0.35;
    torsoMesh.castShadow = true;
    torso.add(torsoMesh);

    pelvisMesh.material = pantsMat;
    leftArmMesh.material = torsoMat;
    rightArmMesh.material = torsoMat;
    leftLegMesh.material = pantsMat;
    rightLegMesh.material = pantsMat;

    // References for animator
    return {
      root: root,
      hips: hips,
      torso: torso,
      head: headGroup,
      leftArm: leftArm,
      rightArm: rightArm,
      leftLeg: leftLeg,
      rightLeg: rightLeg,
      mouth: mouth,
      leftEye: leftEye,
      rightEye: rightEye,
      archetype: archetype
    };
  }

  createAngel() {
    const root = new THREE.Group();
    root.name = "AngelRoot";

    const angelWhite = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.5,
      metalness: 0.1,
      flatShading: true
    });
    const angelGold = new THREE.MeshStandardMaterial({
      color: 0xffdf55,
      roughness: 0.25,
      metalness: 0.85,
      flatShading: true
    });
    const glowHaloMat = new THREE.MeshBasicMaterial({
      color: 0xfff490
    });

    // Flowing Robe Body
    const robeGeo = new THREE.CylinderGeometry(0.38, 0.65, 1.7, 8);
    const robe = new THREE.Mesh(robeGeo, angelWhite);
    robe.position.y = 1.15;
    robe.castShadow = true;
    root.add(robe);

    // Gold Sash / Trim
    const sash = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.42, 0.2, 8), angelGold);
    sash.position.y = 1.35;
    root.add(sash);

    // Serene Head
    const headGroup = new THREE.Group();
    headGroup.position.y = 2.25;
    root.add(headGroup);

    const headGeo = new THREE.BoxGeometry(0.68, 0.72, 0.68);
    const head = new THREE.Mesh(headGeo, angelWhite);
    head.castShadow = true;
    headGroup.add(head);

    // Radiant Golden Eyes
    const eyeGeo = new THREE.BoxGeometry(0.12, 0.14, 0.08);
    const leftEye = new THREE.Mesh(eyeGeo, angelGold);
    leftEye.position.set(-0.16, 0.06, 0.35);
    headGroup.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeo, angelGold);
    rightEye.position.set(0.16, 0.06, 0.35);
    headGroup.add(rightEye);

    // Radiant Floating Halo
    const haloGeo = new THREE.TorusGeometry(0.55, 0.06, 5, 16);
    const halo = new THREE.Mesh(haloGeo, glowHaloMat);
    halo.rotation.x = Math.PI / 2;
    halo.position.y = 0.62;
    headGroup.add(halo);

    // Majestic Low-Poly Wings
    const leftWing = new THREE.Group();
    leftWing.position.set(-0.35, 1.4, -0.2);
    root.add(leftWing);

    // Layered feather panels
    for (let f = 0; f < 4; f++) {
      const featherGeo = new THREE.ConeGeometry(0.25 - f * 0.04, 1.2 - f * 0.15, 4);
      const feather = new THREE.Mesh(featherGeo, f % 2 === 0 ? angelWhite : angelGold);
      feather.position.set(-0.35 - f * 0.28, 0.45 - f * 0.15, 0);
      feather.rotation.z = Math.PI / 2.8 + f * 0.22;
      feather.rotation.y = -0.15;
      feather.castShadow = true;
      leftWing.add(feather);
    }

    const rightWing = new THREE.Group();
    rightWing.position.set(0.35, 1.4, -0.2);
    root.add(rightWing);

    for (let f = 0; f < 4; f++) {
      const featherGeo = new THREE.ConeGeometry(0.25 - f * 0.04, 1.2 - f * 0.15, 4);
      const feather = new THREE.Mesh(featherGeo, f % 2 === 0 ? angelWhite : angelGold);
      feather.position.set(0.35 + f * 0.28, 0.45 - f * 0.15, 0);
      feather.rotation.z = -Math.PI / 2.8 - f * 0.22;
      feather.rotation.y = 0.15;
      feather.castShadow = true;
      rightWing.add(feather);
    }

    // Celestial Judgment Staff in Hand
    const staffGroup = new THREE.Group();
    staffGroup.position.set(0.65, 1.2, 0.3);
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.2, 6), angelGold);
    shaft.position.y = 0;
    staffGroup.add(shaft);

    const prism = new THREE.Mesh(new THREE.OctahedronGeometry(0.22, 0), glowHaloMat);
    prism.position.y = 1.15;
    staffGroup.add(prism);
    root.add(staffGroup);

    return {
      root,
      robe,
      head: headGroup,
      halo,
      leftWing,
      rightWing,
      staff: staffGroup
    };
  }

  // ==========================================
  // CELESTAI - THE JUDGE ON CELESTIAL PEDESTAL
  // ==========================================
  createJudge() {
    const root = new THREE.Group();
    root.name = "JudgeRoot";

    // Dedicated low-poly materials for the Judge
    const obsidianMat = new THREE.MeshStandardMaterial({
      color: 0x181a24,
      roughness: 0.65,
      metalness: 0.35,
      flatShading: true
    });
    const marbleMat = new THREE.MeshStandardMaterial({
      color: 0xf6efe2,
      roughness: 0.75,
      metalness: 0.1,
      flatShading: true
    });
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xffd24d,
      roughness: 0.3,
      metalness: 0.85,
      flatShading: true
    });
    const glowGoldMat = new THREE.MeshBasicMaterial({
      color: 0xffea78,
      transparent: true,
      opacity: 0.95
    });
    const skinMat = this.sharedMaterials.skin2;

    // 1. FLOATING CELESTIAL PEDESTAL
    const pedestalGroup = new THREE.Group();
    pedestalGroup.name = "CelestialPedestal";
    pedestalGroup.position.y = -0.12;
    root.add(pedestalGroup);

    // Main octagonal stepped stone dais
    const daisBase = new THREE.Mesh(new THREE.CylinderGeometry(1.65, 1.9, 0.45, 8), obsidianMat);
    daisBase.position.y = 0.22;
    daisBase.receiveShadow = true;
    pedestalGroup.add(daisBase);

    // Marble upper tier with beveled edge
    const daisUpper = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.55, 0.22, 8), marbleMat);
    daisUpper.position.y = 0.52;
    daisUpper.receiveShadow = true;
    pedestalGroup.add(daisUpper);

    // Gold inlaid rim
    const goldRing = new THREE.Mesh(new THREE.CylinderGeometry(1.44, 1.44, 0.06, 8), goldMat);
    goldRing.position.y = 0.62;
    pedestalGroup.add(goldRing);

    // Glowing celestial symbols / rune ring on surface
    const runeRing = new THREE.Mesh(new THREE.RingGeometry(0.85, 1.25, 8), glowGoldMat);
    runeRing.rotation.x = -Math.PI / 2;
    runeRing.position.y = 0.64;
    pedestalGroup.add(runeRing);

    // Inner rune circle star
    const starRune = new THREE.Mesh(new THREE.RingGeometry(0.2, 0.55, 6), goldMat);
    starRune.rotation.x = -Math.PI / 2;
    starRune.position.y = 0.642;
    pedestalGroup.add(starRune);

    // Orbiting floating low-poly debris rocks
    const debrisGroup = new THREE.Group();
    const debrisRocks = [];
    const debrisConfigs = [
      { x: -1.35, y: -0.05, z: 0.8, s: 0.16 },
      { x: 1.45, y: 0.08, z: 0.65, s: 0.18 },
      { x: -0.85, y: -0.18, z: -1.2, s: 0.14 },
      { x: 1.15, y: -0.12, z: -1.05, s: 0.15 },
      { x: 0, y: -0.25, z: 1.55, s: 0.13 }
    ];
    debrisConfigs.forEach((cfg, idx) => {
      const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(cfg.s, 0), obsidianMat);
      rock.position.set(cfg.x, cfg.y, cfg.z);
      rock.rotation.set(idx * 0.8, idx * 0.5, idx * 0.3);
      rock.castShadow = true;
      debrisGroup.add(rock);
      debrisRocks.push({ mesh: rock, baseY: cfg.y, speed: 1.4 + idx * 0.3 });
    });
    pedestalGroup.add(debrisGroup);

    // 2. THE JUDGE CHARACTER (Authoritative, calm, facing player)
    const hips = new THREE.Group();
    hips.position.y = 0.65; // Anchored directly on pedestal surface
    root.add(hips);

    // Flowing ceremonial Robe Base
    const robeBase = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.58, 1.2, 8), obsidianMat);
    robeBase.position.y = 0.6;
    robeBase.castShadow = true;
    hips.add(robeBase);

    // Ivory marble front fold on robe
    const robeFold = new THREE.Mesh(new THREE.BoxGeometry(0.24, 1.16, 0.14), marbleMat);
    robeFold.position.set(0, 0.6, 0.3);
    robeFold.castShadow = true;
    hips.add(robeFold);

    // Torso Group
    const torso = new THREE.Group();
    torso.position.y = 1.18;
    hips.add(torso);

    const torsoMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.38, 0.85, 6), obsidianMat);
    torsoMesh.position.y = 0.38;
    torsoMesh.castShadow = true;
    torso.add(torsoMesh);

    // Broad Ceremonial Gold Mantle over shoulders
    const mantle = new THREE.Mesh(new THREE.BoxGeometry(0.98, 0.22, 0.58), goldMat);
    mantle.position.set(0, 0.74, 0);
    mantle.castShadow = true;
    torso.add(mantle);

    // Gold ceremonial sash around waist
    const sash = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.16, 6), goldMat);
    sash.position.y = 0.06;
    torso.add(sash);

    // Head Group
    const headGroup = new THREE.Group();
    headGroup.position.y = 1.2;
    torso.add(headGroup);

    // Low-poly Head Mesh
    const headGeo = new THREE.BoxGeometry(0.72, 0.76, 0.72);
    const headMesh = new THREE.Mesh(headGeo, skinMat);
    headMesh.castShadow = true;
    headGroup.add(headMesh);

    // Defined authoritative eyebrows
    const browGeo = new THREE.BoxGeometry(0.2, 0.06, 0.06);
    const leftBrow = new THREE.Mesh(browGeo, this.sharedMaterials.black);
    leftBrow.position.set(-0.17, 0.2, 0.38);
    headGroup.add(leftBrow);

    const rightBrow = new THREE.Mesh(browGeo, this.sharedMaterials.black);
    rightBrow.position.set(0.17, 0.2, 0.38);
    headGroup.add(rightBrow);

    // Serene glowing celestial eyes
    // Eyes: white sclera + dark pupil so the face reads clearly on skin
    const eyeGeo = new THREE.BoxGeometry(0.16, 0.14, 0.06);
    const pupilGeo = new THREE.BoxGeometry(0.08, 0.1, 0.04);
    [-0.17, 0.17].forEach((x) => {
      const eye = new THREE.Mesh(eyeGeo, this.sharedMaterials.white || new THREE.MeshStandardMaterial({ color: 0xffffff, flatShading: true }));
      eye.position.set(x, 0.06, 0.37);
      headGroup.add(eye);
      const pupil = new THREE.Mesh(pupilGeo, this.sharedMaterials.black);
      pupil.position.set(x, 0.05, 0.4);
      headGroup.add(pupil);
    });

    // Calm authoritative mouth
    const mouth = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.05, 0.04), this.sharedMaterials.crimson);
    mouth.position.set(0, -0.19, 0.37);
    headGroup.add(mouth);

    // Judge's Hood / Headdress
    const cowl = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.22, 0.82), obsidianMat);
    cowl.position.set(0, 0.47, -0.02);
    headGroup.add(cowl);

    // Floating Celestial Halo
    const halo = new THREE.Mesh(new THREE.TorusGeometry(0.56, 0.05, 5, 18), glowGoldMat);
    halo.rotation.x = Math.PI / 2;
    halo.position.set(0, 0.68, 0);
    headGroup.add(halo);

    // Left Arm (Confidently resting on hip/sash)
    const leftArm = new THREE.Group();
    leftArm.position.set(-0.52, 0.68, 0);
    const lArmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.1, 0.65, 5), obsidianMat);
    lArmMesh.position.set(0, -0.28, 0);
    lArmMesh.rotation.z = -0.32;
    leftArm.add(lArmMesh);
    const lHand = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.16, 0.16), skinMat);
    lHand.position.set(0.16, -0.58, 0.1);
    leftArm.add(lHand);
    torso.add(leftArm);

    // Right Arm (Extended slightly holding miniature Scales of Justice)
    const rightArm = new THREE.Group();
    rightArm.position.set(0.52, 0.68, 0);
    const rArmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.1, 0.65, 5), obsidianMat);
    rArmMesh.position.set(0, -0.25, 0.12);
    rArmMesh.rotation.x = 0.42;
    rArmMesh.rotation.z = 0.15;
    rightArm.add(rArmMesh);
    const rHand = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.16, 0.16), skinMat);
    rHand.position.set(0, -0.5, 0.35);
    rightArm.add(rHand);

    // Miniature Divine Scales of Justice in hand
    const miniScales = new THREE.Group();
    miniScales.position.set(0, -0.5, 0.42);

    const sPost = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.45, 5), goldMat);
    sPost.position.y = 0.16;
    miniScales.add(sPost);

    const sBeam = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.03, 0.03), goldMat);
    sBeam.position.y = 0.36;
    miniScales.add(sBeam);

    const lPan = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.02, 0.04, 6), goldMat);
    lPan.position.set(-0.2, 0.22, 0);
    miniScales.add(lPan);

    const rPan = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.02, 0.04, 6), obsidianMat);
    rPan.position.set(0.2, 0.22, 0);
    miniScales.add(rPan);

    rightArm.add(miniScales);
    torso.add(rightArm);

    return {
      root,
      pedestal: pedestalGroup,
      debris: debrisRocks,
      runeRing,
      starRune,
      hips,
      torso,
      head: headGroup,
      halo,
      leftArm,
      rightArm,
      miniScales,
      sBeam
    };
  }
}

window.characterFactory = new CharacterFactory();
