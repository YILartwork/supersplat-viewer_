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
      // Gaussian Splat 크기 처리 (간단 버전)
      gl_Position = vec4(aPosition, 1.0);
      gl_PointSize = 8.0; // 임시값, 실제는 covariance 기반
    }
  `,

  fshader: `
    precision mediump float;
    varying vec3 vColor;

    void main(void) {
      // 간단한 원형 점 스플랫
      vec2 coord = gl_PointCoord - vec2(0.5);
      if (length(coord) > 0.5) discard;

      gl_FragColor = vec4(vColor, 1.0);
    }
  `
};
