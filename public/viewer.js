async function initViewer(splatFile) {
  console.log('Trying to load:', splatFile);

  const response = await fetch(splatFile);
  if (!response.ok) throw new Error("404 Not Found!");

  const arrayBuffer = await response.arrayBuffer();
  console.log("✅ Loaded splat file buffer:", arrayBuffer);

  // ------------------------------
  // Example: Load into PlayCanvas or Custom WebGL
  // ------------------------------

  const canvas = document.getElementById('canvas');

  // 👉 예시로 PlayCanvas App 생성
  const app = new pc.Application(canvas, {
    mouse: new pc.Mouse(canvas),
    touch: new pc.TouchDevice(canvas),
  });
  app.start();

  // Set canvas fill
  app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
  app.setCanvasResolution(pc.RESOLUTION_AUTO);

  window.addEventListener('resize', () => app.resizeCanvas());

  // 기본 씬 설정
  app.scene.ambientLight = new pc.Color(0.2, 0.2, 0.2);

  // 카메라
  const cameraEntity = new pc.Entity('camera');
  cameraEntity.addComponent('camera', {
    clearColor: new pc.Color(0.1, 0.1, 0.1),
  });
  cameraEntity.setPosition(0, 0, 5);
  app.root.addChild(cameraEntity);

  // 빛
  const light = new pc.Entity('light');
  light.addComponent('light');
  light.setEulerAngles(45, 0, 0);
  app.root.addChild(light);

  // 👉 여기에 Supersplat 데이터 로더 연결 (예시)
  // 실제로는 arrayBuffer → vertex buffer → custom shader로 넘겨야 함.
  // 여기서는 그냥 placeholder:
  console.log("🔗 여기에 Gaussian Splatting 데이터 파싱 & 렌더 연결");

  // 예: points → point cloud 렌더링
  // (실제 로더는 splat 데이터 포맷에 맞게 파싱 후 GPU buffer로 올림)
}

