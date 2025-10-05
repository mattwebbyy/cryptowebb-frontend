import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{R as u}from"./iframe-lSEetYu3.js";const a=({children:f="EXECUTE",variant:b="matrix",size:v="default",isLoading:x=!1,disabled:h=!1,className:N="",..._})=>{const[E,m]=u.useState(!1),[C,g]=u.useState(!1),j=`
    relative inline-flex items-center justify-center
    font-mono font-bold text-sm tracking-[0.2em] uppercase
    transition-all duration-300 ease-out cursor-pointer
    focus:outline-none focus:ring-2 focus:ring-[#00ff00]/50 focus:ring-offset-2 focus:ring-offset-black
    disabled:pointer-events-none disabled:opacity-30
    select-none overflow-hidden group
    transform-gpu backface-visibility-hidden perspective-1000
  `,y={matrix:`
      bg-black border-2 border-[#00ff00] text-[#00ff00]
      shadow-[0_0_20px_rgba(0,255,0,0.3),inset_0_0_20px_rgba(0,255,0,0.1)]
      hover:shadow-[0_0_30px_rgba(0,255,0,0.6),inset_0_0_30px_rgba(0,255,0,0.2)]
      hover:text-[#00ff00] hover:border-[#00ff00]
      active:shadow-[0_0_40px_rgba(0,255,0,0.8),inset_0_0_40px_rgba(0,255,0,0.3)]
      before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-[#00ff00]/20 before:to-transparent
      before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700
    `,primary:`
      bg-[#00ff00] border-2 border-[#00ff00] text-black
      shadow-[0_0_25px_rgba(0,255,0,0.5)]
      hover:bg-[#00cc00] hover:shadow-[0_0_35px_rgba(0,255,0,0.7)]
      active:bg-[#009900] active:shadow-[0_0_45px_rgba(0,255,0,0.9)]
    `,danger:`
      bg-black border-2 border-[#ff0040] text-[#ff0040]
      shadow-[0_0_20px_rgba(255,0,64,0.3),inset_0_0_20px_rgba(255,0,64,0.1)]
      hover:shadow-[0_0_30px_rgba(255,0,64,0.6),inset_0_0_30px_rgba(255,0,64,0.2)]
      before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-[#ff0040]/20 before:to-transparent
      before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700
    `,ghost:`
      bg-transparent border border-[#00ff00]/30 text-[#00ff00]/70
      hover:border-[#00ff00] hover:text-[#00ff00] hover:bg-[#00ff00]/5
      hover:shadow-[0_0_15px_rgba(0,255,0,0.3)]
    `,stealth:`
      bg-[#001100] border border-[#00ff00]/20 text-[#00ff00]/60
      hover:border-[#00ff00]/60 hover:text-[#00ff00]/90 hover:bg-[#002200]
      hover:shadow-[0_0_10px_rgba(0,255,0,0.2)]
    `},T={sm:"h-8 px-4 text-xs min-w-[80px]",default:"h-12 px-8 text-sm min-w-[120px]",lg:"h-16 px-12 text-base min-w-[160px]",xl:"h-20 px-16 text-lg min-w-[200px]"};return e.jsxs("button",{className:`
        ${j}
        ${y[b]}
        ${T[v]}
        ${N}
      `,disabled:x||h,onMouseEnter:()=>m(!0),onMouseLeave:()=>m(!1),onMouseDown:()=>g(!0),onMouseUp:()=>g(!1),..._,children:[e.jsxs("div",{className:"absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",children:[e.jsx("div",{className:"absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,rgba(0,255,0,0.03)_2px,rgba(0,255,0,0.03)_4px)] animate-pulse"}),e.jsx("div",{className:"absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,255,0,0.03)_2px,rgba(0,255,0,0.03)_4px)]"})]}),e.jsx("div",{className:"absolute inset-0 bg-gradient-to-b from-transparent via-[#00ff00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"}),e.jsxs("div",{className:"absolute top-0 left-0 w-4 h-4",children:[e.jsx("div",{className:"absolute top-0 left-0 w-full h-0.5 bg-[#00ff00] group-hover:shadow-[0_0_5px_#00ff00]"}),e.jsx("div",{className:"absolute top-0 left-0 w-0.5 h-full bg-[#00ff00] group-hover:shadow-[0_0_5px_#00ff00]"})]}),e.jsxs("div",{className:"absolute top-0 right-0 w-4 h-4",children:[e.jsx("div",{className:"absolute top-0 right-0 w-full h-0.5 bg-[#00ff00] group-hover:shadow-[0_0_5px_#00ff00]"}),e.jsx("div",{className:"absolute top-0 right-0 w-0.5 h-full bg-[#00ff00] group-hover:shadow-[0_0_5px_#00ff00]"})]}),e.jsxs("div",{className:"absolute bottom-0 left-0 w-4 h-4",children:[e.jsx("div",{className:"absolute bottom-0 left-0 w-full h-0.5 bg-[#00ff00] group-hover:shadow-[0_0_5px_#00ff00]"}),e.jsx("div",{className:"absolute bottom-0 left-0 w-0.5 h-full bg-[#00ff00] group-hover:shadow-[0_0_5px_#00ff00]"})]}),e.jsxs("div",{className:"absolute bottom-0 right-0 w-4 h-4",children:[e.jsx("div",{className:"absolute bottom-0 right-0 w-full h-0.5 bg-[#00ff00] group-hover:shadow-[0_0_5px_#00ff00]"}),e.jsx("div",{className:"absolute bottom-0 right-0 w-0.5 h-full bg-[#00ff00] group-hover:shadow-[0_0_5px_#00ff00]"})]}),e.jsx("div",{className:`absolute inset-0 bg-[#00ff00]/10 transition-all duration-150 ${C?"opacity-100 scale-95":"opacity-0 scale-100"}`}),e.jsx("div",{className:"relative z-10 flex items-center justify-center gap-3",children:x?e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"}),e.jsx("span",{className:"tracking-[0.3em]",children:"PROCESSING"})]}):e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"tracking-[0.2em] drop-shadow-[0_0_8px_currentColor]",children:f}),E&&e.jsx("span",{className:"text-xs opacity-80 animate-pulse tracking-wider",children:"▶"})]})}),e.jsx("div",{className:"absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#00ff00]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"}),e.jsx("div",{className:"absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#00ff00]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-200",style:{transform:"translateY(2px)"}})]})},w={title:"UI/Button",component:a,parameters:{layout:"centered"},argTypes:{variant:{control:"select",options:["matrix","primary","danger","ghost","stealth"]},size:{control:"select",options:["sm","default","lg","xl"]},isLoading:{control:"boolean"},disabled:{control:"boolean"}}},r={args:{children:"ACCESS MATRIX",variant:"matrix"}},t={args:{children:"EXECUTE PROTOCOL",variant:"primary"}},s={args:{children:"TERMINATE PROCESS",variant:"danger"}},n={args:{children:"STEALTH MODE",variant:"ghost"}},o={args:{children:"INFILTRATE SYSTEM",variant:"stealth"}},i={args:{children:"HACKING MAINFRAME",variant:"matrix",isLoading:!0}},l={args:{children:"ACCESS DENIED",variant:"danger",disabled:!0}},d={render:()=>e.jsxs("div",{className:"flex gap-6 items-end flex-wrap p-8 bg-black",children:[e.jsxs("div",{className:"text-center",children:[e.jsx(a,{size:"sm",children:"SMALL"}),e.jsx("div",{className:"text-[#00ff00]/60 text-xs font-mono mt-2",children:"sm"})]}),e.jsxs("div",{className:"text-center",children:[e.jsx(a,{size:"default",children:"DEFAULT"}),e.jsx("div",{className:"text-[#00ff00]/60 text-xs font-mono mt-2",children:"default"})]}),e.jsxs("div",{className:"text-center",children:[e.jsx(a,{size:"lg",children:"LARGE"}),e.jsx("div",{className:"text-[#00ff00]/60 text-xs font-mono mt-2",children:"lg"})]}),e.jsxs("div",{className:"text-center",children:[e.jsx(a,{size:"xl",children:"EXTRA LARGE"}),e.jsx("div",{className:"text-[#00ff00]/60 text-xs font-mono mt-2",children:"xl"})]})]})},c={render:()=>e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6 p-8 bg-black max-w-4xl",children:[e.jsx(a,{variant:"matrix",children:"BREACH FIREWALL"}),e.jsx(a,{variant:"primary",children:"INJECT PAYLOAD"}),e.jsx(a,{variant:"danger",children:"DESTROY EVIDENCE"}),e.jsx(a,{variant:"ghost",children:"GHOST PROTOCOL"}),e.jsx(a,{variant:"stealth",children:"SHADOW NETWORK"}),e.jsx(a,{variant:"matrix",isLoading:!0,children:"CRACKING ENCRYPTION"})]})},p={render:()=>e.jsxs("div",{className:"bg-black border-2 border-[#00ff00] p-12 max-w-2xl relative overflow-hidden",children:[e.jsx("div",{className:"absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_20px,rgba(0,255,0,0.03)_20px,rgba(0,255,0,0.03)_22px)] opacity-50"}),e.jsx("div",{className:"absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_20px,rgba(0,255,0,0.03)_20px,rgba(0,255,0,0.03)_22px)] opacity-50"}),e.jsxs("div",{className:"relative z-10",children:[e.jsxs("div",{className:"text-center mb-10",children:[e.jsx("h2",{className:"text-[#00ff00] font-mono text-2xl font-bold tracking-[0.3em] mb-4",children:"◢◤ MATRIX TERMINAL ◥◣"}),e.jsx("div",{className:"text-[#00ff00]/60 text-sm font-mono tracking-wider",children:"[ QUANTUM_ENCRYPTION_PROTOCOL_ACTIVE ]"}),e.jsx("div",{className:"w-full h-px bg-gradient-to-r from-transparent via-[#00ff00] to-transparent mt-4"})]}),e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"grid grid-cols-2 gap-4",children:[e.jsx(a,{variant:"matrix",size:"lg",children:"INITIATE HACK"}),e.jsx(a,{variant:"primary",size:"lg",children:"UPLOAD VIRUS"})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-4",children:[e.jsx(a,{variant:"danger",size:"default",children:"SELF DESTRUCT"}),e.jsx(a,{variant:"stealth",size:"default",children:"CLOAK MODE"})]}),e.jsx("div",{className:"w-full",children:e.jsx(a,{variant:"ghost",className:"w-full",size:"default",children:"ESTABLISH SECURE CONNECTION"})})]}),e.jsx("div",{className:"mt-10 pt-6 border-t border-[#00ff00]/30",children:e.jsxs("div",{className:"flex justify-between text-xs font-mono text-[#00ff00]/60",children:[e.jsx("span",{children:"STATUS: ONLINE"}),e.jsx("span",{children:"SECURITY: MAXIMUM"}),e.jsx("span",{children:"UPTIME: 99.97%"})]})})]})]}),decorators:[f=>e.jsx("div",{className:"min-h-screen bg-black p-8 flex items-center justify-center",children:e.jsx(f,{})})]};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'ACCESS MATRIX',
    variant: 'matrix'
  }
}`,...r.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'EXECUTE PROTOCOL',
    variant: 'primary'
  }
}`,...t.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'TERMINATE PROCESS',
    variant: 'danger'
  }
}`,...s.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'STEALTH MODE',
    variant: 'ghost'
  }
}`,...n.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'INFILTRATE SYSTEM',
    variant: 'stealth'
  }
}`,...o.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'HACKING MAINFRAME',
    variant: 'matrix',
    isLoading: true
  }
}`,...i.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'ACCESS DENIED',
    variant: 'danger',
    disabled: true
  }
}`,...l.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex gap-6 items-end flex-wrap p-8 bg-black">
      <div className="text-center">
        <CyberpunkButton size="sm">SMALL</CyberpunkButton>
        <div className="text-[#00ff00]/60 text-xs font-mono mt-2">sm</div>
      </div>
      <div className="text-center">
        <CyberpunkButton size="default">DEFAULT</CyberpunkButton>
        <div className="text-[#00ff00]/60 text-xs font-mono mt-2">default</div>
      </div>
      <div className="text-center">
        <CyberpunkButton size="lg">LARGE</CyberpunkButton>
        <div className="text-[#00ff00]/60 text-xs font-mono mt-2">lg</div>
      </div>
      <div className="text-center">
        <CyberpunkButton size="xl">EXTRA LARGE</CyberpunkButton>
        <div className="text-[#00ff00]/60 text-xs font-mono mt-2">xl</div>
      </div>
    </div>
}`,...d.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 bg-black max-w-4xl">
      <CyberpunkButton variant="matrix">BREACH FIREWALL</CyberpunkButton>
      <CyberpunkButton variant="primary">INJECT PAYLOAD</CyberpunkButton>
      <CyberpunkButton variant="danger">DESTROY EVIDENCE</CyberpunkButton>
      <CyberpunkButton variant="ghost">GHOST PROTOCOL</CyberpunkButton>
      <CyberpunkButton variant="stealth">SHADOW NETWORK</CyberpunkButton>
      <CyberpunkButton variant="matrix" isLoading>CRACKING ENCRYPTION</CyberpunkButton>
    </div>
}`,...c.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <div className="bg-black border-2 border-[#00ff00] p-12 max-w-2xl relative overflow-hidden">
      {/* Background Matrix Grid */}
      <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_20px,rgba(0,255,0,0.03)_20px,rgba(0,255,0,0.03)_22px)] opacity-50" />
      <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_20px,rgba(0,255,0,0.03)_20px,rgba(0,255,0,0.03)_22px)] opacity-50" />
      
      <div className="relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-[#00ff00] font-mono text-2xl font-bold tracking-[0.3em] mb-4">
            ◢◤ MATRIX TERMINAL ◥◣
          </h2>
          <div className="text-[#00ff00]/60 text-sm font-mono tracking-wider">
            [ QUANTUM_ENCRYPTION_PROTOCOL_ACTIVE ]
          </div>
          <div className="w-full h-px bg-gradient-to-r from-transparent via-[#00ff00] to-transparent mt-4" />
        </div>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <CyberpunkButton variant="matrix" size="lg">
              INITIATE HACK
            </CyberpunkButton>
            <CyberpunkButton variant="primary" size="lg">
              UPLOAD VIRUS
            </CyberpunkButton>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <CyberpunkButton variant="danger" size="default">
              SELF DESTRUCT
            </CyberpunkButton>
            <CyberpunkButton variant="stealth" size="default">
              CLOAK MODE
            </CyberpunkButton>
          </div>
          
          <div className="w-full">
            <CyberpunkButton variant="ghost" className="w-full" size="default">
              ESTABLISH SECURE CONNECTION
            </CyberpunkButton>
          </div>
        </div>
        
        <div className="mt-10 pt-6 border-t border-[#00ff00]/30">
          <div className="flex justify-between text-xs font-mono text-[#00ff00]/60">
            <span>STATUS: ONLINE</span>
            <span>SECURITY: MAXIMUM</span>
            <span>UPTIME: 99.97%</span>
          </div>
        </div>
      </div>
    </div>,
  decorators: [Story => <div className="min-h-screen bg-black p-8 flex items-center justify-center">
        <Story />
      </div>]
}`,...p.parameters?.docs?.source}}};const I=["MatrixTerminal","PrimaryAction","DangerZone","GhostMode","StealthOps","ProcessingState","AccessDenied","AllSizes","HackerArsenal","MatrixTerminalInterface"];export{l as AccessDenied,d as AllSizes,s as DangerZone,n as GhostMode,c as HackerArsenal,r as MatrixTerminal,p as MatrixTerminalInterface,t as PrimaryAction,i as ProcessingState,o as StealthOps,I as __namedExportsOrder,w as default};
