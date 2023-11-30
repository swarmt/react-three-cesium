export const slopeShader = {
  vertexShader: `
varying vec3 vWorldNormal;
varying float slope;

void main() {
    // Transform the normal to world space
    vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);

    // Calculate the slope as the angle between the world normal and the world up vector (0, 1, 0)
    float angle = degrees(acos(dot(vWorldNormal, vec3(0.0, 1.0, 0.0))));
    
    // Determine if the slope is greater than 10 degrees
    slope = step(20.0, angle); 

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,
  fragmentShader: `
varying float slope;

void main() {
    if (slope > 0.0) {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // Red for slopes > 10 degrees
    } else {
        gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0); // Green for slopes <= 10 degrees
    }
}
`

}
