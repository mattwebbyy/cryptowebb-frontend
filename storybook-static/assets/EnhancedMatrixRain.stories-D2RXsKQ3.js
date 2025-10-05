import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as t}from"./iframe-lSEetYu3.js";import{m as W}from"./proxy-CAtle9Ik.js";const B=({density:o=.8,speed:m=1,fontSize:i=14,showGlitch:u=!0,interactive:c=!0,characters:E="アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+-=[]{}|;:,.<>?",colors:G=["#33ff33","#00ff00","#00ff41","#00ff82","#00ffaa"]})=>{const f=t.useRef(null),p=t.useRef(),L=t.useRef([]),[l,I]=t.useState(!1),[T,H]=t.useState({x:0,y:0}),[_]=t.useState(60),P=t.useRef(1e3/_),q=t.useRef(0),d=t.useCallback(()=>E[Math.floor(Math.random()*E.length)],[E]),x=t.useCallback(()=>G[Math.floor(Math.random()*G.length)],[G]),h=t.useCallback(a=>{const s=Math.floor(a.width/i);L.current=[];for(let n=0;n<s*o;n++)L.current.push({x:Math.floor(Math.random()*s)*i,y:Math.random()*a.height,speed:(Math.random()*2+1)*m,char:d(),opacity:Math.random()*.8+.2,isLeading:Math.random()>.7,color:x()})},[o,i,m,d,x]),g=t.useCallback(()=>{u&&(I(!0),setTimeout(()=>I(!1),150))},[u]),A=t.useCallback((a,s,n)=>{n-q.current<P.current||(q.current=n,s.fillStyle=l?"rgba(0, 0, 0, 0.3)":"rgba(0, 0, 0, 0.05)",s.fillRect(0,0,a.width,a.height),L.current.forEach((r,V)=>{r.y+=r.speed,r.y>a.height+i&&(r.y=-i,r.x=Math.floor(Math.random()*(a.width/i))*i,r.char=d(),r.speed=(Math.random()*2+1)*m,r.opacity=Math.random()*.8+.2,r.isLeading=Math.random()>.7,r.color=x()),c&&Math.sqrt(Math.pow(r.x-T.x,2)+Math.pow(r.y-T.y,2))<100&&(r.opacity=Math.min(1,r.opacity+.3),r.speed*=1.5),Math.random()>.98&&(r.char=d()),s.font=`${i}px 'Courier New', monospace`,r.isLeading?(s.shadowBlur=l?20:10,s.shadowColor=r.color,s.fillStyle=r.color,s.globalAlpha=r.opacity):(s.shadowBlur=0,s.fillStyle=r.color,s.globalAlpha=r.opacity*.6),l&&Math.random()>.8&&(s.fillStyle="#ff0000",r.x+=(Math.random()-.5)*10),s.fillText(r.char,r.x,r.y),s.globalAlpha=1,s.shadowBlur=0}))},[i,m,d,x,c,T,l]),D=t.useCallback(a=>{if(!c)return;const s=f.current;if(!s)return;const n=s.getBoundingClientRect();H({x:a.clientX-n.left,y:a.clientY-n.top}),Math.random()>.95&&g()},[c,g]),F=t.useCallback(()=>{const a=f.current;a&&(a.width=window.innerWidth,a.height=window.innerHeight,h(a))},[h]);return t.useEffect(()=>{const a=f.current;if(!a)return;const s=a.getContext("2d");if(!s)return;a.width=window.innerWidth,a.height=window.innerHeight,h(a);const n=V=>{A(a,s,V),p.current=requestAnimationFrame(n)};p.current=requestAnimationFrame(n),window.addEventListener("resize",F),c&&a.addEventListener("mousemove",D);let r;return u&&(r=setInterval(()=>{Math.random()>.7&&g()},5e3+Math.random()*1e4)),()=>{p.current&&cancelAnimationFrame(p.current),window.removeEventListener("resize",F),c&&a.removeEventListener("mousemove",D),r&&clearInterval(r)}},[A,F,D,h,c,u,g]),e.jsx(W.canvas,{ref:f,className:`fixed inset-0 pointer-events-none z-0 ${l?"animate-pulse":""}`,style:{background:"transparent",filter:l?"hue-rotate(180deg) saturate(2)":"none",transition:"filter 0.1s ease-out"},initial:{opacity:0},animate:{opacity:1},transition:{duration:2}})};B.__docgenInfo={description:"",methods:[],displayName:"EnhancedMatrixRain",props:{density:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"0.8",computed:!1}},speed:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"1",computed:!1}},fontSize:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"14",computed:!1}},showGlitch:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"true",computed:!1}},interactive:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"true",computed:!1}},characters:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+-=[]{}|;:,.<>?'",computed:!1}},colors:{required:!1,tsType:{name:"Array",elements:[{name:"string"}],raw:"string[]"},description:"",defaultValue:{value:"['#33ff33', '#00ff00', '#00ff41', '#00ff82', '#00ffaa']",computed:!1}}}};const Y={title:"Matrix/EnhancedMatrixRain",component:B,parameters:{layout:"fullscreen",backgrounds:{default:"dark",values:[{name:"dark",value:"#000000"}]}},decorators:[o=>e.jsxs("div",{className:"min-h-screen bg-black relative",children:[e.jsx(o,{}),e.jsx("div",{className:"relative z-10 p-8 text-matrix-green",children:e.jsxs("div",{className:"max-w-4xl mx-auto",children:[e.jsx("h1",{className:"text-4xl font-bold mb-6 text-center",children:"Enhanced Matrix Rain"}),e.jsxs("div",{className:"grid md:grid-cols-2 gap-8 mb-8",children:[e.jsxs("div",{className:"bg-black/70 border border-matrix-green/30 p-6 rounded backdrop-blur-sm",children:[e.jsx("h2",{className:"text-xl mb-4",children:"Features"}),e.jsxs("ul",{className:"text-matrix-green/70 space-y-2 text-sm",children:[e.jsx("li",{children:"• Smooth 60fps animation"}),e.jsx("li",{children:"• Interactive mouse effects"}),e.jsx("li",{children:"• Random glitch effects"}),e.jsx("li",{children:"• Customizable colors and characters"}),e.jsx("li",{children:"• Performance optimized"}),e.jsx("li",{children:"• Responsive canvas sizing"})]})]}),e.jsxs("div",{className:"bg-black/70 border border-matrix-green/30 p-6 rounded backdrop-blur-sm",children:[e.jsx("h2",{className:"text-xl mb-4",children:"Controls"}),e.jsxs("div",{className:"text-matrix-green/70 space-y-2 text-sm",children:[e.jsxs("p",{children:[e.jsx("strong",{children:"Mouse:"})," Move around to see interactive effects"]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Glitch:"})," Random glitch effects occur automatically"]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Characters:"})," Japanese characters, numbers, and symbols"]})]})]})]}),e.jsx("div",{className:"text-center",children:e.jsx("p",{className:"text-matrix-green/50 text-sm",children:"Move your mouse around to see the interactive effects"})})]})})]})]},v={},b={args:{density:1.5,speed:1.2}},y={args:{density:.3,speed:.8}},N={args:{speed:2,showGlitch:!0}},j={args:{speed:.5,showGlitch:!1}},M={args:{fontSize:20,density:.6}},w={args:{fontSize:10,density:1.2}},S={args:{showGlitch:!1}},R={args:{interactive:!1,showGlitch:!0}},C={args:{colors:["#ff0000","#ff3333","#ff6666","#ff9999","#ffcccc"]},decorators:[o=>e.jsxs("div",{className:"min-h-screen bg-black relative",children:[e.jsx(o,{}),e.jsx("div",{className:"relative z-10 p-8 text-red-400",children:e.jsxs("div",{className:"max-w-2xl mx-auto text-center",children:[e.jsx("h1",{className:"text-4xl font-bold mb-6",children:"Red Matrix Rain"}),e.jsx("p",{className:"text-red-300/70",children:"Custom color scheme using red tones instead of the traditional green"})]})})]})]},k={args:{characters:"01",colors:["#00ff00","#33ff33"]},decorators:[o=>e.jsxs("div",{className:"min-h-screen bg-black relative",children:[e.jsx(o,{}),e.jsx("div",{className:"relative z-10 p-8 text-matrix-green",children:e.jsxs("div",{className:"max-w-2xl mx-auto text-center",children:[e.jsx("h1",{className:"text-4xl font-bold mb-6",children:"Binary Rain"}),e.jsx("p",{className:"text-matrix-green/70",children:"Matrix rain effect using only binary digits (0 and 1)"})]})})]})]},z={args:{density:.8,speed:1,fontSize:14},decorators:[o=>e.jsxs("div",{className:"h-96 bg-black relative border border-matrix-green/30 rounded overflow-hidden",children:[e.jsx(o,{}),e.jsx("div",{className:"absolute inset-0 flex items-center justify-center z-10 pointer-events-none",children:e.jsxs("div",{className:"text-center bg-black/50 p-4 rounded border border-matrix-green/30 backdrop-blur-sm",children:[e.jsx("h2",{className:"text-xl text-matrix-green mb-2",children:"Matrix Rain Demo"}),e.jsx("p",{className:"text-matrix-green/60 text-sm",children:"Interactive canvas animation"})]})})]})]};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:"{}",...v.parameters?.docs?.source}}};b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    density: 1.5,
    speed: 1.2
  }
}`,...b.parameters?.docs?.source}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    density: 0.3,
    speed: 0.8
  }
}`,...y.parameters?.docs?.source}}};N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    speed: 2,
    showGlitch: true
  }
}`,...N.parameters?.docs?.source}}};j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    speed: 0.5,
    showGlitch: false
  }
}`,...j.parameters?.docs?.source}}};M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    fontSize: 20,
    density: 0.6
  }
}`,...M.parameters?.docs?.source}}};w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    fontSize: 10,
    density: 1.2
  }
}`,...w.parameters?.docs?.source}}};S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    showGlitch: false
  }
}`,...S.parameters?.docs?.source}}};R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  args: {
    interactive: false,
    showGlitch: true
  }
}`,...R.parameters?.docs?.source}}};C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    colors: ['#ff0000', '#ff3333', '#ff6666', '#ff9999', '#ffcccc']
  },
  decorators: [Story => <div className="min-h-screen bg-black relative">
        <Story />
        
        <div className="relative z-10 p-8 text-red-400">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">Red Matrix Rain</h1>
            <p className="text-red-300/70">
              Custom color scheme using red tones instead of the traditional green
            </p>
          </div>
        </div>
      </div>]
}`,...C.parameters?.docs?.source}}};k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    characters: '01',
    colors: ['#00ff00', '#33ff33']
  },
  decorators: [Story => <div className="min-h-screen bg-black relative">
        <Story />
        
        <div className="relative z-10 p-8 text-matrix-green">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">Binary Rain</h1>
            <p className="text-matrix-green/70">
              Matrix rain effect using only binary digits (0 and 1)
            </p>
          </div>
        </div>
      </div>]
}`,...k.parameters?.docs?.source}}};z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  args: {
    density: 0.8,
    speed: 1,
    fontSize: 14
  },
  decorators: [Story => <div className="h-96 bg-black relative border border-matrix-green/30 rounded overflow-hidden">
        <Story />
        
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="text-center bg-black/50 p-4 rounded border border-matrix-green/30 backdrop-blur-sm">
            <h2 className="text-xl text-matrix-green mb-2">Matrix Rain Demo</h2>
            <p className="text-matrix-green/60 text-sm">Interactive canvas animation</p>
          </div>
        </div>
      </div>]
}`,...z.parameters?.docs?.source}}};const K=["Default","HighDensity","LowDensity","FastSpeed","SlowSpeed","LargeFontSize","SmallFontSize","NoGlitch","NonInteractive","CustomColors","CustomCharacters","MinimalDemo"];export{k as CustomCharacters,C as CustomColors,v as Default,N as FastSpeed,b as HighDensity,M as LargeFontSize,y as LowDensity,z as MinimalDemo,S as NoGlitch,R as NonInteractive,j as SlowSpeed,w as SmallFontSize,K as __namedExportsOrder,Y as default};
