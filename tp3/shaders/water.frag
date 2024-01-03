#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform sampler2D uSampler2;
uniform float timeFactor;

void main() {

    vec4 filter_ = texture2D(uSampler2,vTextureCoord+vec2(timeFactor*.01,timeFactor*.01));
    vec4 color = texture2D(uSampler, vTextureCoord+vec2(timeFactor*.01,timeFactor*.01));

    gl_FragColor = vec4(color.xyz - 0.15*filter_.xyz, 1.0);
}
