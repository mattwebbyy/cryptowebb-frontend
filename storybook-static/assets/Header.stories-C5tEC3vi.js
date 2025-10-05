import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as p}from"./iframe-lSEetYu3.js";const g=({isAuthenticated:a=!1,user:o=null,showNav:d=!0,className:x=""})=>{const[s,m]=p.useState(!1);return e.jsxs("header",{className:`bg-black border-b-2 border-matrix-green relative ${x}`,children:[e.jsx("div",{className:"absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-matrix-green to-transparent opacity-50"}),e.jsxs("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",children:[e.jsxs("div",{className:"flex items-center justify-between h-16",children:[e.jsxs("div",{className:"flex items-center",children:[e.jsx("div",{className:"text-matrix-green font-mono font-bold text-xl uppercase tracking-wider",children:"CRYPTOWEBB"}),e.jsx("div",{className:"ml-3 text-matrix-green/60 text-xs font-mono",children:"[MATRIX_v3.0]"})]}),d&&e.jsx("nav",{className:"hidden md:flex items-center space-x-8",children:["ANALYTICS","PORTFOLIO","DATA","ALERTS"].map(t=>e.jsx("a",{href:"#",onClick:c=>{c.preventDefault(),console.log(`Navigate to ${t}`)},className:`
                    text-matrix-green/70 hover:text-matrix-green
                    font-mono text-sm uppercase tracking-wider
                    border-b border-transparent hover:border-matrix-green/50
                    pb-1 transition-all duration-300
                    hover:shadow-[0_0_5px_rgba(0,255,0,0.3)]
                  `,children:t},t))}),e.jsxs("div",{className:"flex items-center space-x-4",children:[e.jsxs("div",{className:"hidden sm:flex items-center space-x-2",children:[e.jsx("div",{className:"w-2 h-2 bg-matrix-green rounded-full animate-pulse"}),e.jsx("span",{className:"text-matrix-green/60 font-mono text-xs",children:"ONLINE"})]}),a?e.jsxs("div",{className:"flex items-center space-x-4",children:[e.jsxs("div",{className:"text-matrix-green font-mono text-sm",children:["USER: ",o?.name||"ANONYMOUS"]}),e.jsx("button",{onClick:()=>console.log("Logout"),className:`
                    bg-transparent border border-matrix-green text-matrix-green
                    hover:bg-matrix-green hover:text-black
                    font-mono text-xs uppercase tracking-wider
                    px-3 py-1 transition-all duration-300
                    hover:shadow-[0_0_10px_rgba(0,255,0,0.5)]
                  `,children:"LOGOUT"})]}):e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx("button",{onClick:()=>console.log("Login"),className:`
                    bg-transparent border border-matrix-green text-matrix-green
                    hover:bg-matrix-green hover:text-black
                    font-mono text-xs uppercase tracking-wider
                    px-3 py-1 transition-all duration-300
                    hover:shadow-[0_0_10px_rgba(0,255,0,0.5)]
                  `,children:"LOGIN"}),e.jsx("button",{onClick:()=>console.log("Register"),className:`
                    bg-matrix-green text-black border border-matrix-green
                    hover:bg-black hover:text-matrix-green
                    font-mono text-xs uppercase tracking-wider
                    px-3 py-1 transition-all duration-300
                    hover:shadow-[0_0_10px_rgba(0,255,0,0.5)]
                  `,children:"REGISTER"})]}),e.jsx("button",{onClick:()=>m(!s),className:"md:hidden text-matrix-green hover:text-matrix-green p-2",children:e.jsxs("div",{className:"w-6 h-6 relative",children:[e.jsx("div",{className:`absolute h-0.5 w-6 bg-current transition-all duration-300 ${s?"rotate-45 top-3":"top-1"}`}),e.jsx("div",{className:`absolute h-0.5 w-6 bg-current transition-all duration-300 top-3 ${s?"opacity-0":"opacity-100"}`}),e.jsx("div",{className:`absolute h-0.5 w-6 bg-current transition-all duration-300 ${s?"-rotate-45 top-3":"top-5"}`})]})})]})]}),s&&e.jsx("div",{className:"md:hidden border-t border-matrix-green/30 py-4 space-y-2",children:["ANALYTICS","PORTFOLIO","DATA","ALERTS"].map(t=>e.jsx("a",{href:"#",onClick:c=>{c.preventDefault(),console.log(`Navigate to ${t}`)},className:`
                  block text-matrix-green/70 hover:text-matrix-green
                  font-mono text-sm uppercase tracking-wider
                  py-2 px-4 hover:bg-matrix-green/10
                  transition-all duration-300
                `,children:t},t))})]})]})},h={title:"Layout/Header",component:g,parameters:{layout:"fullscreen",backgrounds:{default:"dark",values:[{name:"dark",value:"#000000"}]}},decorators:[a=>e.jsxs("div",{className:"min-h-screen bg-black",children:[e.jsx(a,{}),e.jsxs("div",{className:"pt-24 px-6 text-matrix-green",children:[e.jsx("h1",{className:"text-2xl mb-4",children:"Page Content"}),e.jsx("p",{children:"This shows how the header appears above page content."})]})]})]},r={args:{isAuthenticated:!1,user:null}},n={args:{isAuthenticated:!0,user:{name:"MATRIX_USER_001",email:"agent@matrix.net"}}},i={args:{isAuthenticated:!0,user:{name:"CIPHER",email:"cipher@cryptowebb.net"},showNav:!1},decorators:[a=>e.jsxs("div",{className:"min-h-screen bg-black",children:[e.jsx(a,{}),e.jsx("div",{className:"pt-20 px-6",children:e.jsxs("div",{className:"max-w-4xl mx-auto",children:[e.jsxs("div",{className:"text-matrix-green font-mono text-center mb-8",children:[e.jsx("h1",{className:"text-3xl font-bold uppercase tracking-wider mb-4",children:"MATRIX TERMINAL ACCESS"}),e.jsx("div",{className:"text-matrix-green/60 text-sm",children:"[ AUTHENTICATION_SUCCESSFUL ]"})]}),e.jsx("div",{className:"bg-black border border-matrix-green/30 p-6",children:e.jsxs("div",{className:"text-matrix-green font-mono text-sm",children:["> ","Accessing encrypted blockchain data..."]})})]})})]})]},l={args:{isAuthenticated:!0,user:{name:"NEO",email:"neo@matrix.net"}},decorators:[a=>e.jsxs("div",{className:"min-h-screen bg-black relative overflow-hidden",children:[e.jsx("div",{className:"absolute inset-0 opacity-5",children:e.jsx("div",{className:"w-full h-full bg-[linear-gradient(rgba(0,255,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"})}),e.jsx(a,{}),e.jsx("div",{className:"relative z-10 pt-24 px-8",children:e.jsx("div",{className:"max-w-7xl mx-auto",children:e.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-3 gap-8",children:[e.jsxs("div",{className:"bg-black border border-matrix-green/30 p-6",children:[e.jsx("h3",{className:"text-matrix-green font-mono font-bold uppercase text-lg mb-4",children:"SYSTEM STATUS"}),e.jsxs("div",{className:"space-y-2 text-sm font-mono",children:[e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{className:"text-matrix-green/60",children:"CONNECTION:"}),e.jsx("span",{className:"text-matrix-green",children:"SECURE"})]}),e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{className:"text-matrix-green/60",children:"ENCRYPTION:"}),e.jsx("span",{className:"text-matrix-green",children:"AES-256"})]}),e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{className:"text-matrix-green/60",children:"LATENCY:"}),e.jsx("span",{className:"text-matrix-green",children:"12ms"})]})]})]}),e.jsxs("div",{className:"bg-black border border-matrix-green/30 p-6",children:[e.jsx("h3",{className:"text-matrix-green font-mono font-bold uppercase text-lg mb-4",children:"ACTIVE PROTOCOLS"}),e.jsxs("div",{className:"space-y-2 text-sm font-mono text-matrix-green/60",children:[e.jsx("div",{children:"• BLOCKCHAIN_ANALYSIS_v3.1"}),e.jsx("div",{children:"• REAL_TIME_MONITORING"}),e.jsx("div",{children:"• THREAT_DETECTION_AI"}),e.jsx("div",{children:"• QUANTUM_ENCRYPTION"})]})]}),e.jsxs("div",{className:"bg-black border border-matrix-green/30 p-6",children:[e.jsx("h3",{className:"text-matrix-green font-mono font-bold uppercase text-lg mb-4",children:"USER ACCESS"}),e.jsxs("div",{className:"text-sm font-mono",children:[e.jsx("div",{className:"text-matrix-green mb-2",children:"CLEARANCE: LEVEL_9"}),e.jsx("div",{className:"text-matrix-green/60",children:"PERMISSIONS: FULL_ACCESS"}),e.jsx("div",{className:"text-matrix-green/60 mt-4",children:"[ WELCOME_TO_THE_MATRIX ]"})]})]})]})})})]})],parameters:{layout:"fullscreen"}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    isAuthenticated: false,
    user: null
  }
}`,...r.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    isAuthenticated: true,
    user: {
      name: 'MATRIX_USER_001',
      email: 'agent@matrix.net'
    }
  }
}`,...n.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    isAuthenticated: true,
    user: {
      name: 'CIPHER',
      email: 'cipher@cryptowebb.net'
    },
    showNav: false
  },
  decorators: [Story => <div className="min-h-screen bg-black">
        <Story />
        <div className="pt-20 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-matrix-green font-mono text-center mb-8">
              <h1 className="text-3xl font-bold uppercase tracking-wider mb-4">
                MATRIX TERMINAL ACCESS
              </h1>
              <div className="text-matrix-green/60 text-sm">
                [ AUTHENTICATION_SUCCESSFUL ]
              </div>
            </div>
            <div className="bg-black border border-matrix-green/30 p-6">
              <div className="text-matrix-green font-mono text-sm">
                {'> '}Accessing encrypted blockchain data...
              </div>
            </div>
          </div>
        </div>
      </div>]
}`,...i.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    isAuthenticated: true,
    user: {
      name: 'NEO',
      email: 'neo@matrix.net'
    }
  },
  decorators: [Story => <div className="min-h-screen bg-black relative overflow-hidden">
        {/* Matrix background effect */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full bg-[linear-gradient(rgba(0,255,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        </div>
        
        <Story />
        
        <div className="relative z-10 pt-24 px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="bg-black border border-matrix-green/30 p-6">
                <h3 className="text-matrix-green font-mono font-bold uppercase text-lg mb-4">
                  SYSTEM STATUS
                </h3>
                <div className="space-y-2 text-sm font-mono">
                  <div className="flex justify-between">
                    <span className="text-matrix-green/60">CONNECTION:</span>
                    <span className="text-matrix-green">SECURE</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-matrix-green/60">ENCRYPTION:</span>
                    <span className="text-matrix-green">AES-256</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-matrix-green/60">LATENCY:</span>
                    <span className="text-matrix-green">12ms</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-black border border-matrix-green/30 p-6">
                <h3 className="text-matrix-green font-mono font-bold uppercase text-lg mb-4">
                  ACTIVE PROTOCOLS
                </h3>
                <div className="space-y-2 text-sm font-mono text-matrix-green/60">
                  <div>• BLOCKCHAIN_ANALYSIS_v3.1</div>
                  <div>• REAL_TIME_MONITORING</div>
                  <div>• THREAT_DETECTION_AI</div>
                  <div>• QUANTUM_ENCRYPTION</div>
                </div>
              </div>
              
              <div className="bg-black border border-matrix-green/30 p-6">
                <h3 className="text-matrix-green font-mono font-bold uppercase text-lg mb-4">
                  USER ACCESS
                </h3>
                <div className="text-sm font-mono">
                  <div className="text-matrix-green mb-2">CLEARANCE: LEVEL_9</div>
                  <div className="text-matrix-green/60">PERMISSIONS: FULL_ACCESS</div>
                  <div className="text-matrix-green/60 mt-4">
                    [ WELCOME_TO_THE_MATRIX ]
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>],
  parameters: {
    layout: 'fullscreen'
  }
}`,...l.parameters?.docs?.source}}};const b=["UnauthenticatedUser","AuthenticatedUser","CompactHeader","FullScreenMatrix"];export{n as AuthenticatedUser,i as CompactHeader,l as FullScreenMatrix,r as UnauthenticatedUser,b as __namedExportsOrder,h as default};
