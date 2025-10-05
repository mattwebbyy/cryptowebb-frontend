import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{c as f}from"./clsx-B-dksMZM.js";import{r as u}from"./iframe-lSEetYu3.js";import{m as v}from"./proxy-CAtle9Ik.js";const n=u.forwardRef(({children:p,className:c,variant:h="default",hover:o=!0,...g},x)=>{const m={default:"bg-surface/80 border border-border/50 backdrop-blur-sm",glass:"glass-morphism border border-border/30",elevated:"bg-surface shadow-modern-lg border border-border/20",outlined:"bg-transparent border border-border hover:bg-surface/30"},y=o?"hover:shadow-modern-lg hover:border-primary/20 hover:-translate-y-1":"";return e.jsx(v.div,{ref:x,className:f("rounded-xl transition-all duration-300 ease-out",m[h],y,c),initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.4,ease:[.21,.47,.32,.98]},whileHover:o?{y:-4}:void 0,...g,children:p})});n.displayName="Card";n.__docgenInfo={description:"",methods:[],displayName:"Card",props:{children:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},variant:{required:!1,tsType:{name:"union",raw:"'default' | 'glass' | 'elevated' | 'outlined'",elements:[{name:"literal",value:"'default'"},{name:"literal",value:"'glass'"},{name:"literal",value:"'elevated'"},{name:"literal",value:"'outlined'"}]},description:"",defaultValue:{value:"'default'",computed:!1}},hover:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"true",computed:!1}}},composes:["Omit"]};const z={title:"UI/Card",component:n,parameters:{layout:"padded"},argTypes:{variant:{control:"select",options:["default","glass","elevated","outlined"]},hover:{control:"boolean"}}},a={args:{children:e.jsxs("div",{style:{padding:"24px"},children:[e.jsx("h3",{style:{margin:"0 0 12px 0",fontSize:"18px",fontWeight:"600"},children:"Default Card"}),e.jsx("p",{style:{margin:0,color:"#64748b"},children:"This is a default card with some sample content to demonstrate the styling and layout."})]}),variant:"default"}},r={args:{children:e.jsxs("div",{style:{padding:"24px"},children:[e.jsx("h3",{style:{margin:"0 0 12px 0",fontSize:"18px",fontWeight:"600"},children:"Glass Card"}),e.jsx("p",{style:{margin:0,color:"#64748b"},children:"This card uses a glass morphism effect with backdrop blur and transparency."})]}),variant:"glass"}},t={args:{children:e.jsxs("div",{style:{padding:"24px"},children:[e.jsx("h3",{style:{margin:"0 0 12px 0",fontSize:"18px",fontWeight:"600"},children:"Elevated Card"}),e.jsx("p",{style:{margin:0,color:"#64748b"},children:"This card has elevated styling with enhanced shadows for depth."})]}),variant:"elevated"}},i={args:{children:e.jsxs("div",{style:{padding:"24px"},children:[e.jsx("h3",{style:{margin:"0 0 12px 0",fontSize:"18px",fontWeight:"600"},children:"Outlined Card"}),e.jsx("p",{style:{margin:0,color:"#64748b"},children:"This card uses a transparent background with outline styling."})]}),variant:"outlined"}},s={args:{children:e.jsxs("div",{style:{padding:"24px"},children:[e.jsx("h3",{style:{margin:"0 0 12px 0",fontSize:"18px",fontWeight:"600"},children:"Static Card"}),e.jsx("p",{style:{margin:0,color:"#64748b"},children:"This card has hover effects disabled for static content."})]}),hover:!1}},d={args:{children:e.jsxs("div",{style:{padding:"24px"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",marginBottom:"16px"},children:[e.jsx("div",{style:{width:"48px",height:"48px",backgroundColor:"#00ff00",borderRadius:"50%",marginRight:"12px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"20px"},children:"💎"}),e.jsxs("div",{children:[e.jsx("h3",{style:{margin:0,fontSize:"18px",fontWeight:"600"},children:"Crypto Analytics"}),e.jsx("p",{style:{margin:0,fontSize:"14px",color:"#64748b"},children:"Real-time data analysis"})]})]}),e.jsx("p",{style:{margin:"0 0 16px 0",color:"#64748b",lineHeight:"1.5"},children:"Advanced cryptocurrency analytics with real-time market data, technical indicators, and portfolio tracking capabilities."}),e.jsxs("div",{style:{display:"flex",gap:"8px"},children:[e.jsx("span",{style:{padding:"4px 8px",backgroundColor:"#00ff00",color:"#000",borderRadius:"4px",fontSize:"12px",fontWeight:"500"},children:"Active"}),e.jsx("span",{style:{padding:"4px 8px",backgroundColor:"rgba(100, 116, 139, 0.1)",color:"#64748b",borderRadius:"4px",fontSize:"12px"},children:"Pro Plan"})]})]}),variant:"default"}},l={render:()=>e.jsxs("div",{style:{display:"grid",gap:"24px",gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))"},children:[e.jsx(n,{variant:"default",children:e.jsxs("div",{style:{padding:"20px"},children:[e.jsx("h4",{style:{margin:"0 0 8px 0"},children:"Default"}),e.jsx("p",{style:{margin:0,fontSize:"14px",color:"#64748b"},children:"Standard card styling"})]})}),e.jsx(n,{variant:"glass",children:e.jsxs("div",{style:{padding:"20px"},children:[e.jsx("h4",{style:{margin:"0 0 8px 0"},children:"Glass"}),e.jsx("p",{style:{margin:0,fontSize:"14px",color:"#64748b"},children:"Glass morphism effect"})]})}),e.jsx(n,{variant:"elevated",children:e.jsxs("div",{style:{padding:"20px"},children:[e.jsx("h4",{style:{margin:"0 0 8px 0"},children:"Elevated"}),e.jsx("p",{style:{margin:0,fontSize:"14px",color:"#64748b"},children:"Enhanced shadows"})]})}),e.jsx(n,{variant:"outlined",children:e.jsxs("div",{style:{padding:"20px"},children:[e.jsx("h4",{style:{margin:"0 0 8px 0"},children:"Outlined"}),e.jsx("p",{style:{margin:0,fontSize:"14px",color:"#64748b"},children:"Transparent with border"})]})})]})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    children: <div style={{
      padding: '24px'
    }}>
        <h3 style={{
        margin: '0 0 12px 0',
        fontSize: '18px',
        fontWeight: '600'
      }}>Default Card</h3>
        <p style={{
        margin: 0,
        color: '#64748b'
      }}>
          This is a default card with some sample content to demonstrate the styling and layout.
        </p>
      </div>,
    variant: 'default'
  }
}`,...a.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    children: <div style={{
      padding: '24px'
    }}>
        <h3 style={{
        margin: '0 0 12px 0',
        fontSize: '18px',
        fontWeight: '600'
      }}>Glass Card</h3>
        <p style={{
        margin: 0,
        color: '#64748b'
      }}>
          This card uses a glass morphism effect with backdrop blur and transparency.
        </p>
      </div>,
    variant: 'glass'
  }
}`,...r.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    children: <div style={{
      padding: '24px'
    }}>
        <h3 style={{
        margin: '0 0 12px 0',
        fontSize: '18px',
        fontWeight: '600'
      }}>Elevated Card</h3>
        <p style={{
        margin: 0,
        color: '#64748b'
      }}>
          This card has elevated styling with enhanced shadows for depth.
        </p>
      </div>,
    variant: 'elevated'
  }
}`,...t.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    children: <div style={{
      padding: '24px'
    }}>
        <h3 style={{
        margin: '0 0 12px 0',
        fontSize: '18px',
        fontWeight: '600'
      }}>Outlined Card</h3>
        <p style={{
        margin: 0,
        color: '#64748b'
      }}>
          This card uses a transparent background with outline styling.
        </p>
      </div>,
    variant: 'outlined'
  }
}`,...i.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    children: <div style={{
      padding: '24px'
    }}>
        <h3 style={{
        margin: '0 0 12px 0',
        fontSize: '18px',
        fontWeight: '600'
      }}>Static Card</h3>
        <p style={{
        margin: 0,
        color: '#64748b'
      }}>
          This card has hover effects disabled for static content.
        </p>
      </div>,
    hover: false
  }
}`,...s.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    children: <div style={{
      padding: '24px'
    }}>
        <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '16px'
      }}>
          <div style={{
          width: '48px',
          height: '48px',
          backgroundColor: '#00ff00',
          borderRadius: '50%',
          marginRight: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px'
        }}>
            💎
          </div>
          <div>
            <h3 style={{
            margin: 0,
            fontSize: '18px',
            fontWeight: '600'
          }}>Crypto Analytics</h3>
            <p style={{
            margin: 0,
            fontSize: '14px',
            color: '#64748b'
          }}>Real-time data analysis</p>
          </div>
        </div>
        <p style={{
        margin: '0 0 16px 0',
        color: '#64748b',
        lineHeight: '1.5'
      }}>
          Advanced cryptocurrency analytics with real-time market data, technical indicators, and portfolio tracking capabilities.
        </p>
        <div style={{
        display: 'flex',
        gap: '8px'
      }}>
          <span style={{
          padding: '4px 8px',
          backgroundColor: '#00ff00',
          color: '#000',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: '500'
        }}>
            Active
          </span>
          <span style={{
          padding: '4px 8px',
          backgroundColor: 'rgba(100, 116, 139, 0.1)',
          color: '#64748b',
          borderRadius: '4px',
          fontSize: '12px'
        }}>
            Pro Plan
          </span>
        </div>
      </div>,
    variant: 'default'
  }
}`,...d.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'grid',
    gap: '24px',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))'
  }}>
      <Card variant="default">
        <div style={{
        padding: '20px'
      }}>
          <h4 style={{
          margin: '0 0 8px 0'
        }}>Default</h4>
          <p style={{
          margin: 0,
          fontSize: '14px',
          color: '#64748b'
        }}>Standard card styling</p>
        </div>
      </Card>
      
      <Card variant="glass">
        <div style={{
        padding: '20px'
      }}>
          <h4 style={{
          margin: '0 0 8px 0'
        }}>Glass</h4>
          <p style={{
          margin: 0,
          fontSize: '14px',
          color: '#64748b'
        }}>Glass morphism effect</p>
        </div>
      </Card>
      
      <Card variant="elevated">
        <div style={{
        padding: '20px'
      }}>
          <h4 style={{
          margin: '0 0 8px 0'
        }}>Elevated</h4>
          <p style={{
          margin: 0,
          fontSize: '14px',
          color: '#64748b'
        }}>Enhanced shadows</p>
        </div>
      </Card>
      
      <Card variant="outlined">
        <div style={{
        padding: '20px'
      }}>
          <h4 style={{
          margin: '0 0 8px 0'
        }}>Outlined</h4>
          <p style={{
          margin: 0,
          fontSize: '14px',
          color: '#64748b'
        }}>Transparent with border</p>
        </div>
      </Card>
    </div>
}`,...l.parameters?.docs?.source}}};const w=["Default","Glass","Elevated","Outlined","NoHover","WithContent","AllVariants"];export{l as AllVariants,a as Default,t as Elevated,r as Glass,s as NoHover,i as Outlined,d as WithContent,w as __namedExportsOrder,z as default};
