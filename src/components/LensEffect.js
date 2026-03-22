// LensEffect: WebGL lens overlay following cursor.
// Usage: import { LensEffect } from './lens-effect.js';

export class LensEffect {
  constructor(options = {}) {
    this.container = this._resolveElement(options.container) || document.body;
    this.textureSource = options.texture || null;
    this.radiusPx = options.radiusPx || 120;
    this.edgeSoftPx = options.edgeSoftPx || 24;
    this.distortionPx = options.distortionPx || 16;
    this.aberrationPx = options.aberrationPx || 2.5;
    this.opacity = options.opacity != null ? options.opacity : 0.85;
    this.follow = options.follow != null ? options.follow : 0.18;
    this.zIndex = options.zIndex != null ? options.zIndex : 5;
    this.position = options.position || (this.container === document.body ? 'fixed' : 'absolute');

    this._pointer = { x: 0.5, y: 0.5 };
    this._current = { x: 0.5, y: 0.5 };
    this._size = { w: 1, h: 1, dpr: 1 };
    this._running = false;

    this._initCanvas();
    this._initGL();
    this._bindEvents();

    if (this.textureSource) {
      this.setTexture(this.textureSource);
    }

    this.start();
  }

  _resolveElement(elOrSelector) {
    if (!elOrSelector) return null;
    if (typeof elOrSelector === 'string') return document.querySelector(elOrSelector);
    return elOrSelector;
  }

  _initCanvas() {
    const canvas = document.createElement('canvas');
    canvas.style.position = this.position;
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = String(this.zIndex);
    canvas.style.mixBlendMode = 'normal';
    this.canvas = canvas;

    if (this.container === document.body) {
      document.body.appendChild(canvas);
    } else {
      const computed = window.getComputedStyle(this.container);
      if (computed.position === 'static') {
        this.container.style.position = 'relative';
      }
      this.container.appendChild(canvas);
    }

    this._resize();
  }

  _initGL() {
    const gl = this.canvas.getContext('webgl', { premultipliedAlpha: false, alpha: true });
    if (!gl) throw new Error('WebGL not supported');
    this.gl = gl;

    const vsSource = `
      attribute vec2 a_pos;
      varying vec2 v_uv;
      void main() {
        v_uv = a_pos * 0.5 + 0.5;
        gl_Position = vec4(a_pos, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision highp float;
      varying vec2 v_uv;
      uniform sampler2D u_tex;
      uniform vec2 u_mouse;
      uniform vec2 u_resolution;
      uniform float u_radius;
      uniform float u_soft;
      uniform float u_distortion;
      uniform float u_aberration;
      uniform float u_opacity;

      void main() {
        vec2 uv = v_uv;
        vec2 m = u_mouse;
        float d = distance(uv, m);
        float mask = smoothstep(u_radius, u_radius - u_soft, d);

        vec2 dir = normalize(uv - m + 1e-6);
        float falloff = clamp(1.0 - d / u_radius, 0.0, 1.0);
        vec2 warp = uv + dir * u_distortion * falloff * mask;

        // Chromatic aberration along the radial direction
        vec2 ca = dir * u_aberration * falloff * mask;
        vec3 col;
        col.r = texture2D(u_tex, warp + ca).r;
        col.g = texture2D(u_tex, warp).g;
        col.b = texture2D(u_tex, warp - ca).b;

        // Subtle edge highlight
        float ring = smoothstep(u_radius, u_radius - u_soft * 0.6, d) -
                     smoothstep(u_radius - u_soft * 0.6, u_radius - u_soft * 1.2, d);
        col += ring * 0.08;

        gl_FragColor = vec4(col, mask * u_opacity);
      }
    `;

    const program = this._createProgram(vsSource, fsSource);
    gl.useProgram(program);
    this.program = program;

    const quad = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW);

