export default function build({ THREE, scene, root, cam }) {
  scene.add(new THREE.HemisphereLight(0xfff3df, 0x5ec8f2, 1.2));
  const key = new THREE.DirectionalLight(0xfff0d0, 2.4); key.position.set(5, 8, 6); scene.add(key);
  const std = (c, r = .8) => new THREE.MeshStandardMaterial({ color: c, roughness: r, flatShading: true });
  // sea
  const sea = new THREE.Mesh(new THREE.CircleGeometry(9, 64, 0, 6.283).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0x35b6e6, roughness: .35, metalness: .1, flatShading: true }));
  const sg = new THREE.PlaneGeometry(22, 22, 44, 44).rotateX(-Math.PI / 2); const sp = sg.attributes.position; const base = sp.array.slice();
  const sea2 = new THREE.Mesh(sg, new THREE.MeshStandardMaterial({ color: 0x3bb9e8, roughness: .3, flatShading: true, transparent: true, opacity: .96 })); sea2.position.y = -.5; root.add(sea2);
  // island
  const isl = new THREE.Group(); root.add(isl);
  const sand = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 4.2, .7, 40), std(0xf2d9a4, 1)); sand.position.y = -.2; isl.add(sand);
  const grass = new THREE.Mesh(new THREE.CylinderGeometry(2.7, 3.1, .35, 40), std(0x8bd13f, 1)); grass.position.y = .3; isl.add(grass);
  // house (walls repaint)
  const wallMat = new THREE.MeshStandardMaterial({ color: 0xf4efe6, roughness: .7 });
  const house = new THREE.Group(); house.position.set(-.5, .5, -.2); isl.add(house);
  const walls = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.1, 1.4), wallMat); walls.position.y = .55; house.add(walls);
  const roof = new THREE.Mesh(new THREE.ConeGeometry(1.5, .8, 4), std(0x123a5c)); roof.rotation.y = Math.PI / 4; roof.position.y = 1.5; roof.scale.set(1.12, 1, .92); house.add(roof);
  const door = new THREE.Mesh(new THREE.BoxGeometry(.3, .55, .05), std(0xff6f59)); door.position.set(0, .3, .71); house.add(door);
  [-.55, .55].forEach(x => { const w = new THREE.Mesh(new THREE.BoxGeometry(.32, .32, .05), std(0x9fe0ff)); w.position.set(x, .65, .71); house.add(w); });
  // roller
  const roller = new THREE.Group(); const rl = new THREE.Mesh(new THREE.CylinderGeometry(.14, .14, .5, 16), std(0xff6f59)); rl.rotation.z = Math.PI / 2; roller.add(rl);
  const rh = new THREE.Mesh(new THREE.CylinderGeometry(.025, .025, .9), std(0x444444)); rh.position.set(0, -.45, 0); rh.rotation.z = .2; roller.add(rh); roller.position.set(0, .6, .95); house.add(roller);
  // palm
  const palm = new THREE.Group(); palm.position.set(1.5, .45, .3); isl.add(palm);
  const trunkPts = []; for (let i = 0; i <= 8; i++) trunkPts.push(new THREE.Vector3(Math.sin(i * .2) * .25, i * .28, 0));
  const trunk = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(trunkPts), 16, .09, 8), std(0x9a6b3f)); palm.add(trunk);
  const leaves = new THREE.Group(); leaves.position.copy(trunkPts[8]); palm.add(leaves);
  for (let i = 0; i < 7; i++) { const l = new THREE.Mesh(new THREE.ConeGeometry(.2, 1.3, 4), std(0x39b36a)); l.geometry.translate(0, .65, 0); l.rotation.set(1.1, i * .9, 0, 'YXZ'); l.scale.z = .3; leaves.add(l); }
  // lawn stripes + fence
  for (let i = 0; i < 4; i++) { const s = new THREE.Mesh(new THREE.BoxGeometry(1.4, .02, .35), std(i % 2 ? 0xa4e056 : 0x7cc236)); s.position.set(-.1 + (i % 2) * .15, .5, 1.45 + i * .01); }
  // boat
  const boat = new THREE.Group(); root.add(boat);
  const hull = new THREE.Mesh(new THREE.BoxGeometry(1.2, .25, .45), std(0x123a5c)); hull.position.y = .05; boat.add(hull);
  const bow = new THREE.Mesh(new THREE.ConeGeometry(.23, .5, 4), std(0x123a5c)); bow.rotation.z = -Math.PI / 2; bow.rotation.y = Math.PI / 4; bow.position.set(.8, .05, 0); boat.add(bow);
  const mast = new THREE.Mesh(new THREE.CylinderGeometry(.02, .02, 1.5), std(0xffffff)); mast.position.y = .8; boat.add(mast);
  const sail = new THREE.Mesh(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 1.5, 0), new THREE.Vector3(0, .25, 0), new THREE.Vector3(-.8, .25, 0)]), new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide })); sail.geometry.computeVertexNormals(); boat.add(sail);
  const flag = new THREE.Mesh(new THREE.ConeGeometry(.1, .3, 3), std(0xff6f59)); flag.rotation.z = Math.PI / 2; flag.position.set(.12, 1.5, 0); boat.add(flag);
  // sun
  const sun = new THREE.Mesh(new THREE.SphereGeometry(.7, 24, 24), new THREE.MeshBasicMaterial({ color: 0xff8a6b })); sun.position.set(-4, 4.2, -6); scene.add(sun);
  const dirty = new THREE.Color(0xf4efe6), coral = new THREE.Color(0xff8e7a);
  return {
    update({ t, p, px, py, rot, RM }) {
      cam.position.set(px * .9, 5.2 - py * .6 + (1 - p) * .6, 14); cam.lookAt(0, .7, 0);
      root.rotation.y = rot * .5; isl.rotation.y = Math.sin(p * 3) * .1;
      wallMat.color.copy(dirty).lerp(coral, Math.min(1, p * 1.25));
      roller.position.y = .35 + Math.sin(p * 18) * .3 * (p > .02 && p < .85 ? 1 : 0) + .1; roller.rotation.x = p * 14;
      leaves.rotation.y = Math.sin(t * .8) * .08 + px * .1; leaves.children.forEach((l, i) => l.rotation.x = 1.1 + Math.sin(t * 1.4 + i) * .06);
      const a = t * .35 + p * 3; boat.position.set(Math.cos(a) * 5.4, -.35 + Math.sin(t * 2) * .05, Math.sin(a) * 3.8); boat.rotation.y = -a + Math.PI; boat.rotation.z = Math.sin(t * 1.7) * .05;
      sun.position.x = -4 + px * 1.2; sun.position.y = 4.2 - py * .6;
      for (let i = 0; i < sp.count; i++) { const x = base[i * 3], z = base[i * 3 + 2]; sp.setY(i, Math.sin(x * .7 + t * 1.5) * .12 + Math.cos(z * .6 + t * 1.1) * .1); }
      sp.needsUpdate = true; sg.computeVertexNormals();
    }
  };
}
