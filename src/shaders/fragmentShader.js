export const fragmentShader = `
  // Fragement Shader setzt die Farbe für jeden Pixel

  varying float vDistort;
  varying vec2 vUv;
  varying float vMousePos;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  // uniform vec2 u_hover; 
  float PI = 3.14159265359;

  vec3 cosPalette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
      return a + b * cos(6.28318 * (c * t + d));
  } 
    
  float quarticInOut(float t) {
    return t < 0.5
      ? +8.0 * pow(t, 4.0)
      : -8.0 * pow(t - 1.0, 4.0) + 1.0;
  }

  float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
  }

  void main()	{
    float intensity = 6.0;
    float distort = vDistort * intensity;

    vec2 position = gl_FragCoord.xy / u_resolution.xy;

    vec3 brightness = vec3(0.7, 0.7, 0.7);
    vec3 contrast = vec3(0.5);
    vec3 oscilation = vec3(0.008);
    vec3 phase = vec3(0.2);
    float mouse = map(vMousePos * 5.0, -3.0, 1.0, 0.0, 1.0 );

    float randGlow = (sin(2. * PI + u_time / 1.8) + 10.0) * 0.02;

    float glow = quarticInOut(clamp(mouse, 0.1, 0.2) + randGlow);

    vec3 color = cosPalette(distort, brightness, contrast, oscilation, phase) * glow;

    gl_FragColor = vec4(color, 1.0);
  }
`