    const aPos = gl.getAttribLocation(program, 'a_pos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    this.uniforms = {
      u_tex: gl.getUniformLocation(program, 'u_tex'),
      u_mouse: gl.getUniformLocation(program, 'u_mouse'),
      u_resolution: gl.getUniformLocation(program, 'u_resolution'),
      u_radius: gl.getUniformLocation(program, 'u_radius'),
      u_soft: gl.getUniformLocation(program, 'u_soft'),
      u_distortion: gl.getUniformLocation(program, 'u_distortion'),
      u_aberration: gl.getUniformLocation(program, 'u_aberration'),
      u_opacity: gl.getUniformLocation(program, 'u_opacity'),
    };

    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  }

  _createProgram(vsSource, fsSource) {
    const gl = this.gl;
    const vs = this._compile(gl.VERTEX_SHADER, vsSource);
    const fs = this._compile(gl.FRAGMENT_SHADER, fsSource);
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const info = gl.getProgramInfoLog(program);
      throw new Error('Program link failed: ' + info);
    }
    return program;
  }

  _compile(type, source) {
    const gl = this.gl;
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const info = gl.getShaderInfoLog(shader);
      throw new Error('Shader compile failed: ' + info);
    }
    return shader;
  }

  _bindEvents() {
    this._onMove = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height;
      this._pointer.x = Math.min(Math.max(x, 0), 1);
      this._pointer.y = Math.min(Math.max(y, 0), 1);
    };

    this._onResize = () => this._resize();

    window.addEventListener('pointermove', this._onMove, { passive: true });
    window.addEventListener('resize', this._onResize);
  }

  _resize() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this._size.w = Math.max(1, Math.floor(rect.width * dpr));
    this._size.h = Math.max(1, Math.floor(rect.height * dpr));
    this._size.dpr = dpr;
    this.canvas.width = this._size.w;
    this.canvas.height = this._size.h;
    if (this.gl) this.gl.viewport(0, 0, this._size.w, this._size.h);
  }

  setTexture(source) {
    return new Promise((resolve, reject) => {
      if (source instanceof HTMLImageElement) {
        this._applyTexture(source);
        resolve();
        return;
      }

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        this._applyTexture(img);
        resolve();
      };
      img.onerror = () => reject(new Error('Failed to load texture'));
      img.src = source;
    });
  }

  _applyTexture(img) {
    const gl = this.gl;
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    this.texture = tex;
  }

  start() {
    if (this._running) return;
    this._running = true;
    const tick = () => {
      if (!this._running) return;
      this._render();
      this._raf = requestAnimationFrame(tick);
    };
    this._raf = requestAnimationFrame(tick);
  }

  stop() {
    this._running = false;
    if (this._raf) cancelAnimationFrame(this._raf);
  }

  destroy() {
    this.stop();
    window.removeEventListener('pointermove', this._onMove);
    window.removeEventListener('resize', this._onResize);
    if (this.canvas && this.canvas.parentNode) this.canvas.parentNode.removeChild(this.canvas);
  }

  _render() {
    const gl = this.gl;
    if (!gl || !this.texture) return;

    // Smooth follow
    this._current.x += (this._pointer.x - this._current.x) * this.follow;
    this._current.y += (this._pointer.y - this._current.y) * this.follow;

    gl.useProgram(this.program);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.uniform1i(this.uniforms.u_tex, 0);

    gl.uniform2f(this.uniforms.u_mouse, this._current.x, this._current.y);
    gl.uniform2f(this.uniforms.u_resolution, this._size.w, this._size.h);

    const minSide = Math.min(this._size.w, this._size.h);
    const radiusUv = (this.radiusPx * this._size.dpr) / minSide;
    const softUv = (this.edgeSoftPx * this._size.dpr) / minSide;
    const distortionUv = (this.distortionPx * this._size.dpr) / minSide;
    const aberrationUv = (this.aberrationPx * this._size.dpr) / minSide;

    gl.uniform1f(this.uniforms.u_radius, radiusUv);
    gl.uniform1f(this.uniforms.u_soft, softUv);
    gl.uniform1f(this.uniforms.u_distortion, distortionUv);
    gl.uniform1f(this.uniforms.u_aberration, aberrationUv);
    gl.uniform1f(this.uniforms.u_opacity, this.opacity);

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
}
