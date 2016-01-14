import gl from '../webgl'
import buffer from '../buffer'
import shaderProgram from '../shaders'
import texture from '../texture'
import {degToRad, stack} from '../util'
import map from '../world/world'
const mat4 = require('./../../../node_modules/gl-matrix/src/gl-matrix.js').mat4

let neheTextures
let texIndex = 0
let index = 0
let skippedFrames = Number.MAX_SAFE_INTEGER - 5

texture(['BODY_male.png'], {size : 64}).then( textures => { neheTextures = textures })

export default function draw (mvMatrix, pMatrix, pressedKeys) {
    stack.push(mvMatrix)

    mat4.translate(mvMatrix, mvMatrix, [0.0, 0.0, -18.5])

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer.plane.vertexPositionBuffer)
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, buffer.plane.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0)

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer.plane.vertexTextureCoordBuffer)
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, buffer.plane.vertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0)

    gl.activeTexture(gl.TEXTURE0)
    if (neheTextures) {
        if (pressedKeys.asIndex >= 0 && ++skippedFrames >= 4) {
            skippedFrames = 0
            texIndex = (texIndex + 1) % 9
            index = texIndex + (pressedKeys.asIndex * 9)
        }

        gl.bindTexture(gl.TEXTURE_2D, neheTextures[0][index])
    }

    gl.uniform1i(shaderProgram.samplerUniform, 0)

    gl.setMatrixUniforms(mvMatrix, pMatrix)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, buffer.plane.vertexPositionBuffer.numItems)

    stack.pop(mvMatrix)
}