async function initViewer(splatFile) {
  console.log('Trying to load:', splatFile);

  const response = await fetch(splatFile);
  if (!response.ok) throw new Error("404 Not Found!");

  const arrayBuffer = await response.arrayBuffer();
  const parsed = parseSplat(arrayBuffer);

  setupWebGL(parsed);
}

// (1) 포맷 파서 예시
function parseSplat(arrayBuffer) {
  const FLOAT_SIZE = 4;
  const FLOATS_PER_SPLAT = 12; // 예: pos(3)+color(3)+covariance(6)
  const count = arrayBuffer.byteLength / (FLOAT_SIZE * FLOATS_PER_SPLAT);

  const view = new DataView(arrayBuffer);
  const positions = [];
  const colors = [];
  const covs = [];

  for (let i = 0; i < count; i++) {
    const base = i * FLOATS_PER_SPLAT * FLOAT_SIZE;
    positions.push([
      view.getFloat32(base + 0, true),
      view.getFloat32(base + 4, true),
      view.getFloat32(base + 8, true),
    ]);
    colors.push([
      view.getFloat32(base + 12, true),
      view.getFloat32(base + 16, true),
      view.getFloat32(base + 20, true),
    ]);
    covs.push([
      view.getFloat32(base + 24, true),
      view.getFloat32(base + 28, true),
      view.getFloat32(base + 32, true),
      view.getFloat32(base + 36, true),
      view.getFloat32(base + 40, true),
      view.getFloat32(base + 44, true),
    ]);
  }

  return { positions, colors, covs };
}

// (2) GPU 업로드 + Shader 연결 예시
function setupWebGL(parsed) {
  const canvas = document.getElementById('canvas');

  // PlayCanvas 예시 시작
  const app = new pc.Application(canvas, {
    mouse: new pc.Mouse(canvas),
    touch: new pc.TouchDevice(canvas),
  });
  app.start();

  app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
  app.setCanvasResolution(pc.RESOLUTION_AUTO);
  window.addEventListener('resize', () => app.resizeCanvas());

  app.scene.ambientLight = new pc.Color(0.2, 0.2, 0.2);

  const camera = new pc.Entity('camera');
  camera.addComponent('camera', { clearColor: new pc.Color(0.1, 0.1, 0.1) });
  camera.setPosition(0, 0, 5);
  app.root.addChild(camera);

  const light = new pc.Entity('light');
  light.addComponent('light');
  light.setEulerAngles(45, 0, 0);
  app.root.addChild(light);

  // 👉 여기서 vertexBuffer / MeshInstance 생성
  // 👉 그리고 Gaussian Splat custom shader 연결
  console.log("✔️ Positions:", parsed.positions.length, "points");
  console.log("✅ GPU로 올려서 렌더링 시작하세요!");
}
