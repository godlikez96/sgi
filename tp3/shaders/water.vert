attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

uniform float normScale;


varying vec2 vTextureCoord;

uniform sampler2D uSampler2;


uniform float timeFactor;



void main() {
    vTextureCoord = aTextureCoord;
    float height =  texture2D(uSampler2,vTextureCoord+vec2(timeFactor*.01,timeFactor*.01)).b;

    vec3 offset = 0.005*normScale*0.6*vec3(0.0, 0.0, height);


    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition + offset, 1.0);

}

