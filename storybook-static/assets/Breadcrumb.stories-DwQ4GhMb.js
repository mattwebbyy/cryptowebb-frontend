import{j as a}from"./jsx-runtime-D_zvdyIk.js";import{R as h}from"./iframe-BIPmi7o-.js";const m=({items:o=[{label:"HOME",href:"/"},{label:"ANALYTICS",href:"/analytics"},{label:"CURRENT",isActive:!0}],variant:i="matrix",separator:d="▶",className:b=""})=>{const p=`
    inline-flex items-center gap-3
    font-mono font-bold tracking-[0.1em] uppercase text-sm
    transition-all duration-300 ease-out
    select-none
  `,u={matrix:`
      p-3 bg-black border border-[#00ff00] text-[#00ff00]
      shadow-[0_0_15px_rgba(0,255,0,0.3)]
      hover:shadow-[0_0_20px_rgba(0,255,0,0.5)]
    `,minimal:`
      p-2 bg-transparent text-[#00ff00]/80
      hover:text-[#00ff00]
    `};return a.jsxs("nav",{className:`
        ${p}
        ${u[i]}
        ${b}
      `,"aria-label":"Breadcrumb Navigation",children:[i==="matrix"&&a.jsxs(a.Fragment,{children:[a.jsxs("div",{className:"absolute top-0 left-0 w-3 h-3",children:[a.jsx("div",{className:"absolute top-0 left-0 w-full h-0.5 bg-current"}),a.jsx("div",{className:"absolute top-0 left-0 w-0.5 h-full bg-current"})]}),a.jsxs("div",{className:"absolute bottom-0 right-0 w-3 h-3",children:[a.jsx("div",{className:"absolute bottom-0 right-0 w-full h-0.5 bg-current"}),a.jsx("div",{className:"absolute bottom-0 right-0 w-0.5 h-full bg-current"})]})]}),a.jsx("div",{className:"relative flex items-center gap-3",children:o.map((e,c)=>a.jsxs(h.Fragment,{children:[c>0&&a.jsx("span",{className:"text-current/50 transition-colors duration-300 hover:text-current/80",children:d}),e.isActive?a.jsx("span",{className:`
                text-current font-bold tracking-[0.15em]
                border-b-2 border-current pb-1
                drop-shadow-[0_0_6px_currentColor]
              `,children:e.label}):a.jsx("a",{href:e.href,onClick:x=>{x.preventDefault(),console.log("Navigate to:",e.href)},className:`
                  text-current/60 hover:text-current
                  tracking-[0.1em] transition-all duration-300
                  hover:drop-shadow-[0_0_4px_currentColor]
                  border-b border-transparent hover:border-current/40
                  pb-1
                `,children:e.label})]},c))})]})},g={title:"UI/Breadcrumb",component:m,parameters:{layout:"padded",backgrounds:{default:"dark",values:[{name:"dark",value:"#000000"}]}},decorators:[o=>a.jsx("div",{className:"min-h-[200px] bg-black p-6",children:a.jsx(o,{})})]},r={args:{variant:"matrix"}},t={args:{variant:"minimal"}},s={args:{separator:"///",variant:"matrix"}},n={args:{items:[{label:"HOME",href:"/"},{label:"CRYPTO",href:"/crypto"},{label:"ANALYTICS",href:"/crypto/analytics"},{label:"BITCOIN",href:"/crypto/analytics/bitcoin"},{label:"CHARTS",isActive:!0}],variant:"matrix"}},l={render:()=>a.jsx("div",{className:"min-h-screen bg-black p-8",children:a.jsxs("div",{className:"max-w-4xl mx-auto",children:[a.jsx("div",{className:"mb-8",children:a.jsx(m,{variant:"matrix",items:[{label:"DASHBOARD",href:"/dashboard"},{label:"ANALYTICS",href:"/analytics"},{label:"CRYPTO_METRICS",isActive:!0}]})}),a.jsxs("div",{className:"bg-black border border-[#00ff00]/30 p-8",children:[a.jsx("h1",{className:"text-[#00ff00] font-mono text-2xl font-bold tracking-[0.2em] mb-4",children:"CRYPTO ANALYTICS DASHBOARD"}),a.jsx("p",{className:"text-[#00ff00]/60 font-mono",children:"Real-time blockchain data visualization and analysis."})]})]})})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'matrix'
  }
}`,...r.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'minimal'
  }
}`,...t.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    separator: '///',
    variant: 'matrix'
  }
}`,...s.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    items: [{
      label: 'HOME',
      href: '/'
    }, {
      label: 'CRYPTO',
      href: '/crypto'
    }, {
      label: 'ANALYTICS',
      href: '/crypto/analytics'
    }, {
      label: 'BITCOIN',
      href: '/crypto/analytics/bitcoin'
    }, {
      label: 'CHARTS',
      isActive: true
    }],
    variant: 'matrix'
  }
}`,...n.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <div className="min-h-screen bg-black p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <CyberpunkBreadcrumb variant="matrix" items={[{
          label: 'DASHBOARD',
          href: '/dashboard'
        }, {
          label: 'ANALYTICS',
          href: '/analytics'
        }, {
          label: 'CRYPTO_METRICS',
          isActive: true
        }]} />
        </div>
        
        <div className="bg-black border border-[#00ff00]/30 p-8">
          <h1 className="text-[#00ff00] font-mono text-2xl font-bold tracking-[0.2em] mb-4">
            CRYPTO ANALYTICS DASHBOARD
          </h1>
          <p className="text-[#00ff00]/60 font-mono">
            Real-time blockchain data visualization and analysis.
          </p>
        </div>
      </div>
    </div>
}`,...l.parameters?.docs?.source}}};const N=["MatrixStyle","MinimalStyle","CustomSeparator","LongPath","SimpleInterface"];export{s as CustomSeparator,n as LongPath,r as MatrixStyle,t as MinimalStyle,l as SimpleInterface,N as __namedExportsOrder,g as default};
