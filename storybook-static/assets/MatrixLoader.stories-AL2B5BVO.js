import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as o}from"./iframe-BIPmi7o-.js";import{m as t}from"./proxy-DQE-iD68.js";const i=()=>{const[l,c]=o.useState("");return o.useEffect(()=>{const d=setInterval(()=>{c(n=>n.length>=3?"":n+".")},500);return()=>clearInterval(d)},[]),e.jsxs("div",{className:"fixed inset-0 bg-white/95 dark:bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center z-[9999] pt-40",children:[" ",e.jsxs(t.div,{initial:{opacity:0,y:-20},animate:{opacity:1,y:0},className:"text-center",children:[e.jsxs("h2",{className:"text-2xl mb-4 font-mono text-teal-600 dark:text-matrix-green",style:{textShadow:"0 0 10px currentColor"},children:["INITIALIZING SYSTEM",e.jsx("span",{className:"inline-block w-16 text-left",children:l})]}),e.jsx("div",{className:"w-64 h-2 bg-gray-200 dark:bg-gray-800 border border-teal-600 dark:border-matrix-green relative",children:e.jsx(t.div,{className:"absolute top-0 left-0 h-full bg-teal-600/50 dark:bg-matrix-green/50",initial:{width:0},animate:{width:"100%"},transition:{duration:2,repeat:1/0,ease:"linear"}})}),e.jsxs("div",{className:"mt-4 font-mono text-sm text-teal-600/70 dark:text-matrix-green/70 max-w-md",children:[e.jsx(t.p,{initial:{opacity:0},animate:{opacity:1},transition:{delay:.5},className:"mb-2",children:"`>` Establishing secure connection"}),e.jsx(t.p,{initial:{opacity:0},animate:{opacity:1},transition:{delay:1},className:"mb-2",children:"`>` Loading matrix protocols"}),e.jsx(t.p,{initial:{opacity:0},animate:{opacity:1},transition:{delay:1.5},className:"mb-2",children:"`>` Decrypting data streams"})]})]})]})};i.__docgenInfo={description:"",methods:[],displayName:"MatrixLoader"};const h={title:"UI/MatrixLoader",component:i,parameters:{layout:"fullscreen",backgrounds:{default:"dark"}}},a={args:{}},s={render:()=>e.jsx("div",{style:{position:"relative",width:"600px",height:"400px",border:"1px solid #333",borderRadius:"8px",overflow:"hidden"},children:e.jsx(i,{})})},r={render:()=>e.jsx("div",{style:{position:"relative",width:"100%",height:"500px",background:"linear-gradient(135deg, #000000 0%, #001100 100%)"},children:e.jsx("div",{className:"fixed inset-0 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center z-[9999]",children:e.jsxs("div",{className:"text-center",children:[e.jsxs("h2",{className:"text-2xl mb-4 font-mono text-green-400",style:{textShadow:"0 0 10px currentColor"},children:["INITIALIZING SYSTEM",e.jsx("span",{className:"inline-block w-16 text-left",children:"..."})]}),e.jsx("div",{className:"w-64 h-2 bg-gray-800 border border-green-400 relative mb-6",children:e.jsx("div",{className:"absolute top-0 left-0 h-full bg-green-400/50",style:{width:"75%"}})}),e.jsxs("div",{className:"mt-4 font-mono text-sm text-green-400/70 max-w-md space-y-2",children:[e.jsx("p",{className:"opacity-100",children:"> Establishing secure connection ✓"}),e.jsx("p",{className:"opacity-100",children:"> Loading matrix protocols ✓"}),e.jsx("p",{className:"opacity-75",children:"> Decrypting data streams..."}),e.jsx("p",{className:"opacity-25",children:"> Initializing dashboard"})]})]})})})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {}
}`,...a.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    position: 'relative',
    width: '600px',
    height: '400px',
    border: '1px solid #333',
    borderRadius: '8px',
    overflow: 'hidden'
  }}>
      <MatrixLoader />
    </div>
}`,...s.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: () => {
    return <div style={{
      position: 'relative',
      width: '100%',
      height: '500px',
      background: 'linear-gradient(135deg, #000000 0%, #001100 100%)'
    }}>
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center z-[9999]">
          <div className="text-center">
            <h2 className="text-2xl mb-4 font-mono text-green-400" style={{
            textShadow: '0 0 10px currentColor'
          }}>
              INITIALIZING SYSTEM
              <span className="inline-block w-16 text-left">...</span>
            </h2>

            <div className="w-64 h-2 bg-gray-800 border border-green-400 relative mb-6">
              <div className="absolute top-0 left-0 h-full bg-green-400/50" style={{
              width: '75%'
            }} />
            </div>

            <div className="mt-4 font-mono text-sm text-green-400/70 max-w-md space-y-2">
              <p className="opacity-100">&gt; Establishing secure connection ✓</p>
              <p className="opacity-100">&gt; Loading matrix protocols ✓</p>
              <p className="opacity-75">&gt; Decrypting data streams...</p>
              <p className="opacity-25">&gt; Initializing dashboard</p>
            </div>
          </div>
        </div>
      </div>;
  }
}`,...r.parameters?.docs?.source}}};const g=["Default","Demo","WithSteps"];export{a as Default,s as Demo,r as WithSteps,g as __namedExportsOrder,h as default};
