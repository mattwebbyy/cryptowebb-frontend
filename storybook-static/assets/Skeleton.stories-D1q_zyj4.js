import{j as e}from"./jsx-runtime-D_zvdyIk.js";const t=({className:s="",width:i,height:r,variant:y="matrix",rounded:a=!0})=>{const o={display:"block",...{default:{background:"#d1d5db",animation:"pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"},matrix:{background:"linear-gradient(90deg, rgba(0, 255, 0, 0.1) 0%, rgba(0, 255, 0, 0.2) 50%, rgba(0, 255, 0, 0.1) 100%)",animation:"pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"},pulse:{background:"rgba(0, 255, 0, 0.2)",animation:"bounce 1s infinite"}}[y],borderRadius:a?"4px":"0"};return i&&(o.width=typeof i=="number"?`${i}px`:i),r&&(o.height=typeof r=="number"?`${r}px`:r),e.jsx("div",{className:s,style:o})},u=({className:s=""})=>e.jsxs("div",{className:s,style:{background:"rgba(0, 0, 0, 0.5)",border:"1px solid rgba(0, 255, 0, 0.3)",borderRadius:"8px",padding:"16px"},children:[e.jsxs("div",{style:{marginBottom:"16px"},children:[e.jsx(t,{height:20,width:"192px",style:{marginBottom:"8px"}}),e.jsx(t,{height:12,width:"128px"})]}),e.jsxs("div",{style:{marginBottom:"16px"},children:[e.jsx("div",{style:{display:"flex",alignItems:"end",justifyContent:"space-between",height:"128px",gap:"4px"},children:Array.from({length:8}).map((i,r)=>e.jsx(t,{width:"32px",height:Math.random()*80+20},r))}),e.jsx("div",{style:{display:"flex",justifyContent:"space-between",marginTop:"8px"},children:Array.from({length:8}).map((i,r)=>e.jsx(t,{height:12,width:"48px"},r))})]}),e.jsxs("div",{style:{display:"flex",gap:"16px"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px"},children:[e.jsx(t,{height:12,width:12,rounded:!0}),e.jsx(t,{height:12,width:"64px"})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"8px"},children:[e.jsx(t,{height:12,width:12,rounded:!0}),e.jsx(t,{height:12,width:"80px"})]})]})]}),v=({rows:s=5,columns:i=4,className:r=""})=>e.jsxs("div",{className:r,style:{background:"rgba(0, 0, 0, 0.5)",border:"1px solid rgba(0, 255, 0, 0.3)",borderRadius:"8px",overflow:"hidden"},children:[e.jsx("div",{style:{borderBottom:"1px solid rgba(0, 255, 0, 0.2)",padding:"16px"},children:e.jsx("div",{style:{display:"grid",gap:"16px",gridTemplateColumns:`repeat(${i}, 1fr)`},children:Array.from({length:i}).map((y,a)=>e.jsx(t,{height:16},a))})}),e.jsx("div",{children:Array.from({length:s}).map((y,a)=>e.jsx("div",{style:{padding:"16px",borderBottom:a<s-1?"1px solid rgba(0, 255, 0, 0.1)":"none"},children:e.jsx("div",{style:{display:"grid",gap:"16px",gridTemplateColumns:`repeat(${i}, 1fr)`},children:Array.from({length:i}).map((j,o)=>e.jsx(t,{height:16,width:`${Math.random()*40+60}%`},o))})},a))})]}),f=({className:s="",children:i})=>e.jsxs("div",{className:s,style:{background:"rgba(0, 0, 0, 0.5)",border:"1px solid rgba(0, 255, 0, 0.3)",borderRadius:"8px",padding:"24px",position:"relative",overflow:"hidden"},children:[e.jsx("div",{style:{position:"absolute",inset:0,background:"linear-gradient(180deg, transparent 0%, rgba(0, 255, 0, 0.05) 50%, transparent 100%)",animation:"pulse 2s ease-in-out infinite"}}),i||e.jsxs("div",{style:{position:"relative",zIndex:10},children:[e.jsx(t,{height:24,width:"128px",style:{marginBottom:"16px"}}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"12px"},children:[e.jsx(t,{height:16}),e.jsx(t,{height:16,width:"75%"}),e.jsx(t,{height:16,width:"50%"})]})]})]}),S={title:"UI/Skeleton",component:t,parameters:{layout:"padded",backgrounds:{default:"dark"}},argTypes:{variant:{control:"select",options:["default","matrix","pulse"]},width:{control:"text"},height:{control:"text"},rounded:{control:"boolean"}}},n={args:{variant:"matrix",width:"200px",height:"20px"}},d={args:{variant:"matrix",width:"100%",height:"40px"}},l={args:{variant:"pulse",width:"150px",height:"30px"}},x={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"16px",maxWidth:"400px"},children:[e.jsxs("div",{children:[e.jsx("h4",{style:{marginBottom:"8px",color:"#00ff00"},children:"Text Lines"}),e.jsx(t,{height:24,width:"80%",style:{marginBottom:"8px"}}),e.jsx(t,{height:16,width:"60%",style:{marginBottom:"8px"}}),e.jsx(t,{height:16,width:"40%"})]}),e.jsxs("div",{children:[e.jsx("h4",{style:{marginBottom:"8px",color:"#00ff00"},children:"Buttons & Elements"}),e.jsxs("div",{style:{display:"flex",gap:"8px",marginBottom:"8px"},children:[e.jsx(t,{height:40,width:"100px"}),e.jsx(t,{height:40,width:"80px"})]}),e.jsx(t,{height:60,width:"100%"})]}),e.jsxs("div",{children:[e.jsx("h4",{style:{marginBottom:"8px",color:"#00ff00"},children:"Circular Elements"}),e.jsxs("div",{style:{display:"flex",gap:"8px",alignItems:"center"},children:[e.jsx(t,{height:48,width:48,rounded:!0}),e.jsxs("div",{style:{flex:1},children:[e.jsx(t,{height:16,width:"70%",style:{marginBottom:"4px"}}),e.jsx(t,{height:12,width:"50%"})]})]})]})]})},p={render:()=>e.jsx(u,{}),name:"Chart Skeleton"},h={render:()=>e.jsx(v,{rows:4,columns:3}),name:"Table Skeleton"},c={render:()=>e.jsx(f,{}),name:"Matrix Card Skeleton"},m={render:()=>e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(300px, 1fr))",gap:"16px"},children:[e.jsx(u,{}),e.jsx(u,{}),e.jsx(u,{}),e.jsx(f,{children:e.jsxs("div",{style:{position:"relative",zIndex:10},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"16px"},children:[e.jsx(t,{height:20,width:"120px"}),e.jsx(t,{height:32,width:32,rounded:!0})]}),e.jsx(t,{height:36,width:"80px",style:{marginBottom:"8px"}}),e.jsx(t,{height:16,width:"60%"})]})})]}),name:"Dashboard Layout"},g={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"24px"},children:[e.jsxs("div",{children:[e.jsx("h3",{style:{marginBottom:"12px",color:"#00ff00"},children:"Skeleton Variants"}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"8px"},children:[e.jsx(t,{variant:"default",height:20,width:"200px"}),e.jsx(t,{variant:"matrix",height:20,width:"200px"}),e.jsx(t,{variant:"pulse",height:20,width:"200px"})]})]}),e.jsxs("div",{children:[e.jsx("h3",{style:{marginBottom:"12px",color:"#00ff00"},children:"Complex Components"}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px"},children:[e.jsx(v,{rows:3,columns:2}),e.jsx(f,{})]})]})]})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'matrix',
    width: '200px',
    height: '20px'
  }
}`,...n.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'matrix',
    width: '100%',
    height: '40px'
  }
}`,...d.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'pulse',
    width: '150px',
    height: '30px'
  }
}`,...l.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    maxWidth: '400px'
  }}>
      <div>
        <h4 style={{
        marginBottom: '8px',
        color: '#00ff00'
      }}>Text Lines</h4>
        <MockSkeleton height={24} width="80%" style={{
        marginBottom: '8px'
      }} />
        <MockSkeleton height={16} width="60%" style={{
        marginBottom: '8px'
      }} />
        <MockSkeleton height={16} width="40%" />
      </div>
      
      <div>
        <h4 style={{
        marginBottom: '8px',
        color: '#00ff00'
      }}>Buttons & Elements</h4>
        <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '8px'
      }}>
          <MockSkeleton height={40} width="100px" />
          <MockSkeleton height={40} width="80px" />
        </div>
        <MockSkeleton height={60} width="100%" />
      </div>
      
      <div>
        <h4 style={{
        marginBottom: '8px',
        color: '#00ff00'
      }}>Circular Elements</h4>
        <div style={{
        display: 'flex',
        gap: '8px',
        alignItems: 'center'
      }}>
          <MockSkeleton height={48} width={48} rounded />
          <div style={{
          flex: 1
        }}>
            <MockSkeleton height={16} width="70%" style={{
            marginBottom: '4px'
          }} />
            <MockSkeleton height={12} width="50%" />
          </div>
        </div>
      </div>
    </div>
}`,...x.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <ChartSkeleton />,
  name: 'Chart Skeleton'
}`,...p.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <TableSkeleton rows={4} columns={3} />,
  name: 'Table Skeleton'
}`,...h.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <MatrixCardSkeleton />,
  name: 'Matrix Card Skeleton'
}`,...c.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '16px'
  }}>
      <ChartSkeleton />
      <ChartSkeleton />
      <ChartSkeleton />
      <MatrixCardSkeleton>
        <div style={{
        position: 'relative',
        zIndex: 10
      }}>
          <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px'
        }}>
            <MockSkeleton height={20} width="120px" />
            <MockSkeleton height={32} width={32} rounded />
          </div>
          <MockSkeleton height={36} width="80px" style={{
          marginBottom: '8px'
        }} />
          <MockSkeleton height={16} width="60%" />
        </div>
      </MatrixCardSkeleton>
    </div>,
  name: 'Dashboard Layout'
}`,...m.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  }}>
      <div>
        <h3 style={{
        marginBottom: '12px',
        color: '#00ff00'
      }}>Skeleton Variants</h3>
        <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
          <MockSkeleton variant="default" height={20} width="200px" />
          <MockSkeleton variant="matrix" height={20} width="200px" />
          <MockSkeleton variant="pulse" height={20} width="200px" />
        </div>
      </div>
      
      <div>
        <h3 style={{
        marginBottom: '12px',
        color: '#00ff00'
      }}>Complex Components</h3>
        <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px'
      }}>
          <TableSkeleton rows={3} columns={2} />
          <MatrixCardSkeleton />
        </div>
      </div>
    </div>
}`,...g.parameters?.docs?.source}}};const w=["Default","Matrix","Pulse","BasicShapes","ChartSkeletonStory","TableSkeletonStory","MatrixCardSkeletonStory","DashboardLayout","AllVariants"];export{g as AllVariants,x as BasicShapes,p as ChartSkeletonStory,m as DashboardLayout,n as Default,d as Matrix,c as MatrixCardSkeletonStory,l as Pulse,h as TableSkeletonStory,w as __namedExportsOrder,S as default};
