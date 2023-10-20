precision mediump float;

uniform float u_time;
uniform vec2 u_resolution;
uniform sampler2D u_texture;
uniform float u_texture_width;
uniform float u_texture_height;

varying vec2 v_uv;

// pseudo-random generator
vec2 rand(vec2 co) {
  return fract(
    sin(vec2(dot(co, vec2(12.9898, 78.233)), dot(co, vec2(63.4245, 43.1331)))) *
      43758.5453
  );
}

// 2D Perlin Noise function approximation
float noise(vec2 pos) {
  vec2 i = floor(pos);
  vec2 f = fract(pos);

  vec2 u = f * f * (3.0 - 2.0 * f);

  return mix(
    mix(
      dot(rand(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
      dot(rand(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)),
      u.x
    ),
    mix(
      dot(rand(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
      dot(rand(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)),
      u.x
    ),
    u.y
  );
}

float voronoi(vec2 uv) {
  vec2 p = floor(uv);
  vec2 f = fract(uv);

  float res = 8.0;
  for (float j = -1.0; j <= 1.0; j++) {
    for (float i = -1.0; i <= 1.0; i++) {
      vec2 b = vec2(i, j);
      vec2 r = vec2(b) - f + rand(p + b);
      float d = dot(r, r);

      res = min(res, d);
    }
  }

  return sqrt(res);
}

void main() {
  float c = cos(0.0);
  float s = sin(0.0);
  vec2 center = vec2(0.5, 0.9);
  vec2 uv = v_uv;

  // image contains a 1:1 aspect ratio
  uv -= center;
  uv = vec2(uv.x * c - uv.y * s, uv.x * s + uv.y * c);
  uv += center;

  // add noise
  float n = noise(uv * 10.0 - vec2(u_time * 0.1, -u_time * 0.3)) * 0.1;

  uv.x += n * 1.2;
  uv.y += n * 0.5;

  // add voronoi
  float v = voronoi(uv * 10.0 + vec2(u_time * 0.6, 0.0)) * 0.1;
  uv.x += v * 1.2;
  uv.y += v * 100.5;

  vec4 texture = texture2D(u_texture, uv);

  gl_FragColor = vec4(texture.rgb, 1.0);
}
