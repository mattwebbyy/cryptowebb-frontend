import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{R as u}from"./iframe-lSEetYu3.js";const t=({onClick:a=()=>console.log("◀ MATRIX NAVIGATION: PREVIOUS_SECTOR"),className:v="",variant:b="quantum",size:g="default",disabled:N=!1})=>{const[x,f]=u.useState(!1),[h,p]=u.useState(!1),_=`
    relative inline-flex items-center justify-center gap-3
    font-mono font-bold text-sm tracking-[0.15em] uppercase
    transition-all duration-300 ease-out cursor-pointer
    focus:outline-none focus:ring-2 focus:ring-[#00ff00]/50 focus:ring-offset-2 focus:ring-offset-black
    disabled:pointer-events-none disabled:opacity-30
    select-none overflow-hidden group
    transform-gpu backface-visibility-hidden
  `,j={quantum:`
      bg-black border-2 border-[#00ff00] text-[#00ff00]
      shadow-[0_0_15px_rgba(0,255,0,0.3),inset_0_0_15px_rgba(0,255,0,0.1)]
      hover:shadow-[0_0_25px_rgba(0,255,0,0.6),inset_0_0_25px_rgba(0,255,0,0.2)]
      before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-[#00ff00]/15 before:to-transparent
      before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-600
    `,stealth:`
      bg-[#001100] border border-[#00ff00]/40 text-[#00ff00]/80
      hover:border-[#00ff00] hover:text-[#00ff00] hover:bg-[#002200]
      hover:shadow-[0_0_12px_rgba(0,255,0,0.3)]
    `,danger:`
      bg-black border-2 border-[#ff0040] text-[#ff0040]
      shadow-[0_0_15px_rgba(255,0,64,0.3),inset_0_0_15px_rgba(255,0,64,0.1)]
      hover:shadow-[0_0_25px_rgba(255,0,64,0.6),inset_0_0_25px_rgba(255,0,64,0.2)]
      before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-[#ff0040]/15 before:to-transparent
      before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-600
    `,minimal:`
      bg-transparent border border-[#00ff00]/20 text-[#00ff00]/60
      hover:border-[#00ff00]/60 hover:text-[#00ff00] hover:bg-[#00ff00]/5
    `},E={sm:"h-10 px-4 text-xs min-w-[100px]",default:"h-12 px-6 text-sm min-w-[120px]",lg:"h-16 px-8 text-base min-w-[160px]"};return e.jsxs("button",{onClick:a,disabled:N,onMouseEnter:()=>f(!0),onMouseLeave:()=>f(!1),onMouseDown:()=>p(!0),onMouseUp:()=>p(!1),className:`
        ${_}
        ${j[b]}
        ${E[g]}
        ${v}
      `,children:[e.jsxs("div",{className:"absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400",children:[e.jsx("div",{className:"absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_3px,rgba(0,255,0,0.02)_3px,rgba(0,255,0,0.02)_6px)]"}),e.jsx("div",{className:"absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_3px,rgba(0,255,0,0.02)_3px,rgba(0,255,0,0.02)_6px)]"})]}),e.jsxs("div",{className:"absolute top-1 left-1 w-5 h-5",children:[e.jsx("div",{className:"absolute top-0 left-0 w-full h-0.5 bg-current group-hover:shadow-[0_0_4px_currentColor] transition-all duration-300"}),e.jsx("div",{className:"absolute top-0 left-0 w-0.5 h-full bg-current group-hover:shadow-[0_0_4px_currentColor] transition-all duration-300"}),e.jsx("div",{className:"absolute top-1 left-1 w-2 h-px bg-current/50"}),e.jsx("div",{className:"absolute top-1 left-1 w-px h-2 bg-current/50"})]}),e.jsxs("div",{className:"absolute top-1 right-1 w-5 h-5",children:[e.jsx("div",{className:"absolute top-0 right-0 w-full h-0.5 bg-current group-hover:shadow-[0_0_4px_currentColor] transition-all duration-300"}),e.jsx("div",{className:"absolute top-0 right-0 w-0.5 h-full bg-current group-hover:shadow-[0_0_4px_currentColor] transition-all duration-300"}),e.jsx("div",{className:"absolute top-1 right-1 w-2 h-px bg-current/50"}),e.jsx("div",{className:"absolute top-1 right-1 w-px h-2 bg-current/50"})]}),e.jsxs("div",{className:"absolute bottom-1 left-1 w-5 h-5",children:[e.jsx("div",{className:"absolute bottom-0 left-0 w-full h-0.5 bg-current group-hover:shadow-[0_0_4px_currentColor] transition-all duration-300"}),e.jsx("div",{className:"absolute bottom-0 left-0 w-0.5 h-full bg-current group-hover:shadow-[0_0_4px_currentColor] transition-all duration-300"}),e.jsx("div",{className:"absolute bottom-1 left-1 w-2 h-px bg-current/50"}),e.jsx("div",{className:"absolute bottom-1 left-1 w-px h-2 bg-current/50"})]}),e.jsxs("div",{className:"absolute bottom-1 right-1 w-5 h-5",children:[e.jsx("div",{className:"absolute bottom-0 right-0 w-full h-0.5 bg-current group-hover:shadow-[0_0_4px_currentColor] transition-all duration-300"}),e.jsx("div",{className:"absolute bottom-0 right-0 w-0.5 h-full bg-current group-hover:shadow-[0_0_4px_currentColor] transition-all duration-300"}),e.jsx("div",{className:"absolute bottom-1 right-1 w-2 h-px bg-current/50"}),e.jsx("div",{className:"absolute bottom-1 right-1 w-px h-2 bg-current/50"})]}),e.jsx("div",{className:`absolute inset-0 bg-current/10 transition-all duration-150 ${h?"opacity-100 scale-95":"opacity-0 scale-100"}`}),e.jsx("div",{className:`relative transition-all duration-300 ${x?"-translate-x-1 scale-110":"translate-x-0 scale-100"}`,children:e.jsxs("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",className:"drop-shadow-[0_0_6px_currentColor]",children:[e.jsx("path",{d:"M19 12H5M5 12L12 19M5 12L12 5",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"square",strokeLinejoin:"miter"}),e.jsx("path",{d:"M15 12H3M3 12L8 17M3 12L8 7",stroke:"currentColor",strokeWidth:"1",strokeLinecap:"square",strokeLinejoin:"miter",opacity:"0.4"})]})}),e.jsx("span",{className:"relative z-10 tracking-[0.15em] drop-shadow-[0_0_6px_currentColor]",children:"BACK"}),e.jsx("div",{className:"absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-current/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"}),x&&e.jsx("div",{className:"absolute inset-0 bg-current/5 animate-pulse"})]})},C={title:"UI/BackButton",component:t,parameters:{layout:"fullscreen"},decorators:[a=>e.jsx("div",{className:"min-h-screen bg-black",children:e.jsx(a,{})})]},s={args:{variant:"quantum",size:"default"}},r={args:{variant:"stealth",size:"default"}},n={args:{variant:"danger",size:"default"}},i={args:{variant:"minimal",size:"default"}},o={render:()=>e.jsxs("div",{className:"flex gap-8 items-end p-8 bg-black",children:[e.jsxs("div",{className:"text-center",children:[e.jsx(t,{size:"sm"}),e.jsx("div",{className:"text-[#00ff00]/60 text-xs font-mono mt-2",children:"sm"})]}),e.jsxs("div",{className:"text-center",children:[e.jsx(t,{size:"default"}),e.jsx("div",{className:"text-[#00ff00]/60 text-xs font-mono mt-2",children:"default"})]}),e.jsxs("div",{className:"text-center",children:[e.jsx(t,{size:"lg"}),e.jsx("div",{className:"text-[#00ff00]/60 text-xs font-mono mt-2",children:"lg"})]})]})},l={render:()=>e.jsxs("div",{className:"grid grid-cols-2 gap-6 p-8 bg-black max-w-2xl",children:[e.jsxs("div",{className:"text-center",children:[e.jsx(t,{variant:"quantum"}),e.jsx("div",{className:"text-[#00ff00]/60 text-xs font-mono mt-2 uppercase tracking-wider",children:"quantum"})]}),e.jsxs("div",{className:"text-center",children:[e.jsx(t,{variant:"stealth"}),e.jsx("div",{className:"text-[#00ff00]/60 text-xs font-mono mt-2 uppercase tracking-wider",children:"stealth"})]}),e.jsxs("div",{className:"text-center",children:[e.jsx(t,{variant:"danger"}),e.jsx("div",{className:"text-[#ff0040]/60 text-xs font-mono mt-2 uppercase tracking-wider",children:"danger"})]}),e.jsxs("div",{className:"text-center",children:[e.jsx(t,{variant:"minimal"}),e.jsx("div",{className:"text-[#00ff00]/60 text-xs font-mono mt-2 uppercase tracking-wider",children:"minimal"})]})]})},c={args:{onClick:()=>alert("◀ QUANTUM NAVIGATION: Returning to previous sector...")},render:a=>e.jsxs("div",{className:"min-h-screen bg-black flex flex-col relative overflow-hidden",children:[e.jsx("div",{className:"absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_40px,rgba(0,255,0,0.01)_40px,rgba(0,255,0,0.01)_42px)] opacity-30"}),e.jsx("div",{className:"absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_40px,rgba(0,255,0,0.01)_40px,rgba(0,255,0,0.01)_42px)] opacity-30"}),e.jsx("div",{className:"relative z-10 p-8",children:e.jsx(t,{...a,variant:"quantum"})}),e.jsx("div",{className:"flex-1 flex items-center justify-center",children:e.jsxs("div",{className:"text-center text-[#00ff00] max-w-2xl",children:[e.jsx("h1",{className:"text-4xl mb-6 font-mono font-bold uppercase tracking-[0.3em]",children:"◢◤ MATRIX INTERFACE ◥◣"}),e.jsx("p",{className:"text-[#00ff00]/70 font-mono text-lg tracking-wider mb-8",children:"Click the Quantum Navigation Button"}),e.jsx("div",{className:"p-6 border-2 border-[#00ff00]/30 bg-black/50",children:e.jsx("div",{className:"text-sm font-mono text-[#00ff00]/60 tracking-wider",children:"[ SECURE_QUANTUM_CONNECTION_ESTABLISHED ]"})})]})})]})},d={render:()=>e.jsxs("div",{className:"min-h-screen bg-black p-8",children:[e.jsxs("div",{className:"flex items-center justify-between mb-8",children:[e.jsx(t,{variant:"quantum",size:"lg"}),e.jsx("div",{className:"text-[#00ff00] font-mono text-sm tracking-wider",children:"[ SESSION_ID: QX7-4N9-M2P-8K1 ]"})]}),e.jsxs("div",{className:"max-w-6xl mx-auto",children:[e.jsxs("div",{className:"text-center mb-12",children:[e.jsx("h1",{className:"text-[#00ff00] font-mono text-3xl font-bold tracking-[0.2em] mb-4",children:"CRYPTOWEBB SECURITY TERMINAL"}),e.jsx("div",{className:"text-[#00ff00]/60 font-mono text-sm tracking-wider",children:"[ BLOCKCHAIN_ANALYSIS_PROTOCOL_v4.0 ]"}),e.jsx("div",{className:"w-full h-px bg-gradient-to-r from-transparent via-[#00ff00] to-transparent mt-4"})]}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-8",children:[e.jsxs("div",{className:"bg-black border-2 border-[#00ff00]/30 p-6",children:[e.jsx("h3",{className:"text-[#00ff00] font-mono font-bold text-lg mb-4 uppercase tracking-wider",children:"SYSTEM STATUS"}),e.jsxs("div",{className:"space-y-3 text-sm font-mono",children:[e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{className:"text-[#00ff00]/60",children:"ENCRYPTION:"}),e.jsx("span",{className:"text-[#00ff00]",children:"QUANTUM_AES_512"})]}),e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{className:"text-[#00ff00]/60",children:"FIREWALL:"}),e.jsx("span",{className:"text-[#00ff00]",children:"ACTIVE"})]}),e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{className:"text-[#00ff00]/60",children:"INTRUSION:"}),e.jsx("span",{className:"text-[#00ff00]",children:"NONE_DETECTED"})]})]})]}),e.jsxs("div",{className:"bg-black border-2 border-[#00ff00]/30 p-6",children:[e.jsx("h3",{className:"text-[#00ff00] font-mono font-bold text-lg mb-4 uppercase tracking-wider",children:"ACTIVE PROTOCOLS"}),e.jsxs("div",{className:"space-y-2 text-sm font-mono text-[#00ff00]/70",children:[e.jsx("div",{children:"• REAL_TIME_MONITORING"}),e.jsx("div",{children:"• THREAT_DETECTION_AI"}),e.jsx("div",{children:"• QUANTUM_ENCRYPTION"}),e.jsx("div",{children:"• NEURAL_DEFENSE_GRID"})]})]}),e.jsxs("div",{className:"bg-black border-2 border-[#00ff00]/30 p-6",children:[e.jsx("h3",{className:"text-[#00ff00] font-mono font-bold text-lg mb-4 uppercase tracking-wider",children:"NETWORK ACCESS"}),e.jsxs("div",{className:"text-sm font-mono",children:[e.jsx("div",{className:"text-[#00ff00] mb-2",children:"CLEARANCE: LEVEL_OMEGA"}),e.jsx("div",{className:"text-[#00ff00]/60",children:"PERMISSIONS: FULL_ACCESS"}),e.jsx("div",{className:"text-[#00ff00]/60 mt-4",children:"[ MATRIX_AUTHENTICATED ]"})]})]})]})]})]})},m={args:{variant:"danger",disabled:!0}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'quantum',
    size: 'default'
  }
}`,...s.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'stealth',
    size: 'default'
  }
}`,...r.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'danger',
    size: 'default'
  }
}`,...n.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'minimal',
    size: 'default'
  }
}`,...i.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex gap-8 items-end p-8 bg-black">
      <div className="text-center">
        <CyberpunkBackButton size="sm" />
        <div className="text-[#00ff00]/60 text-xs font-mono mt-2">sm</div>
      </div>
      <div className="text-center">
        <CyberpunkBackButton size="default" />
        <div className="text-[#00ff00]/60 text-xs font-mono mt-2">default</div>
      </div>
      <div className="text-center">
        <CyberpunkBackButton size="lg" />
        <div className="text-[#00ff00]/60 text-xs font-mono mt-2">lg</div>
      </div>
    </div>
}`,...o.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <div className="grid grid-cols-2 gap-6 p-8 bg-black max-w-2xl">
      <div className="text-center">
        <CyberpunkBackButton variant="quantum" />
        <div className="text-[#00ff00]/60 text-xs font-mono mt-2 uppercase tracking-wider">quantum</div>
      </div>
      <div className="text-center">
        <CyberpunkBackButton variant="stealth" />
        <div className="text-[#00ff00]/60 text-xs font-mono mt-2 uppercase tracking-wider">stealth</div>
      </div>
      <div className="text-center">
        <CyberpunkBackButton variant="danger" />
        <div className="text-[#ff0040]/60 text-xs font-mono mt-2 uppercase tracking-wider">danger</div>
      </div>
      <div className="text-center">
        <CyberpunkBackButton variant="minimal" />
        <div className="text-[#00ff00]/60 text-xs font-mono mt-2 uppercase tracking-wider">minimal</div>
      </div>
    </div>
}`,...l.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    onClick: () => alert('◀ QUANTUM NAVIGATION: Returning to previous sector...')
  },
  render: args => <div className="min-h-screen bg-black flex flex-col relative overflow-hidden">
      {/* Matrix rain background */}
      <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_40px,rgba(0,255,0,0.01)_40px,rgba(0,255,0,0.01)_42px)] opacity-30" />
      <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_40px,rgba(0,255,0,0.01)_40px,rgba(0,255,0,0.01)_42px)] opacity-30" />
      
      <div className="relative z-10 p-8">
        <CyberpunkBackButton {...args} variant="quantum" />
      </div>
      
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-[#00ff00] max-w-2xl">
          <h1 className="text-4xl mb-6 font-mono font-bold uppercase tracking-[0.3em]">
            ◢◤ MATRIX INTERFACE ◥◣
          </h1>
          <p className="text-[#00ff00]/70 font-mono text-lg tracking-wider mb-8">
            Click the Quantum Navigation Button
          </p>
          <div className="p-6 border-2 border-[#00ff00]/30 bg-black/50">
            <div className="text-sm font-mono text-[#00ff00]/60 tracking-wider">
              [ SECURE_QUANTUM_CONNECTION_ESTABLISHED ]
            </div>
          </div>
        </div>
      </div>
    </div>
}`,...c.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <div className="min-h-screen bg-black p-8">
      <div className="flex items-center justify-between mb-8">
        <CyberpunkBackButton variant="quantum" size="lg" />
        <div className="text-[#00ff00] font-mono text-sm tracking-wider">
          [ SESSION_ID: QX7-4N9-M2P-8K1 ]
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-[#00ff00] font-mono text-3xl font-bold tracking-[0.2em] mb-4">
            CRYPTOWEBB SECURITY TERMINAL
          </h1>
          <div className="text-[#00ff00]/60 font-mono text-sm tracking-wider">
            [ BLOCKCHAIN_ANALYSIS_PROTOCOL_v4.0 ]
          </div>
          <div className="w-full h-px bg-gradient-to-r from-transparent via-[#00ff00] to-transparent mt-4" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-black border-2 border-[#00ff00]/30 p-6">
            <h3 className="text-[#00ff00] font-mono font-bold text-lg mb-4 uppercase tracking-wider">
              SYSTEM STATUS
            </h3>
            <div className="space-y-3 text-sm font-mono">
              <div className="flex justify-between">
                <span className="text-[#00ff00]/60">ENCRYPTION:</span>
                <span className="text-[#00ff00]">QUANTUM_AES_512</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#00ff00]/60">FIREWALL:</span>
                <span className="text-[#00ff00]">ACTIVE</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#00ff00]/60">INTRUSION:</span>
                <span className="text-[#00ff00]">NONE_DETECTED</span>
              </div>
            </div>
          </div>
          
          <div className="bg-black border-2 border-[#00ff00]/30 p-6">
            <h3 className="text-[#00ff00] font-mono font-bold text-lg mb-4 uppercase tracking-wider">
              ACTIVE PROTOCOLS
            </h3>
            <div className="space-y-2 text-sm font-mono text-[#00ff00]/70">
              <div>• REAL_TIME_MONITORING</div>
              <div>• THREAT_DETECTION_AI</div>
              <div>• QUANTUM_ENCRYPTION</div>
              <div>• NEURAL_DEFENSE_GRID</div>
            </div>
          </div>
          
          <div className="bg-black border-2 border-[#00ff00]/30 p-6">
            <h3 className="text-[#00ff00] font-mono font-bold text-lg mb-4 uppercase tracking-wider">
              NETWORK ACCESS
            </h3>
            <div className="text-sm font-mono">
              <div className="text-[#00ff00] mb-2">CLEARANCE: LEVEL_OMEGA</div>
              <div className="text-[#00ff00]/60">PERMISSIONS: FULL_ACCESS</div>
              <div className="text-[#00ff00]/60 mt-4">
                [ MATRIX_AUTHENTICATED ]
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
}`,...d.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'danger',
    disabled: true
  }
}`,...m.parameters?.docs?.source}}};const T=["QuantumNavigation","StealthMode","DangerAlert","MinimalInterface","AllSizes","AllVariants","InteractiveDemo","CyberSecurityDashboard","DisabledState"];export{o as AllSizes,l as AllVariants,d as CyberSecurityDashboard,n as DangerAlert,m as DisabledState,c as InteractiveDemo,i as MinimalInterface,s as QuantumNavigation,r as StealthMode,T as __namedExportsOrder,C as default};
