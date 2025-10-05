import{j as t}from"./jsx-runtime-D_zvdyIk.js";const e=({title:n,children:l,className:c="",...d})=>t.jsxs("div",{className:`card ${c}`,...d,children:[n&&t.jsx("h3",{className:"matrix-text",style:{marginTop:0,marginBottom:"12px"},children:n}),t.jsx("div",{children:l})]}),m={title:"Styled/MatrixCard",component:e,parameters:{layout:"padded"}},s={args:{title:"System Status",children:"Connection established. All systems operational."}},a={args:{children:"This is a card without a title. It still has the Matrix-themed styling."}},r={render:()=>t.jsxs(e,{title:"Access Terminal",children:[t.jsx("p",{children:"Enter the Matrix and access encrypted data streams."}),t.jsx("button",{className:"btn btn-primary",style:{marginTop:"12px"},children:"CONNECT"})]})},i={render:()=>t.jsxs("div",{style:{display:"grid",gap:"16px",gridTemplateColumns:"repeat(auto-fit, minmax(250px, 1fr))"},children:[t.jsxs(e,{title:"User Status",children:[t.jsx("div",{className:"matrix-text",children:"ONLINE"}),t.jsx("p",{children:"Session active for 2h 34m"})]}),t.jsxs(e,{title:"System Metrics",children:[t.jsxs("p",{children:["CPU: ",t.jsx("span",{className:"matrix-text",children:"23%"})]}),t.jsxs("p",{children:["Memory: ",t.jsx("span",{className:"matrix-text",children:"1.2GB"})]}),t.jsxs("p",{children:["Network: ",t.jsx("span",{className:"matrix-text",children:"Active"})]})]}),t.jsxs(e,{title:"Security",children:[t.jsxs("p",{children:["Firewall: ",t.jsx("span",{className:"matrix-text",children:"ENABLED"})]}),t.jsxs("p",{children:["Encryption: ",t.jsx("span",{className:"matrix-text",children:"AES-256"})]}),t.jsx("div",{className:"loading",style:{marginTop:"8px"}})]})]})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'System Status',
    children: 'Connection established. All systems operational.'
  }
}`,...s.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'This is a card without a title. It still has the Matrix-themed styling.'
  }
}`,...a.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: () => <MatrixCard title="Access Terminal">
      <p>Enter the Matrix and access encrypted data streams.</p>
      <button className="btn btn-primary" style={{
      marginTop: '12px'
    }}>
        CONNECT
      </button>
    </MatrixCard>
}`,...r.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'grid',
    gap: '16px',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'
  }}>
      <MatrixCard title="User Status">
        <div className="matrix-text">ONLINE</div>
        <p>Session active for 2h 34m</p>
      </MatrixCard>
      
      <MatrixCard title="System Metrics">
        <p>CPU: <span className="matrix-text">23%</span></p>
        <p>Memory: <span className="matrix-text">1.2GB</span></p>
        <p>Network: <span className="matrix-text">Active</span></p>
      </MatrixCard>
      
      <MatrixCard title="Security">
        <p>Firewall: <span className="matrix-text">ENABLED</span></p>
        <p>Encryption: <span className="matrix-text">AES-256</span></p>
        <div className="loading" style={{
        marginTop: '8px'
      }}></div>
      </MatrixCard>
    </div>
}`,...i.parameters?.docs?.source}}};const o=["Basic","WithoutTitle","WithButton","MultipleCards"];export{s as Basic,i as MultipleCards,r as WithButton,a as WithoutTitle,o as __namedExportsOrder,m as default};
