import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{R as b}from"./iframe-BIPmi7o-.js";const s=({variant:x="matrix",size:N="default",userTier:p="free",dashboardTitle:E="DASHBOARD",onExportStart:_=()=>console.log("◈ Export protocol initiated"),onExportComplete:T=()=>console.log("◈ Export protocol completed"),className:j=""})=>{const[m,v]=b.useState(!1),[g,f]=b.useState(!1),[h,u]=b.useState(!1),C=[{value:"png",label:"QUANTUM_IMAGE",icon:"◢",format:"PNG_MATRIX",restricted:!1},{value:"pdf",label:"NEURAL_DOCUMENT",icon:"◈",format:"PDF_CORE",restricted:!1},{value:"svg",label:"VECTOR_STREAM",icon:"⬡",format:"SVG_NET",restricted:p==="free"},{value:"csv",label:"DATA_MATRIX",icon:"◣",format:"CSV_GRID",restricted:!1}],S=async t=>{v(!0),f(!1),_(),console.log("◈ MATRIX EXPORT PROTOCOL INITIATED:",t),await new Promise(w=>setTimeout(w,2500)),v(!1),T(),console.log("◈ EXPORT PROTOCOL COMPLETED")},k=`
    relative inline-flex items-center justify-center
    font-mono font-bold tracking-[0.15em] uppercase
    transition-all duration-300 ease-out cursor-pointer
    focus:outline-none focus:ring-2 focus:ring-[#00ff00]/50 focus:ring-offset-2 focus:ring-offset-black
    disabled:pointer-events-none disabled:opacity-30
    select-none overflow-hidden group
    transform-gpu backface-visibility-hidden
  `,A={matrix:`
      bg-black border-2 border-[#00ff00] text-[#00ff00]
      shadow-[0_0_20px_rgba(0,255,0,0.3),inset_0_0_20px_rgba(0,255,0,0.1)]
      hover:shadow-[0_0_30px_rgba(0,255,0,0.6),inset_0_0_30px_rgba(0,255,0,0.2)]
      before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-[#00ff00]/15 before:to-transparent
      before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700
    `,stealth:`
      bg-[#001100] border border-[#00ff00]/40 text-[#00ff00]/80
      hover:border-[#00ff00] hover:text-[#00ff00] hover:bg-[#002200]
      hover:shadow-[0_0_15px_rgba(0,255,0,0.3)]
    `},R={sm:"h-10 px-4 text-xs min-w-[140px]",default:"h-12 px-6 text-sm min-w-[160px]",lg:"h-16 px-8 text-base min-w-[200px]"};return e.jsxs("div",{className:`relative ${j}`,children:[e.jsxs("button",{onClick:()=>f(!g),disabled:m,onMouseEnter:()=>u(!0),onMouseLeave:()=>u(!1),className:`
          ${k}
          ${A[x]}
          ${R[N]}
        `,title:"Matrix Dashboard Export Protocol",children:[e.jsxs("div",{className:"absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",children:[e.jsx("div",{className:"absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_3px,rgba(0,255,0,0.02)_3px,rgba(0,255,0,0.02)_6px)]"}),e.jsx("div",{className:"absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_3px,rgba(0,255,0,0.02)_3px,rgba(0,255,0,0.02)_6px)]"})]}),e.jsxs("div",{className:"absolute top-1 left-1 w-4 h-4",children:[e.jsx("div",{className:"absolute top-0 left-0 w-full h-0.5 bg-current group-hover:shadow-[0_0_4px_currentColor] transition-all duration-300"}),e.jsx("div",{className:"absolute top-0 left-0 w-0.5 h-full bg-current group-hover:shadow-[0_0_4px_currentColor] transition-all duration-300"})]}),e.jsxs("div",{className:"absolute bottom-1 right-1 w-4 h-4",children:[e.jsx("div",{className:"absolute bottom-0 right-0 w-full h-0.5 bg-current group-hover:shadow-[0_0_4px_currentColor] transition-all duration-300"}),e.jsx("div",{className:"absolute bottom-0 right-0 w-0.5 h-full bg-current group-hover:shadow-[0_0_4px_currentColor] transition-all duration-300"})]}),e.jsx("div",{className:"relative z-10 flex items-center justify-center gap-3",children:m?e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"w-5 h-5 border-2 border-current border-t-transparent animate-spin"}),e.jsx("span",{className:"tracking-[0.2em] drop-shadow-[0_0_6px_currentColor]",children:"EXPORTING"})]}):e.jsxs(e.Fragment,{children:[e.jsx("span",{className:`text-lg transition-all duration-300 ${h?"scale-110 animate-pulse":""}`,children:"⬇"}),e.jsxs("span",{className:"tracking-[0.15em] drop-shadow-[0_0_6px_currentColor]",children:["EXPORT_",E]}),h&&e.jsx("span",{className:"text-xs opacity-80 animate-pulse",children:"▼"})]})}),e.jsx("div",{className:"absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-current/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"})]}),g&&e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"fixed inset-0 z-10",onClick:()=>f(!1)}),e.jsxs("div",{className:"absolute right-0 top-full mt-2 w-80 bg-black border-2 border-[#00ff00] shadow-[0_0_30px_rgba(0,255,0,0.4)] z-20 overflow-hidden",children:[e.jsx("div",{className:"absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_8px,rgba(0,255,0,0.01)_8px,rgba(0,255,0,0.01)_10px)] opacity-50"}),e.jsx("div",{className:"absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_8px,rgba(0,255,0,0.01)_8px,rgba(0,255,0,0.01)_10px)] opacity-50"}),e.jsxs("div",{className:"absolute top-1 left-1 w-5 h-5",children:[e.jsx("div",{className:"absolute top-0 left-0 w-full h-0.5 bg-[#00ff00] shadow-[0_0_4px_#00ff00]"}),e.jsx("div",{className:"absolute top-0 left-0 w-0.5 h-full bg-[#00ff00] shadow-[0_0_4px_#00ff00]"})]}),e.jsxs("div",{className:"absolute bottom-1 right-1 w-5 h-5",children:[e.jsx("div",{className:"absolute bottom-0 right-0 w-full h-0.5 bg-[#00ff00] shadow-[0_0_4px_#00ff00]"}),e.jsx("div",{className:"absolute bottom-0 right-0 w-0.5 h-full bg-[#00ff00] shadow-[0_0_4px_#00ff00]"})]}),e.jsxs("div",{className:"relative z-10 p-6",children:[e.jsx("div",{className:"text-[#00ff00] font-mono font-bold uppercase tracking-[0.2em] text-sm mb-6 border-b-2 border-[#00ff00] pb-3",children:"◈ EXPORT_PROTOCOLS"}),e.jsx("div",{className:"space-y-3",children:C.map(t=>e.jsxs("button",{onClick:()=>S(t.value),disabled:m||t.restricted,className:`
                      w-full flex items-center justify-between p-4
                      bg-black border border-[#00ff00]/30 text-[#00ff00]
                      hover:bg-[#00ff00]/5 hover:border-[#00ff00] hover:shadow-[0_0_10px_rgba(0,255,0,0.3)]
                      font-mono transition-all duration-300 group
                      disabled:opacity-30 relative overflow-hidden
                    `,children:[e.jsx("div",{className:"absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-out bg-gradient-to-r from-transparent via-[#00ff00]/10 to-transparent"}),e.jsxs("div",{className:"relative flex items-center gap-4",children:[e.jsx("span",{className:"text-xl text-[#00ff00]/80 group-hover:text-[#00ff00] transition-colors duration-300 drop-shadow-[0_0_4px_currentColor]",children:t.icon}),e.jsxs("div",{className:"text-left",children:[e.jsx("div",{className:"text-sm font-bold tracking-[0.1em]",children:t.label}),e.jsx("div",{className:"text-xs text-[#00ff00]/60 tracking-wider",children:t.format}),t.restricted&&e.jsx("div",{className:"text-xs text-[#ff0040] tracking-wider",children:"TIER_UPGRADE_REQUIRED"})]})]}),e.jsx("span",{className:"text-xs opacity-60 font-bold tracking-wider",children:t.value.toUpperCase()})]},t.value))}),e.jsx("div",{className:"mt-6 pt-4 border-t border-[#00ff00]/30",children:e.jsxs("div",{className:"flex justify-between text-xs text-[#00ff00]/60 font-mono tracking-wider",children:[e.jsxs("span",{children:["TIER: ",p.toUpperCase()]}),e.jsxs("span",{children:["QUALITY: ",p==="free"?"STANDARD":"QUANTUM"]})]})})]})]})]})]})},I={title:"UI/ExportButton",component:s,parameters:{layout:"padded",backgrounds:{default:"dark",values:[{name:"dark",value:"#000000"}]}},decorators:[x=>e.jsxs("div",{className:"min-h-[400px] bg-black p-6",children:[e.jsxs("div",{id:"sample-dashboard",className:"mb-6 p-4 border border-matrix-green/30 rounded",children:[e.jsx("h3",{className:"text-matrix-green text-lg mb-2",children:"Sample Dashboard"}),e.jsx("p",{className:"text-matrix-green/70",children:"This represents a dashboard that can be exported"})]}),e.jsx(x,{})]})]},r=()=>console.log("◈ Matrix export protocol initiated"),a=()=>console.log("◈ Export protocol completed"),o={args:{dashboardTitle:"CRYPTO_DASHBOARD",variant:"matrix",userTier:"free",onExportStart:r,onExportComplete:a}},n={args:{dashboardTitle:"STEALTH_ANALYTICS",variant:"stealth",userTier:"pro",onExportStart:r,onExportComplete:a}},i={render:()=>e.jsxs("div",{className:"flex gap-8 items-end p-8 bg-black",children:[e.jsxs("div",{className:"text-center",children:[e.jsx(s,{size:"sm",dashboardTitle:"SMALL",onExportStart:r,onExportComplete:a}),e.jsx("div",{className:"text-[#00ff00]/60 text-xs font-mono mt-2",children:"sm"})]}),e.jsxs("div",{className:"text-center",children:[e.jsx(s,{size:"default",dashboardTitle:"DEFAULT",onExportStart:r,onExportComplete:a}),e.jsx("div",{className:"text-[#00ff00]/60 text-xs font-mono mt-2",children:"default"})]}),e.jsxs("div",{className:"text-center",children:[e.jsx(s,{size:"lg",dashboardTitle:"LARGE",onExportStart:r,onExportComplete:a}),e.jsx("div",{className:"text-[#00ff00]/60 text-xs font-mono mt-2",children:"lg"})]})]})},l={args:{dashboardTitle:"FREE_DASHBOARD",variant:"matrix",userTier:"free",onExportStart:r,onExportComplete:a}},d={args:{dashboardTitle:"PRO_DASHBOARD",variant:"matrix",userTier:"pro",onExportStart:r,onExportComplete:a}},c={render:()=>e.jsx("div",{className:"min-h-screen bg-black p-8",children:e.jsx("div",{className:"max-w-6xl mx-auto",children:e.jsxs("div",{className:"bg-black border-2 border-[#00ff00]/30 p-8 relative overflow-hidden",children:[e.jsx("div",{className:"absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_20px,rgba(0,255,0,0.01)_20px,rgba(0,255,0,0.01)_22px)] opacity-40"}),e.jsx("div",{className:"absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_20px,rgba(0,255,0,0.01)_20px,rgba(0,255,0,0.01)_22px)] opacity-40"}),e.jsxs("div",{className:"relative z-10",children:[e.jsxs("div",{className:"flex justify-between items-center mb-8",children:[e.jsxs("div",{children:[e.jsx("h2",{className:"text-[#00ff00] text-2xl font-mono font-bold tracking-[0.2em] mb-2",children:"◈ DASHBOARD_CONTROL_MATRIX"}),e.jsx("div",{className:"text-[#00ff00]/60 font-mono text-sm tracking-wider",children:"[ REAL_TIME_EXPORT_PROTOCOLS ]"})]}),e.jsx(s,{dashboardTitle:"ANALYTICS",variant:"matrix",size:"lg",userTier:"pro",onExportStart:r,onExportComplete:a})]}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-8",children:[e.jsxs("div",{className:"bg-black border border-[#00ff00]/20 p-6",children:[e.jsx("h3",{className:"text-[#00ff00] font-mono font-bold text-lg mb-4 uppercase tracking-wider",children:"CRYPTO_METRICS"}),e.jsxs("div",{className:"space-y-2 text-sm font-mono text-[#00ff00]/70",children:[e.jsx("div",{children:"• BTC_PRICE: $45,832.50"}),e.jsx("div",{children:"• ETH_VOLUME: 1.2M"}),e.jsx("div",{children:"• MARKET_CAP: $2.1T"})]})]}),e.jsxs("div",{className:"bg-black border border-[#00ff00]/20 p-6",children:[e.jsx("h3",{className:"text-[#00ff00] font-mono font-bold text-lg mb-4 uppercase tracking-wider",children:"SYSTEM_STATUS"}),e.jsxs("div",{className:"space-y-2 text-sm font-mono text-[#00ff00]/70",children:[e.jsx("div",{children:"• UPTIME: 99.97%"}),e.jsx("div",{children:"• LATENCY: 0.08ms"}),e.jsx("div",{children:"• CONNECTIONS: 2,847"})]})]}),e.jsxs("div",{className:"bg-black border border-[#00ff00]/20 p-6",children:[e.jsx("h3",{className:"text-[#00ff00] font-mono font-bold text-lg mb-4 uppercase tracking-wider",children:"EXPORT_OPTIONS"}),e.jsx("div",{className:"space-y-3",children:e.jsx(s,{dashboardTitle:"METRICS",variant:"stealth",size:"sm",userTier:"free",onExportStart:r,onExportComplete:a})})]})]}),e.jsx("div",{className:"mt-8 pt-6 border-t border-[#00ff00]/30",children:e.jsxs("div",{className:"flex justify-between text-sm font-mono text-[#00ff00]/60",children:[e.jsx("span",{children:"STATUS: QUANTUM_CONNECTED"}),e.jsx("span",{children:"EXPORTS: 1,247,329"}),e.jsx("span",{children:"SECURITY: MAXIMUM"})]})})]})]})})})};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    dashboardTitle: 'CRYPTO_DASHBOARD',
    variant: 'matrix',
    userTier: 'free',
    onExportStart: mockExportHandler,
    onExportComplete: mockCompleteHandler
  }
}`,...o.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    dashboardTitle: 'STEALTH_ANALYTICS',
    variant: 'stealth',
    userTier: 'pro',
    onExportStart: mockExportHandler,
    onExportComplete: mockCompleteHandler
  }
}`,...n.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex gap-8 items-end p-8 bg-black">
      <div className="text-center">
        <CyberpunkExportButton size="sm" dashboardTitle="SMALL" onExportStart={mockExportHandler} onExportComplete={mockCompleteHandler} />
        <div className="text-[#00ff00]/60 text-xs font-mono mt-2">sm</div>
      </div>
      <div className="text-center">
        <CyberpunkExportButton size="default" dashboardTitle="DEFAULT" onExportStart={mockExportHandler} onExportComplete={mockCompleteHandler} />
        <div className="text-[#00ff00]/60 text-xs font-mono mt-2">default</div>
      </div>
      <div className="text-center">
        <CyberpunkExportButton size="lg" dashboardTitle="LARGE" onExportStart={mockExportHandler} onExportComplete={mockCompleteHandler} />
        <div className="text-[#00ff00]/60 text-xs font-mono mt-2">lg</div>
      </div>
    </div>
}`,...i.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    dashboardTitle: 'FREE_DASHBOARD',
    variant: 'matrix',
    userTier: 'free',
    onExportStart: mockExportHandler,
    onExportComplete: mockCompleteHandler
  }
}`,...l.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    dashboardTitle: 'PRO_DASHBOARD',
    variant: 'matrix',
    userTier: 'pro',
    onExportStart: mockExportHandler,
    onExportComplete: mockCompleteHandler
  }
}`,...d.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <div className="min-h-screen bg-black p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-black border-2 border-[#00ff00]/30 p-8 relative overflow-hidden">
          {/* Matrix grid background */}
          <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_20px,rgba(0,255,0,0.01)_20px,rgba(0,255,0,0.01)_22px)] opacity-40" />
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_20px,rgba(0,255,0,0.01)_20px,rgba(0,255,0,0.01)_22px)] opacity-40" />
          
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-[#00ff00] text-2xl font-mono font-bold tracking-[0.2em] mb-2">
                  ◈ DASHBOARD_CONTROL_MATRIX
                </h2>
                <div className="text-[#00ff00]/60 font-mono text-sm tracking-wider">
                  [ REAL_TIME_EXPORT_PROTOCOLS ]
                </div>
              </div>
              <CyberpunkExportButton dashboardTitle="ANALYTICS" variant="matrix" size="lg" userTier="pro" onExportStart={mockExportHandler} onExportComplete={mockCompleteHandler} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-black border border-[#00ff00]/20 p-6">
                <h3 className="text-[#00ff00] font-mono font-bold text-lg mb-4 uppercase tracking-wider">
                  CRYPTO_METRICS
                </h3>
                <div className="space-y-2 text-sm font-mono text-[#00ff00]/70">
                  <div>• BTC_PRICE: $45,832.50</div>
                  <div>• ETH_VOLUME: 1.2M</div>
                  <div>• MARKET_CAP: $2.1T</div>
                </div>
              </div>
              
              <div className="bg-black border border-[#00ff00]/20 p-6">
                <h3 className="text-[#00ff00] font-mono font-bold text-lg mb-4 uppercase tracking-wider">
                  SYSTEM_STATUS
                </h3>
                <div className="space-y-2 text-sm font-mono text-[#00ff00]/70">
                  <div>• UPTIME: 99.97%</div>
                  <div>• LATENCY: 0.08ms</div>
                  <div>• CONNECTIONS: 2,847</div>
                </div>
              </div>
              
              <div className="bg-black border border-[#00ff00]/20 p-6">
                <h3 className="text-[#00ff00] font-mono font-bold text-lg mb-4 uppercase tracking-wider">
                  EXPORT_OPTIONS
                </h3>
                <div className="space-y-3">
                  <CyberpunkExportButton dashboardTitle="METRICS" variant="stealth" size="sm" userTier="free" onExportStart={mockExportHandler} onExportComplete={mockCompleteHandler} />
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-[#00ff00]/30">
              <div className="flex justify-between text-sm font-mono text-[#00ff00]/60">
                <span>STATUS: QUANTUM_CONNECTED</span>
                <span>EXPORTS: 1,247,329</span>
                <span>SECURITY: MAXIMUM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
}`,...c.parameters?.docs?.source}}};const y=["MatrixExport","StealthMode","AllSizes","FreeTier","ProTier","MatrixDashboardInterface"];export{i as AllSizes,l as FreeTier,c as MatrixDashboardInterface,o as MatrixExport,d as ProTier,n as StealthMode,y as __namedExportsOrder,I as default};
