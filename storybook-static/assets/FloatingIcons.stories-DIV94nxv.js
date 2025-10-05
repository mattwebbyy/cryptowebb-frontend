import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as x}from"./iframe-lSEetYu3.js";const p=()=>{const[a,s]=x.useState([]),r=["∆","◊","○","□","∇","×","+"];return x.useEffect(()=>{const h=setInterval(()=>{const m=Date.now(),n=50,v=window.innerWidth-n,b=window.innerHeight-n,g=Math.random()*(v-n)+n/2,f=Math.random()*(b-n)+n/2,d=100,u=(Math.random()-.5)*d,y=(Math.random()-.5)*d,N={id:m,symbol:r[Math.floor(Math.random()*r.length)],x:g,y:f,moveX:u,moveY:y};s(c=>[...c,N]),setTimeout(()=>{s(c=>c.filter(j=>j.id!==m))},2e4)},2e3);return()=>clearInterval(h)},[]),e.jsx("div",{className:"fixed inset-0 pointer-events-none z-[1] overflow-hidden",children:a.map(t=>e.jsx("div",{className:"absolute text-2xl opacity-30 text-matrix-green animate-float",style:{left:`${Math.max(0,Math.min(t.x,window.innerWidth-50))}px`,top:`${Math.max(0,Math.min(t.y,window.innerHeight-50))}px`,"--moveX":`${t.moveX}px`,"--moveY":`${t.moveY}px`,transform:"translate(var(--moveX, 0), var(--moveY, 0))",animation:"float 20s ease-in-out infinite"},children:t.symbol},t.id))})};p.__docgenInfo={description:"",methods:[],displayName:"FloatingIcons"};const w={title:"Matrix/FloatingIcons",component:p,parameters:{layout:"fullscreen",backgrounds:{default:"dark",values:[{name:"dark",value:"#000000"}]}},decorators:[a=>e.jsxs("div",{className:"min-h-screen bg-black relative",children:[e.jsx(a,{}),e.jsx("div",{className:"relative z-10 p-8 text-matrix-green",children:e.jsxs("div",{className:"max-w-4xl mx-auto",children:[e.jsx("h1",{className:"text-4xl font-bold mb-6 text-center",children:"Floating Matrix Icons"}),e.jsxs("div",{className:"grid md:grid-cols-2 gap-8 mb-8",children:[e.jsxs("div",{className:"bg-black/50 border border-matrix-green/30 p-6 rounded",children:[e.jsx("h2",{className:"text-xl mb-4",children:"About the Effect"}),e.jsx("p",{className:"text-matrix-green/70 mb-4",children:"Matrix-themed floating icons that spawn randomly across the screen. Icons move in gentle floating patterns and fade out over time."}),e.jsxs("ul",{className:"text-sm text-matrix-green/60 space-y-1",children:[e.jsx("li",{children:"• Icons spawn every 2 seconds"}),e.jsx("li",{children:"• Each icon lasts 20 seconds"}),e.jsx("li",{children:"• Random positioning and movement"}),e.jsx("li",{children:"• Low opacity for subtle effect"})]})]}),e.jsxs("div",{className:"bg-black/50 border border-matrix-green/30 p-6 rounded",children:[e.jsx("h2",{className:"text-xl mb-4",children:"Symbols Used"}),e.jsx("div",{className:"grid grid-cols-4 gap-4 text-center",children:["∆","◊","○","□","∇","×","+"].map((s,r)=>e.jsx("div",{className:"text-2xl text-matrix-green border border-matrix-green/20 p-2 rounded",children:s},r))})]})]}),e.jsx("div",{className:"text-center",children:e.jsx("p",{className:"text-matrix-green/50 text-sm",children:"Watch for floating icons appearing randomly across the screen"})})]})}),e.jsx("style",{jsx:!0,children:`
          @keyframes float {
            0%, 100% {
              transform: translate(0, 0) scale(1);
              opacity: 0;
            }
            10% {
              opacity: 0.3;
            }
            50% {
              transform: translate(var(--moveX, 0px), var(--moveY, 0px)) scale(1.2);
              opacity: 0.3;
            }
            90% {
              opacity: 0.3;
            }
          }
          
          .animate-float {
            animation: float 20s ease-in-out infinite;
          }
        `})]})]},i={},o={decorators:[a=>e.jsxs("div",{className:"min-h-screen bg-black relative",children:[e.jsx(a,{}),e.jsx("div",{className:"relative z-10 p-8 text-matrix-green",children:e.jsxs("div",{className:"max-w-2xl mx-auto",children:[e.jsxs("header",{className:"text-center mb-12",children:[e.jsx("h1",{className:"text-5xl font-bold mb-4",children:"CryptoWebb"}),e.jsx("p",{className:"text-xl text-matrix-green/70",children:"Blockchain Analytics Platform"})]}),e.jsxs("div",{className:"space-y-8",children:[e.jsxs("section",{className:"bg-black/50 border border-matrix-green/30 p-6 rounded",children:[e.jsx("h2",{className:"text-2xl mb-4",children:"Real-time Data"}),e.jsx("p",{className:"text-matrix-green/70 mb-4",children:"Monitor blockchain transactions, analyze patterns, and detect anomalies in real-time with our advanced analytics platform."}),e.jsxs("div",{className:"grid grid-cols-3 gap-4 text-center",children:[e.jsxs("div",{className:"border border-matrix-green/20 p-3 rounded",children:[e.jsx("div",{className:"text-lg font-bold",children:"1,247"}),e.jsx("div",{className:"text-sm text-matrix-green/60",children:"Transactions"})]}),e.jsxs("div",{className:"border border-matrix-green/20 p-3 rounded",children:[e.jsx("div",{className:"text-lg font-bold",children:"$2.3M"}),e.jsx("div",{className:"text-sm text-matrix-green/60",children:"Volume"})]}),e.jsxs("div",{className:"border border-matrix-green/20 p-3 rounded",children:[e.jsx("div",{className:"text-lg font-bold",children:"99.9%"}),e.jsx("div",{className:"text-sm text-matrix-green/60",children:"Uptime"})]})]})]}),e.jsxs("section",{className:"bg-black/50 border border-matrix-green/30 p-6 rounded",children:[e.jsx("h2",{className:"text-2xl mb-4",children:"Security Features"}),e.jsxs("ul",{className:"space-y-2 text-matrix-green/70",children:[e.jsx("li",{children:"• End-to-end encryption"}),e.jsx("li",{children:"• Multi-signature authentication"}),e.jsx("li",{children:"• Real-time threat detection"}),e.jsx("li",{children:"• Automated security protocols"})]})]})]})]})}),e.jsx("style",{jsx:!0,children:`
          @keyframes float {
            0%, 100% {
              transform: translate(0, 0) scale(1);
              opacity: 0;
            }
            10% {
              opacity: 0.3;
            }
            50% {
              transform: translate(var(--moveX, 0px), var(--moveY, 0px)) scale(1.2);
              opacity: 0.3;
            }
            90% {
              opacity: 0.3;
            }
          }
          
          .animate-float {
            animation: float 20s ease-in-out infinite;
          }
        `})]})]},l={decorators:[a=>e.jsxs("div",{className:"h-96 bg-black relative border border-matrix-green/30 rounded",children:[e.jsx(a,{}),e.jsx("div",{className:"absolute inset-0 flex items-center justify-center z-10",children:e.jsxs("div",{className:"text-center",children:[e.jsx("h2",{className:"text-2xl text-matrix-green mb-2",children:"Floating Icons Demo"}),e.jsx("p",{className:"text-matrix-green/60 text-sm",children:"Watch for symbols appearing randomly"})]})}),e.jsx("style",{jsx:!0,children:`
          @keyframes float {
            0%, 100% {
              transform: translate(0, 0) scale(1);
              opacity: 0;
            }
            10% {
              opacity: 0.3;
            }
            50% {
              transform: translate(var(--moveX, 0px), var(--moveY, 0px)) scale(1.2);
              opacity: 0.3;
            }
            90% {
              opacity: 0.3;
            }
          }
          
          .animate-float {
            animation: float 20s ease-in-out infinite;
          }
        `})]})]};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:"{}",...i.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  decorators: [Story => <div className="min-h-screen bg-black relative">
        <Story />
        
        {/* Simulated page content */}
        <div className="relative z-10 p-8 text-matrix-green">
          <div className="max-w-2xl mx-auto">
            <header className="text-center mb-12">
              <h1 className="text-5xl font-bold mb-4">CryptoWebb</h1>
              <p className="text-xl text-matrix-green/70">Blockchain Analytics Platform</p>
            </header>
            
            <div className="space-y-8">
              <section className="bg-black/50 border border-matrix-green/30 p-6 rounded">
                <h2 className="text-2xl mb-4">Real-time Data</h2>
                <p className="text-matrix-green/70 mb-4">
                  Monitor blockchain transactions, analyze patterns, and detect anomalies 
                  in real-time with our advanced analytics platform.
                </p>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="border border-matrix-green/20 p-3 rounded">
                    <div className="text-lg font-bold">1,247</div>
                    <div className="text-sm text-matrix-green/60">Transactions</div>
                  </div>
                  <div className="border border-matrix-green/20 p-3 rounded">
                    <div className="text-lg font-bold">$2.3M</div>
                    <div className="text-sm text-matrix-green/60">Volume</div>
                  </div>
                  <div className="border border-matrix-green/20 p-3 rounded">
                    <div className="text-lg font-bold">99.9%</div>
                    <div className="text-sm text-matrix-green/60">Uptime</div>
                  </div>
                </div>
              </section>
              
              <section className="bg-black/50 border border-matrix-green/30 p-6 rounded">
                <h2 className="text-2xl mb-4">Security Features</h2>
                <ul className="space-y-2 text-matrix-green/70">
                  <li>• End-to-end encryption</li>
                  <li>• Multi-signature authentication</li>
                  <li>• Real-time threat detection</li>
                  <li>• Automated security protocols</li>
                </ul>
              </section>
            </div>
          </div>
        </div>
        
        <style jsx>{\`
          @keyframes float {
            0%, 100% {
              transform: translate(0, 0) scale(1);
              opacity: 0;
            }
            10% {
              opacity: 0.3;
            }
            50% {
              transform: translate(var(--moveX, 0px), var(--moveY, 0px)) scale(1.2);
              opacity: 0.3;
            }
            90% {
              opacity: 0.3;
            }
          }
          
          .animate-float {
            animation: float 20s ease-in-out infinite;
          }
        \`}</style>
      </div>]
}`,...o.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  decorators: [Story => <div className="h-96 bg-black relative border border-matrix-green/30 rounded">
        <Story />
        
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center">
            <h2 className="text-2xl text-matrix-green mb-2">Floating Icons Demo</h2>
            <p className="text-matrix-green/60 text-sm">Watch for symbols appearing randomly</p>
          </div>
        </div>
        
        <style jsx>{\`
          @keyframes float {
            0%, 100% {
              transform: translate(0, 0) scale(1);
              opacity: 0;
            }
            10% {
              opacity: 0.3;
            }
            50% {
              transform: translate(var(--moveX, 0px), var(--moveY, 0px)) scale(1.2);
              opacity: 0.3;
            }
            90% {
              opacity: 0.3;
            }
          }
          
          .animate-float {
            animation: float 20s ease-in-out infinite;
          }
        \`}</style>
      </div>]
}`,...l.parameters?.docs?.source}}};const I=["Default","WithContent","MinimalDemo"];export{i as Default,l as MinimalDemo,o as WithContent,I as __namedExportsOrder,w as default};
