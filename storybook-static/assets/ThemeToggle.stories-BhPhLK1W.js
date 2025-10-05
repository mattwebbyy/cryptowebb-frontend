import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as m}from"./iframe-lSEetYu3.js";const l=({className:s="",size:d="md"})=>{const[a,x]=m.useState(!0),[o,c]=m.useState(!1),g=()=>{c(!0),setTimeout(()=>{x(!a),c(!1)},300)},p={sm:"w-12 h-6",md:"w-16 h-8",lg:"w-20 h-10"};return e.jsxs("div",{className:`flex items-center space-x-4 ${s}`,children:[e.jsx("span",{className:"text-matrix-green font-mono text-sm uppercase tracking-wider",children:a?"MATRIX MODE":"LIGHT MODE"}),e.jsxs("button",{onClick:g,className:`
          ${p[d]}
          relative border-2 border-matrix-green bg-black
          transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,255,0,0.5)]
          ${o?"animate-pulse":""}
        `,"aria-label":"Toggle theme",children:[e.jsx("div",{className:"absolute inset-1 bg-matrix-green/10"}),e.jsx("div",{className:`
          absolute top-1 w-4 h-4 bg-matrix-green
          transition-all duration-300 ease-out
          ${a?"left-1":"left-[calc(100%-1.25rem)]"}
          ${o?"animate-spin":""}
        `,children:e.jsx("div",{className:"w-full h-full bg-matrix-green shadow-[0_0_10px_rgba(0,255,0,0.8)]",children:e.jsx("div",{className:"flex items-center justify-center h-full text-black text-xs font-mono font-bold",children:a?"1":"0"})})}),o&&e.jsx("div",{className:"absolute inset-0 overflow-hidden",children:e.jsx("div",{className:"absolute inset-0 bg-gradient-to-b from-transparent via-matrix-green/20 to-transparent animate-pulse"})})]}),e.jsx("div",{className:"text-matrix-green/60 font-mono text-xs",children:a?"[SECURE]":"[EXPOSED]"})]})},f={title:"UI/ThemeToggle",component:l,parameters:{layout:"padded",backgrounds:{default:"dark",values:[{name:"dark",value:"#000000"}]}},decorators:[s=>e.jsx("div",{className:"min-h-[400px] bg-black p-6 flex items-start justify-center",children:e.jsx(s,{})})]},r={args:{size:"md"}},t={args:{size:"sm"}},n={args:{size:"lg"}},i={render:()=>e.jsxs("div",{className:"bg-black border-2 border-matrix-green p-8 w-96",children:[e.jsxs("div",{className:"text-center mb-6",children:[e.jsx("h2",{className:"text-matrix-green font-mono font-bold text-lg uppercase tracking-wider mb-2",children:"SYSTEM INTERFACE"}),e.jsx("div",{className:"text-matrix-green/60 font-mono text-xs",children:"[ SECURITY_PROTOCOL_ENABLED ]"})]}),e.jsxs("div",{className:"space-y-4",children:[e.jsx(l,{size:"md"}),e.jsx("div",{className:"border-t border-matrix-green/30 pt-4",children:e.jsx("div",{className:"text-matrix-green/60 font-mono text-xs",children:"STATUS: ACTIVE | ENCRYPTION: AES-256 | MODE: STEALTH"})})]})]}),decorators:[s=>e.jsx("div",{className:"min-h-[400px] bg-black p-6 flex items-center justify-center",children:e.jsx(s,{})})]};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    size: 'md'
  }
}`,...r.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    size: 'sm'
  }
}`,...t.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    size: 'lg'
  }
}`,...n.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => <div className="bg-black border-2 border-matrix-green p-8 w-96">
      <div className="text-center mb-6">
        <h2 className="text-matrix-green font-mono font-bold text-lg uppercase tracking-wider mb-2">
          SYSTEM INTERFACE
        </h2>
        <div className="text-matrix-green/60 font-mono text-xs">
          [ SECURITY_PROTOCOL_ENABLED ]
        </div>
      </div>
      
      <div className="space-y-4">
        <MatrixThemeToggle size="md" />
        
        <div className="border-t border-matrix-green/30 pt-4">
          <div className="text-matrix-green/60 font-mono text-xs">
            STATUS: ACTIVE | ENCRYPTION: AES-256 | MODE: STEALTH
          </div>
        </div>
      </div>
    </div>,
  decorators: [Story => <div className="min-h-[400px] bg-black p-6 flex items-center justify-center">
        <Story />
      </div>]
}`,...i.parameters?.docs?.source}}};const h=["Default","Small","Large","MatrixInterface"];export{r as Default,n as Large,i as MatrixInterface,t as Small,h as __namedExportsOrder,f as default};
