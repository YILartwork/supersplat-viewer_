// 🔶 예시용: 실제로는 .splat 포맷 파서를 맞게 구현해야 함
function parseSplat(arrayBuffer) {
  // 여기선 간단히 더미로 XYZRGB 데이터라고 가정
  const count = 1000;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    positions[i * 3 + 0] = Math.random() * 2 - 1;
    positions[i * 3 + 1] = Math.random() * 2 - 1;
    positions[i * 3 + 2] = Math.random() * 2 - 1;

    colors[i * 3 + 0] = Math.random();
    colors[i * 3 + 1] = Math.random();
    colors[i * 3 + 2] = Math.random();
  }

  return { positions, colors, count };
}

// 🔶 Shader Definition
const shaderDefinition = {
  attributes: {
    aPosition: pc.SEMANTIC_POSITION,
    aColor: pc.SEMANTIC_COLOR
  },
  vshader: `
    attribute vec3 aPosition;
    attribute vec3 aColor;
    varying vec3 vColor;

    void main(void) {
      vColor = aColor;
      gl_Position = vec4(aPosition, 1.0);
      gl_PointSize = 8.0; // 간단한 고정 크기
    }
  `,
  fshader: `
    precision mediump float;
    varying vec3 vColor;

    void main(void) {
      vec2 coord = gl_PointCoord - vec2(0.5);
      if (length(coord) > 0.5) discard;
      gl_FragColor = vec4(vColor, 1.0);
    }
  `
};

// 🔶 메인 함수
async function initViewer(splatFile) {
  const response = await fetch(splatFile);
  const arrayBuffer = await response.arrayBuffer();
  const parsed = parseSplat(arrayBuffer);

  const canvas = document.getElementById('canvas');
  const app = new pc.Application(canvas, {});

  // ✔️ 카메라
  const camera = new pc.Entity('camera');
  camera.addComponent('camera', { clearColor: new pc.Color(0.2, 0.2, 0.2) });
  camera.setPosition(0, 0, 3);
  app.root.addChild(camera);

  // ✔️ 빛
  const light = new pc.Entity('light');
  light.addComponent('light');
  light.setEulerAngles(45, 0, 0);
  app.root.addChild(light);

  // ✔️ VertexBuffer
  const vertexFormat = new pc.VertexFormat(app.graphicsDevice, [
    { semantic: pc.SEMANTIC_POSITION, components: 3, type: pc.TYPE_FLOAT32 },
    { semantic: pc.SEMANTIC_COLOR, components: 3, type: pc.TYPE_FLOAT32 }
  ]);

  const vertexBuffer = new pc.VertexBuffer(
    app.graphicsDevice,
    vertexFormat,
    parsed.count,
    pc.BUFFER_STATIC
  );

  const vertexData = new Float32Array(vertexBuffer.lock());
  for (let i = 0; i < parsed.count; i++) {
    vertexData.set(parsed.positions.subarray(i * 3, i * 3 + 3), i * 6);
    vertexData.set(parsed.colors.subarray(i * 3, i * 3 + 3), i * 6 + 3);
  }
  vertexBuffer.unlock();

  // ✔️ Mesh
  const mesh = new pc.Mesh();
  mesh.vertexBuffer = vertexBuffer;
  mesh.primitive[0].type = pc.PRIMITIVE_POINTS;
  mesh.primitive[0].base = 0;
  mesh.primitive[0].count = parsed.count;

  // ✔️ Material
  const material = new pc.ShaderMaterial();
  material.shader = app.graphicsDevice.createShaderFromDefinition(shaderDefinition);

  // ✔️ MeshInstance
  const node = new pc.GraphNode();
  const meshInstance = new pc.MeshInstance(node, mesh, material);

  const model = new pc.Model();
  model.graph = node;
  model.meshInstances.push(meshInstance);

  const entity = new pc.Entity();
  entity.addComponent('model');
  entity.model.model = model;

  app.root.addChild(entity);
  app.start();
}
