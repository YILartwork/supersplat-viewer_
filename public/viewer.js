async function initViewer(splatFile) {
  const response = await fetch(splatFile);
  const arrayBuffer = await response.arrayBuffer();
  const parsed = parseSplat(arrayBuffer);

  // ✔️ PlayCanvas 앱 초기화
  const app = new pc.Application(canvas, {});

  // ✔️ VertexBuffer 등으로 데이터 올리기
  const vertexBuffer = ... // parsed 데이터로 생성

  // ✔️ Material 생성
  const material = new pc.ShaderMaterial();
  material.shader = app.graphicsDevice.createShaderFromDefinition(shaderDefinition);

  // ✔️ MeshInstance 만들기
  const meshInstance = new pc.MeshInstance(mesh, material);

  // ✔️ 엔티티로 등록
  // ...

  // ✔️ 씬에 추가
  app.root.addChild(...);
  app.start();
}
