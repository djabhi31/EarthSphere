export const earthVertex = /* glsl */ `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
void main() {
  vUv = uv;
  vNormal = normalize(mat3(modelMatrix) * normal);
  vec4 world = modelMatrix * vec4(position, 1.0);
  vPosition = world.xyz;
  gl_Position = projectionMatrix * viewMatrix * world;
}`;

export const earthFragment = /* glsl */ `
uniform sampler2D uDay;
uniform sampler2D uNight;
uniform sampler2D uWater;
uniform vec3 uSun;
uniform float uSunlight;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
void main() {
  vec3 n = normalize(vNormal);
  vec3 eye = normalize(cameraPosition - vPosition);
  vec3 sun = normalize(uSun);
  float facing = max(dot(n, eye), 0.0);
  float incidence = dot(n, sun);
  float daylight = mix(1.0, smoothstep(-0.12, 0.14, incidence), uSunlight);
  vec3 day = texture2D(uDay, vUv).rgb;
  vec3 night = texture2D(uNight, vUv).rgb;
  float lighting = mix(0.72 + 0.36 * sqrt(facing), 0.16 + 1.1 * max(incidence, 0.0), uSunlight);
  vec3 color = mix(night * 1.5 + day * 0.008, day * lighting, daylight);
  float ocean = texture2D(uWater, vUv).r;
  vec3 keyLight = normalize(mix(eye, sun, uSunlight));
  float glint = pow(max(dot(reflect(-keyLight, n), eye), 0.0), 55.0);
  color += vec3(0.18, 0.23, 0.3) * glint * ocean * daylight;
  float limb = pow(1.0 - facing, 3.0);
  color += vec3(0.012, 0.07, 0.19) * limb * mix(1.0, smoothstep(-0.3, 0.3, incidence), uSunlight);
  gl_FragColor = vec4(color, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;
