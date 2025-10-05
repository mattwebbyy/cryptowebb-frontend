import{j as e}from"./jsx-runtime-D_zvdyIk.js";const t=({year:a=new Date().getFullYear()})=>e.jsx("footer",{style:{width:"100%",padding:"24px 0",background:"rgba(0, 0, 0, 0.8)",backdropFilter:"blur(8px)"},children:e.jsx("div",{style:{maxWidth:"1200px",margin:"0 auto",padding:"0 16px",textAlign:"center",color:"rgba(0, 255, 0, 0.7)",fontFamily:"monospace"},children:e.jsxs("p",{style:{margin:0},children:["© ",a," Cryptowebb Portfolio. All rights reserved."]})})}),i={title:"Layout/Footer",component:t,parameters:{layout:"fullscreen",backgrounds:{default:"dark"}},argTypes:{year:{control:"number"}}},r={args:{}},n={args:{year:2024}},o={render:()=>e.jsxs("div",{style:{minHeight:"100vh",display:"flex",flexDirection:"column"},children:[e.jsxs("div",{style:{flex:1,padding:"40px",textAlign:"center"},children:[e.jsx("h1",{style:{color:"#00ff00",fontFamily:"monospace",textShadow:"0 0 10px #00ff00"},children:"CRYPTOWEBB PLATFORM"}),e.jsx("p",{style:{color:"#ffffff",marginTop:"20px"},children:"This demonstrates how the footer appears at the bottom of a page layout."}),e.jsx("div",{style:{marginTop:"40px",padding:"20px",background:"rgba(0, 255, 0, 0.1)",border:"1px solid rgba(0, 255, 0, 0.3)",borderRadius:"8px",display:"inline-block"},children:e.jsx("p",{style:{color:"#00ff00",margin:0},children:"Page content goes here..."})})]}),e.jsx(t,{})]})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {}
}`,...r.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    year: 2024
  }
}`,...n.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column'
  }}>
      {/* Mock page content */}
      <div style={{
      flex: 1,
      padding: '40px',
      textAlign: 'center'
    }}>
        <h1 style={{
        color: '#00ff00',
        fontFamily: 'monospace',
        textShadow: '0 0 10px #00ff00'
      }}>
          CRYPTOWEBB PLATFORM
        </h1>
        <p style={{
        color: '#ffffff',
        marginTop: '20px'
      }}>
          This demonstrates how the footer appears at the bottom of a page layout.
        </p>
        <div style={{
        marginTop: '40px',
        padding: '20px',
        background: 'rgba(0, 255, 0, 0.1)',
        border: '1px solid rgba(0, 255, 0, 0.3)',
        borderRadius: '8px',
        display: 'inline-block'
      }}>
          <p style={{
          color: '#00ff00',
          margin: 0
        }}>
            Page content goes here...
          </p>
        </div>
      </div>
      
      {/* Footer */}
      <MockFooter />
    </div>
}`,...o.parameters?.docs?.source}}};const l=["Default","WithCustomYear","InLayout"];export{r as Default,o as InLayout,n as WithCustomYear,l as __namedExportsOrder,i as default};
