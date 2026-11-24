import{d as e,i as t,s as n,t as r}from"./sounds.D55C91by.js";var i=.375,a=.024,o=.66,s=1.35,c=1.2,l=.9,u=.18,d=.01,f=.007,p=.16,m=e=>e<.66?Math.hypot(a,Math.sqrt(i*i-a*a)*Math.sin(Math.PI/2*(e/o))**s):i*Math.sqrt(Math.max(0,1-((e-o)/.33999999999999997)**2)),h=e=>{let t=[];for(;t.length<2e3;){let[n,r,a]=[(Math.random()*2-1)*i,Math.random()*e,(Math.random()*2-1)*i];Math.hypot(n,a)<m(Math.abs(r))&&t.push([n,r,a])}return t},g=(e,t,n)=>{let r=Math.min(1,Math.max(0,(n-e)/(t-e)));return r*r*(3-2*r)};function _(e,t){let n=[h(1),h(-1)],r=new Float32Array(2e3),i=.9,a=[0,-1,0],o=[0,0,0],s=[],_=0,v=new Float32Array([0,-1,0]),y=new Float32Array(2),b=new Float32Array(56),x=new Float32Array(56),S=new Float32Array(1),C=new Float32Array(14),w=new Float32Array([9,0,9,0]),T=new Float32Array(1),E=(e,t)=>t<=0?1e3:t>=1?-1e3:(n[e].forEach(([e,t,n],i)=>r[i]=e*v[0]+t*v[1]+n*v[2]),r.sort(),r[Math.floor((1-t)*(r.length-1))]);return{down:v,level:y,heads:b,tails:x,reach:S,stretch:C,ripple:w,churn:T,step:(n,r,h)=>{h?[a,o]=[n,[0,0,0]]:(o=o.map((e,t)=>e+(60*(n[t]-a[t])-6*e)*r),a=a.map((e,t)=>e+o[t]*r));let D=Math.hypot(...o),O=Math.hypot(...a.map((e,t)=>e-n[t]));D<.001&&O<1e-4&&([a,o]=[n,[0,0,0]]),v.set(a.map(e=>e/Math.hypot(...a))),T[0]=h?0:Math.min(1,T[0]+D*r*.6)*Math.exp(-1.6*r),T[0]<.001&&(T[0]=0);let k=n[1]<0?0:1,A=(k===0?i:1-i)>0?Math.min(1,Math.max(0,(Math.abs(n[1])-.3)/.4)):0;if(i=Math.min(1,Math.max(0,i+(k===0?-1:1)*A*r/e)),y[0]=E(0,i),y[1]=E(1,1-i),_+=r*A,!h&&A>0&&_>c&&s.length<=10){_=0;for(let e of[1,-1]){let t=e>0?1-k:k;s.push({at:[0,0,0],tail:[0,0,0],kind:e,bulb:t,size:.029+Math.random()*.006,thread:f,age:0,speed:0,landed:!1,stub:!1})}}let j=[];return s=s.filter(e=>{let i=n.map(t=>t*e.kind),a=[n[1]*e.kind*d,-n[0]*e.kind*d,0],o=a.map((e,t)=>e-i[t]*.04),s=e.age<l;if(e.age+=r,e.stub)return e.at=e.at.map((e,t)=>e+(o[t]-e)*Math.min(1,r*16)),e.tail=o,e.size=.003*(1-e.age/p),e.age<p;if(s){let n=Math.min(1,e.age/l),r=.015+.085*n**2.2;if(e.speed=.085*2.2*n**1.2/l,e.at=a.map((e,t)=>e*(1-.4*n)+i[t]*r),e.tail=o,e.thread=f*(1-.65*g(.65,1,n)),e.age>=l){let n=o.map((t,n)=>t+(e.at[n]-t)*.45);e.tail=n,j.push({...e,at:n,tail:o,age:0,stub:!0}),e.kind>0&&t()}}else{e.speed+=(u-e.speed)*Math.min(1,r*4);let t=e.at[0]*i[0]+e.at[1]*i[1]+e.at[2]*i[2];e.at=e.at.map((n,a)=>n+i[a]*e.speed*r-(n-i[a]*t)*Math.min(1,r*1.2));let[n,a,o]=e.at,s=Math.max(0,m(Math.min(1,Math.abs(a)))-e.size*.5),c=Math.hypot(n,o);if(c>s&&([e.at[0],e.at[2]]=[n*s/c,o*s/c]),e.at[1]=Math.sign(a)*Math.min(Math.abs(a),1-e.size*.5),(a>0?0:1)!==e.bulb&&Math.abs(a)>.03)return!1;e.tail=e.tail.map((t,n)=>t+(e.at[n]-t)*Math.min(1,r*16));let l=Math.hypot(...e.tail.map((t,n)=>t-e.at[n]));e.thread=e.size-(e.size-.003)*Math.min(1,l/e.size)}let[c,h,_]=e.at,b=e.kind*(c*v[0]+h*v[1]+_*v[2]-y[e.bulb]);return!e.landed&&!s&&b>-e.size*.4&&(e.landed=!0,w.set([0,1],e.bulb*2)),!s&&A===0&&(e.size*=Math.exp(-4*r)),b<e.size&&e.size>.008&&e.age<14}),s.push(...j),b.fill(0),S[0]=0,s.forEach((e,t)=>{S[0]=Math.max(S[0],Math.hypot(e.at[0],e.at[2])+e.size,Math.hypot(e.tail[0],e.tail[2])+e.thread);let n=e.age-l,r=e.stub||n>0?1:.25+.75*(e.age/l)**1.5;b.set([...e.at,e.kind*e.size*r],t*4),x.set([...e.tail,e.thread],t*4),C[t]=e.stub||n<0?0:-.18*Math.exp(-3*n)*Math.sin(11*n)}),w[0]+=r,w[2]+=r,A>0||s.length>0||o.some(e=>e!==0)||T[0]>0||w[0]<3||w[2]<3}}}var v=40,y=.28,b=5,x=.12,S=`#version 300 es
    precision highp float;
    uniform vec2 size;
    uniform mat3 toObject;  // the page's space to the glass's own
    uniform vec3 down;      // the gravity the liquids feel, in the glass's space
    uniform vec2 level;     // where water starts along "down", in the +y bulb and the other
    uniform vec4 heads[14]; // each blob's ball: where it is, and its radius, negative for oil
    uniform vec4 tails[14]; // the other end of its thread, and the thread's radius there
    uniform float reach;    // how far from the glass's middle line any blob gets
    uniform float stretch[14]; // how far each ball is pulled long
    uniform vec4 ripple;    // each bulb: seconds since a blob landed, and how hard
    uniform float churn;    // how stirred up the surfaces are
    uniform float time;
    uniform vec3 ink, paper;
    out vec4 color;
    const float W = ${i}, NECK = ${a}, WIDEST = ${o}, FLANK = ${s}, PI = 3.14159265, IOR = 1.5;
    const vec3 LAVENDER = vec3(164, 140, 230) / 255.;
    const vec3 CORAL = vec3(216, 92, 60) / 255.;
    const vec3 PINK = vec3(240, 170, 225) / 255.;
    const vec3 OLIVE = vec3(138, 154, 60) / 255.;
    const vec3 SUN = normalize(vec3(-0.55, 0.6, 0.58)); // the window's direction, in the page's space

    // Distance (near enough) to the inside face of the glass: negative in the hollow.
    float wall(vec3 p) {
      float r = length(p.xz), u = abs(p.y);
      if (u < WIDEST) {
        // The same shape as "profile" in liquids.ts, and its slope, for the distance.
        float a = PI / 2. * u / WIDEST, span = W * W - NECK * NECK, sn = max(sin(a), 1e-4);
        float swell = pow(sn, FLANK);
        float at = sqrt(NECK * NECK + span * swell * swell);
        float slope = span * swell * FLANK * swell / sn * cos(a) * PI / (2. * WIDEST) / at;
        return (r - at) / sqrt(1. + slope * slope);
      }
      vec2 q = vec2(r, u - WIDEST), ab = vec2(W, 1. - WIDEST);
      float k0 = length(q / ab), k1 = length(q / (ab * ab));
      return k0 * (k0 - 1.) / max(k1, 1e-4);
    }
    // How thick the glass is: blown glass gathers at the neck.
    float thick(vec3 p) { return 0.026 + 0.012 * exp(-abs(p.y) * 7.); }
    vec3 normalAt(vec3 p) {
      vec2 e = vec2(0.002, -0.002);
      return normalize(e.xyy * wall(p + e.xyy) + e.yyx * wall(p + e.yyx) + e.yxy * wall(p + e.yxy) + e.xxx * wall(p + e.xxx));
    }
    // How much a face reflects; "facing" is what it reflects seen straight on.
    float fresnel(vec3 d, vec3 n, float facing) {
      float c = 1. - abs(dot(d, n));
      return facing + (1. - facing) * c * c * c * c * c;
    }

    // The room the glass reflects: dark olive, a tall window up on the left with a bar across it,
    // a strip of light on the right, and the liquids' two colours glowing above and below.
    vec3 room(vec3 d) {
      d = d * toObject;
      vec3 c = mix(ink * 1.3, OLIVE * 0.3, smoothstep(-0.4, 0.9, d.y));
      vec3 right = normalize(cross(vec3(0, 1, 0), SUN)), up = cross(SUN, right);
      float facing = dot(d, SUN);
      vec2 w = vec2(dot(d, right), dot(d, up)) / max(facing, 1e-3);
      float window = step(0., facing) * smoothstep(0.4, 0.34, abs(w.x)) * smoothstep(0.62, 0.56, abs(w.y));
      window *= 0.25 + 0.75 * smoothstep(0.015, 0.04, abs(w.y + 0.1));
      c += paper * 5. * window;
      c += paper * 0.8 * smoothstep(0.93, 0.98, dot(normalize(d.xz + 1e-5), normalize(vec2(0.9, 0.35)))) * smoothstep(0.8, 0.5, abs(d.y));
      c += mix(OLIVE, paper, 0.7) * 0.75 * smoothstep(0.45, 1., abs(d.x)) * smoothstep(0.5, -0.3, d.z);
      c += LAVENDER * 0.22 * smoothstep(0.2, 1., d.y) + CORAL * 0.2 * smoothstep(-0.2, -1., d.y);
      return c;
    }

    // The smaller of two distances, rounded where they meet: it's what joins a blob to a pool.
    float join(float a, float b, float k) {
      float h = max(k - abs(a - b), 0.) / k;
      return min(a, b) - h * h * k * 0.25;
    }
    // Which liquid is at p: positive in the water, negative in the oil, and near enough the
    // distance to where they meet. x counts the blobs; y is the pools alone, without them.
    vec2 liquid(vec3 p) {
      float depth = dot(p, down);
      // A landed blob sends rings out from where it fell, the line down from the neck.
      vec2 rings = mix(ripple.zw, ripple.xy, smoothstep(-0.03, 0.03, p.y));
      float out_ = length(p - down * depth);
      depth += 0.014 * rings.y * exp(-2.2 * rings.x - 3. * out_) * cos(34. * out_ - 13. * rings.x);
      // A stirred surface rolls.
      vec3 across = cross(down, vec3(0, 0, 1));
      depth += churn * 0.016 * (sin(15. * dot(p, across) + 8. * time) + 0.6 * sin(21. * p.z - 11. * time));
      // Each bulb has its own level. The two bulbs meet in the neck at a face that sags the way
      // gravity pulls, like a drop about to form, so nothing there is cut flat.
      float out2 = dot(p.xz, p.xz);
      float face = p.y - down.y * (0.02 - min(25. * out2, 0.06));
      float pools = max(min(face, depth - level.x), min(-face, depth - level.y));
      float s = pools;
      // Blobs keep near the glass's middle line: most of the glass needn't ask about them.
      if (sqrt(out2) > reach + 0.03) return vec2(s, pools);
      for (int i = 0; i < 14; i++) {
        vec4 b = heads[i], a = tails[i];
        if (b.w == 0.) continue;
        // The ball, pulled long along gravity and thinner across (or squashed), keeping its volume.
        vec3 q = p - b.xyz;
        float along = dot(q, down), wide = sqrt(1. + stretch[i]);
        q = (q - down * along) * wide + down * along / (1. + stretch[i]);
        // A ball that tapers into its thread, like a drop hanging: the nearest point of the line
        // from ball to tail, and how thick the blob is there.
        vec3 line = a.xyz - b.xyz;
        float h = clamp(dot(q, line) / max(dot(line, line), 1e-6), 0., 1.);
        float d = (length(q - line * h) - mix(abs(b.w), a.w, smoothstep(0., 0.55, h))) / wide;
        s = b.w > 0. ? -join(-s, d, 0.02) : join(s, d, 0.02);
      }
      return vec2(s, pools);
    }

    // Follows a ray inside the glass to the face it leaves by. True when that's into the hollow.
    bool throughGlass(inout vec3 p, vec3 d) {
      for (int i = 0; i < 28; i++) {
        float w = wall(p);
        float m = min(w, thick(p) - w);
        if (m < 0.0008) break;
        p += d * max(m * 0.9, 0.002);
      }
      return wall(p) < thick(p) * 0.5;
    }
    // A ray leaving glass for air through a face whose normal is n, or bouncing back when it can't.
    vec3 leave(vec3 d, vec3 n) {
      n = dot(n, d) > 0. ? n : -n;
      vec3 o = refract(d, -n, IOR);
      return o == vec3(0) ? reflect(d, n) : o;
    }

    // Carries a ray across the hollow, through both liquids, to the far wall. The liquids are
    // milky and lit from within, as in the picture: each stretch of the way adds its colour to
    // "glow" and hides some of what's behind. Nothing has a hard edge: the two blend where they
    // meet, and a blob is a soft pink bead.
    void hollow(inout vec3 p, vec3 d, inout vec3 glow, inout float through, vec3 light) {
      vec2 s = liquid(p);
      for (int i = 0; i < 72; i++) {
        float w = -wall(p);
        if (w < 0.001 || through < 0.01) return;
        // Shorter steps near the glass's middle line, where the small beads are.
        float len = min(max(w * 0.8, 0.003), length(p.xz) < reach + 0.03 ? 0.007 : 0.02);
        vec2 after = liquid(p + d * len);
        vec3 c = mix(CORAL, LAVENDER, smoothstep(-0.004, 0.004, s.x));
        // A blob is one liquid inside the other's pool. Near the neck it's still its own colour,
        // a thread of it; further in it shows pink, and thick enough to be seen deep in the glass.
        float bead = s.x * s.y < 0. ? smoothstep(0., 0.009, abs(s.x)) : 0.;
        c = mix(c, PINK, bead * smoothstep(0.01, 0.06, abs(s.y)));
        // Brightest near the glass, where the light comes in, and a little more on the window's side.
        float lit = 0.82 + 0.45 * smoothstep(0.14, 0., w) + 0.22 * smoothstep(-0.3, 0., wall(p + light * 0.14));
        float hidden = 1. - exp(-(2.3 + 26. * bead) * len);
        glow += through * hidden * mix(c, paper, 0.12) * lit;
        through *= 1. - hidden;
        // The level face between a bulb's two liquids catches the light: a faint reflection of the
        // room, and the pink the picture has there. Not in the neck, where the two only blend.
        if (s.y * after.y < 0. && s.x * after.x < 0.) {
          float f = fresnel(d, down, 0.03) * smoothstep(0.05, 0.12, abs(p.y));
          vec3 n = dot(down, d) < 0. ? down : -down;
          glow += through * (0.5 * f * min(room(reflect(d, n)), 1.5) + 0.22 * PINK * smoothstep(0.05, 0.12, abs(p.y)));
          through *= 1. - 0.5 * f;
        }
        p += d * len;
        s = after;
      }
    }

    void main() {
      vec2 uv = (gl_FragCoord.xy - size * 0.5) / (size.y * 0.5);
      vec3 ro = toObject * vec3(0, 0, 4);
      vec3 rd = toObject * normalize(vec3(uv * 0.29, -1));
      // Only the box around the glass is worth tracing.
      vec3 lo = vec3(-0.46, -1.06, -0.46);
      vec3 t0 = (lo - ro) / rd, t1 = (-lo - ro) / rd;
      vec3 tn = min(t0, t1), tf = max(t0, t1);
      float near = max(max(tn.x, tn.y), tn.z), far = min(min(tf.x, tf.y), tf.z);
      color = vec4(0);
      if (near > far || far < 0.) return;

      // To the outside of the glass.
      float t = near, closest = 1.;
      vec3 p;
      bool hit = false;
      for (int i = 0; i < 64 && t < far; i++) {
        p = ro + rd * t;
        float d = wall(p) - thick(p);
        closest = min(closest, d);
        if (d < 0.0008) { hit = true; break; }
        t += d * 0.9;
      }
      if (!hit) {
        // A ray that only just misses still gets some of the rim, so the outline isn't jagged.
        float edge = clamp(1. - closest / (2.32 / size.y), 0., 1.);
        color = vec4(room(reflect(rd, normalize(ro + rd * t))) * edge, edge);
        return;
      }

      // Each face the ray meets reflects some of the room and lets the rest through.
      vec3 light = toObject * SUN;
      vec3 n = normalAt(p);
      float f = fresnel(rd, n, 0.04);
      // The picture's glass shines softly: no reflection gets to glare.
      vec3 rgb = f * min(room(reflect(rd, n)), 1.6);
      float through = 1. - f;
      vec3 d = refract(rd, n, 1. / IOR);
      vec3 q = p - n * 0.003;
      float glass = 0.; // how much glass the ray has crossed
      vec3 from = q;
      bool inside = throughGlass(q, d);
      glass += distance(from, q);
      n = normalAt(q);
      vec3 into = inside ? refract(d, n, IOR) : vec3(0);
      vec3 away; // the way the ray finally leaves the glass
      if (into == vec3(0)) away = leave(d, n);
      else {
        f = fresnel(d, n, 0.04);
        rgb += through * f * 0.6 * min(room(reflect(d, n)), 1.6);
        through *= 1. - f;
        q -= n * 0.004;
        // Glass takes a little light, more of the red and blue: that's its green edge.
        vec3 glow = vec3(0);
        hollow(q, into, glow, through, light);
        rgb += exp(-glass * vec3(1.5, 0.7, 1.2)) * glow;
        // Out through the far wall.
        n = normalAt(q);
        d = refract(into, -n, 1. / IOR);
        q += n * 0.004;
        from = q;
        throughGlass(q, d);
        glass += distance(from, q);
        away = leave(d, normalAt(q));
      }
      // What's behind: the page itself where the ray comes out as it went in, so the canvas stays
      // clear there; where the glass bent it, the room in that direction.
      vec3 tint = exp(-glass * vec3(1.5, 0.7, 1.2));
      float bent = smoothstep(0.02, 0.35, 1. - dot(away, rd));
      rgb += through * tint * room(away) * bent;
      color = vec4(rgb, 1. - through * (1. - bent) * tint.g);
    }`,C=class extends HTMLElement{connectedCallback(){let i=this.querySelector(`canvas`),a=i.getContext(`webgl2`,{premultipliedAlpha:!0,antialias:!1});if(!a)return void(i.hidden=!0);let o=matchMedia(`(prefers-reduced-motion: reduce)`).matches,s=document.documentElement,c=()=>s.dataset.graphic===`hourglass`,l=(e,t)=>{let n=a.createShader(e);return a.shaderSource(n,t),a.compileShader(n),a.getShaderParameter(n,a.COMPILE_STATUS)||console.error(a.getShaderInfoLog(n)),n},u=a.createProgram();a.attachShader(u,l(a.VERTEX_SHADER,`#version 300 es
in vec2 at; void main() { gl_Position = vec4(at, 0, 1); }`)),a.attachShader(u,l(a.FRAGMENT_SHADER,S)),a.linkProgram(u),a.useProgram(u),a.bindBuffer(a.ARRAY_BUFFER,a.createBuffer()),a.bufferData(a.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),a.STATIC_DRAW),a.enableVertexAttribArray(0),a.vertexAttribPointer(0,2,a.FLOAT,!1,0,0);let d=e=>a.getUniformLocation(u,e),f=_(v,r),p=0,m=()=>{performance.now()-p<700||(p=performance.now(),e())},h=0,g=0,C=0,w=0,T=y,E=y,D=null,O=!0,k=()=>{let e=Math.round(i.clientHeight*Math.min(devicePixelRatio,2));i.width!==e&&(i.width=i.height=e),a.viewport(0,0,e,e),a.uniform2f(d(`size`),e,e);for(let e of[`ink`,`paper`]){let t=getComputedStyle(s).getPropertyValue(`--color-${e}`).trim(),n=[1,3,5].map(e=>parseInt(t.slice(e,e+2),16)/255);a.uniform3fv(d(e),n.every(e=>e>=0)?n:e===`ink`?[.07,.08,.04]:[1,1,1])}O=!0},A=e=>{let t=i.getBoundingClientRect();return Math.atan2(e.clientY-t.top-t.height/2,e.clientX-t.left-t.width/2)};i.addEventListener(`pointerdown`,e=>{i.setPointerCapture(e.pointerId),D={from:A(e),turn:h,pressed:h,moved:!1,at:performance.now()},C=null}),i.addEventListener(`pointermove`,e=>{if(!D)return;let t=A(e)-D.from;t-=Math.round(t/(2*Math.PI))*2*Math.PI;let n=performance.now(),r=D.turn+t;!D.moved&&Math.abs(r-D.pressed)>.06&&(D.moved=!0,m());let i=Math.abs(g)<b;g=g*.5+(r-h)/Math.max((n-D.at)/1e3,1/240)*.5,i&&Math.abs(g)>=b&&m(),D.at=n,h=r,O=!0,[D.from,D.turn]=[A(e),h]}),i.addEventListener(`pointerup`,()=>{D&&!D.moved&&(m(),g=0,C=Math.round(h/Math.PI)*Math.PI+Math.PI),D=null}),i.addEventListener(`lostpointercapture`,()=>D=null),addEventListener(`pointermove`,e=>{if(o||D)return;let t=i.getBoundingClientRect(),n=(e.clientX-(t.left+t.width/2))/(innerWidth/2),r=(e.clientY-(t.top+t.height/2))/(innerHeight/2);w=Math.max(-1,Math.min(1,n))*x,E=y+Math.max(-1,Math.min(1,r))*.12},{passive:!0});let j=e=>{let[t,n]=[h,T];D||(C===null?(h+=g*e,g*=Math.exp(-2.5*e),Math.abs(g)<1.5&&(C=Math.round(h/Math.PI)*Math.PI)):o?[h,g]=[C,0]:(g+=(40*(C+w-h)-9*g)*e,h+=g*e)),T+=(E-T)*Math.min(1,e*10),C!==null&&!D&&Math.abs(g)<.001&&Math.abs(C+w-h)<1e-4&&([h,g]=[C+w,0]),Math.abs(E-T)<1e-4&&(T=E),(h!==t||T!==n)&&(O=!0);let r=-h,[i,s,c,l]=[Math.cos(r),Math.sin(r),Math.cos(T),Math.sin(T)];a.uniformMatrix3fv(d(`toObject`),!1,[i,-s*c,s*l,s,i*c,-i*l,0,l,c]),f.step([-s,-i,0],e,o)&&(O=!0),a.uniform3fv(d(`down`),f.down),a.uniform2fv(d(`level`),f.level),a.uniform4fv(d(`heads`),f.heads),a.uniform4fv(d(`tails`),f.tails),a.uniform1f(d(`reach`),f.reach[0]),a.uniform1fv(d(`stretch`),f.stretch),a.uniform4fv(d(`ripple`),f.ripple),a.uniform1f(d(`churn`),f.churn[0])},M=0,N=0,P=e=>{j(Math.min((e-N)/1e3,.05)),N=e,O&&i.width&&(a.uniform1f(d(`time`),e/1e3%1e3),a.drawArrays(a.TRIANGLES,0,3),O=!1,i.style.opacity=`1`),M=requestAnimationFrame(P)},F=!1,I=()=>{cancelAnimationFrame(M),c()&&F&&!document.hidden&&(n(t),k(),N=performance.now(),M=requestAnimationFrame(P))};new IntersectionObserver(([e])=>{F=e.isIntersecting,I()}).observe(this),addEventListener(`resize`,()=>c()&&k()),document.addEventListener(`visibilitychange`,I),document.addEventListener(`themechange`,I)}};customElements.get(`hourglass-scene`)||customElements.define(`hourglass-scene`,C);