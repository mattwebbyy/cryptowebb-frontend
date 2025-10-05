import{j as e}from"./jsx-runtime-D_zvdyIk.js";const o=({metricName:D="Bitcoin",price:f=45234.56,change:k=2.45,isConnected:j=!0,showChart:v=!1,showStatus:S=!0,priceDirection:n="up",connectionError:y=null})=>{const C=()=>e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("polyline",{points:"22,7 13.5,15.5 8.5,10.5 2,17"}),e.jsx("polyline",{points:"16,7 22,7 22,13"})]}),w=()=>e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("polyline",{points:"22,17 13.5,8.5 8.5,13.5 2,7"}),e.jsx("polyline",{points:"16,17 22,17 22,11"})]}),N=()=>e.jsx("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:e.jsx("polyline",{points:"22,12 18,12 15,21 9,3 6,12 2,12"})}),W=()=>e.jsxs("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("path",{d:"M5 13a10 10 0 0 1 14 0"}),e.jsx("path",{d:"M8.5 16.5a5 5 0 0 1 7 0"}),e.jsx("path",{d:"M12 20h.01"})]}),M=()=>e.jsxs("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("line",{x1:"2",x2:"22",y1:"2",y2:"22"}),e.jsx("path",{d:"M8.5 16.5a5 5 0 0 1 7 0"}),e.jsx("path",{d:"M12 20h.01"})]}),P=r=>r==null?"--":r>=1e3?`$${r.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}`:r>=1?`$${r.toFixed(4)}`:`$${r.toFixed(6)}`,a=(r=>{if(r==null)return null;const t=r>=0;return{value:Math.abs(r),isPositive:t,formatted:`${t?"+":"-"}${Math.abs(r).toFixed(2)}%`}})(k),i=v?(()=>{const r=[];let t=f||45e3;for(let s=0;s<20;s++){const c=(Math.random()-.5)*1e3;r.push(t+c)}return r})():[];return e.jsxs("div",{style:{position:"relative",overflow:"hidden",background:"rgba(0, 0, 0, 0.8)",border:"1px solid rgba(0, 255, 0, 0.3)",borderRadius:"12px",backdropFilter:"blur(8px)",transition:"all 0.3s ease",maxWidth:"350px"},children:[S&&e.jsx("div",{style:{position:"absolute",top:"12px",right:"12px",zIndex:10},children:j?e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"4px",fontSize:"12px",color:"#00ff00"},children:[e.jsx(W,{}),e.jsx("span",{children:"Live"})]}):e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"4px",fontSize:"12px",color:"#ef4444"},children:[e.jsx(M,{}),e.jsx("span",{children:"Offline"})]})}),e.jsxs("div",{style:{padding:"16px"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"12px"},children:[e.jsxs("div",{children:[e.jsx("h3",{style:{fontWeight:"600",color:"#ffffff",margin:"0 0 4px 0",fontSize:"16px"},children:D}),e.jsx("p",{style:{fontSize:"12px",color:"#64748b",margin:0},children:"Metric ID: 1"})]}),e.jsxs("div",{style:{padding:"4px",borderRadius:"50%",transition:"colors 0.3s",backgroundColor:n==="up"?"rgba(0, 255, 0, 0.2)":n==="down"?"rgba(239, 68, 68, 0.2)":"rgba(0, 255, 0, 0.2)",color:n==="up"?"#00ff00":n==="down"?"#ef4444":"#00ff00"},children:[n==="up"&&e.jsx(C,{}),n==="down"&&e.jsx(w,{}),n==="neutral"&&e.jsx(N,{})]})]}),e.jsxs("div",{style:{marginBottom:"12px"},children:[e.jsx("div",{style:{fontSize:"32px",fontWeight:"bold",transition:"color 0.3s",color:n==="up"?"#00ff00":n==="down"?"#ef4444":"#ffffff"},children:P(f)}),a&&e.jsxs("div",{style:{fontSize:"14px",display:"flex",alignItems:"center",gap:"4px",color:a.isPositive?"#00ff00":"#ef4444"},children:[a.isPositive?e.jsx(C,{}):e.jsx(w,{}),e.jsx("span",{children:a.formatted})]})]}),v&&i.length>1&&e.jsx("div",{style:{height:"64px",marginBottom:"12px"},children:e.jsx("svg",{width:"100%",height:"100%",viewBox:"0 0 200 64",style:{color:"#00ff00"},children:e.jsx("polyline",{fill:"none",stroke:"currentColor",strokeWidth:"2",points:i.map((r,t)=>{const s=t/(i.length-1)*200,c=Math.min(...i),b=Math.max(...i)-c,B=b>0?64-(r-c)/b*64:32;return`${s},${B}`}).join(" ")})})}),e.jsx("div",{style:{fontSize:"12px",color:"#64748b"},children:f!==null?e.jsxs(e.Fragment,{children:["Last update: ",new Date().toLocaleTimeString()]}):e.jsx(e.Fragment,{children:j?"Waiting for data...":"Disconnected"})}),y&&e.jsxs("div",{style:{marginTop:"8px",fontSize:"12px",color:"#ef4444",background:"rgba(239, 68, 68, 0.1)",padding:"8px",borderRadius:"4px"},children:["Error: ",y]})]}),n!=="neutral"&&e.jsx("div",{style:{position:"absolute",inset:0,pointerEvents:"none",transition:"opacity 1s",background:n==="up"?"linear-gradient(135deg, rgba(0, 255, 0, 0.05) 0%, transparent 100%)":"linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, transparent 100%)",animation:"pulse 2s ease-in-out"}})]})},F={title:"Crypto/LivePriceCard",component:o,parameters:{layout:"centered",backgrounds:{default:"dark"}},argTypes:{metricName:{control:"text"},price:{control:"number"},change:{control:"number"},isConnected:{control:"boolean"},showChart:{control:"boolean"},showStatus:{control:"boolean"},priceDirection:{control:"select",options:["up","down","neutral"]},connectionError:{control:"text"}}},l={args:{metricName:"Bitcoin",price:45234.56,change:2.45,priceDirection:"up"}},p={args:{metricName:"Ethereum",price:3124.78,change:-1.23,priceDirection:"down"}},d={args:{metricName:"Cardano",price:.456789,change:5.67,priceDirection:"up",showChart:!0}},m={args:{metricName:"Solana",price:null,change:null,isConnected:!1,priceDirection:"neutral"}},h={args:{metricName:"Polygon",price:.8234,change:.45,connectionError:"WebSocket connection failed",priceDirection:"neutral"}},u={args:{metricName:"Gold (per oz)",price:2045.67,change:.12,priceDirection:"up",showChart:!0}},g={args:{metricName:"Dogecoin",price:123e-6,change:-12.34,priceDirection:"down",showChart:!0}},x={render:()=>e.jsxs("div",{style:{display:"grid",gap:"20px",gridTemplateColumns:"repeat(auto-fit, minmax(300px, 1fr))"},children:[e.jsx(o,{metricName:"Bitcoin",price:45234.56,change:2.45,priceDirection:"up",showChart:!0}),e.jsx(o,{metricName:"Ethereum",price:3124.78,change:-1.23,priceDirection:"down",showChart:!0}),e.jsx(o,{metricName:"Solana",price:null,change:null,isConnected:!1,priceDirection:"neutral"}),e.jsx(o,{metricName:"Cardano",price:.456789,change:5.67,priceDirection:"up",connectionError:"Rate limited"})]})};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    metricName: 'Bitcoin',
    price: 45234.56,
    change: 2.45,
    priceDirection: 'up'
  }
}`,...l.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    metricName: 'Ethereum',
    price: 3124.78,
    change: -1.23,
    priceDirection: 'down'
  }
}`,...p.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    metricName: 'Cardano',
    price: 0.456789,
    change: 5.67,
    priceDirection: 'up',
    showChart: true
  }
}`,...d.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    metricName: 'Solana',
    price: null,
    change: null,
    isConnected: false,
    priceDirection: 'neutral'
  }
}`,...m.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    metricName: 'Polygon',
    price: 0.8234,
    change: 0.45,
    connectionError: 'WebSocket connection failed',
    priceDirection: 'neutral'
  }
}`,...h.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    metricName: 'Gold (per oz)',
    price: 2045.67,
    change: 0.12,
    priceDirection: 'up',
    showChart: true
  }
}`,...u.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    metricName: 'Dogecoin',
    price: 0.000123,
    change: -12.34,
    priceDirection: 'down',
    showChart: true
  }
}`,...g.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'grid',
    gap: '20px',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
  }}>
      <MockLivePriceCard metricName="Bitcoin" price={45234.56} change={2.45} priceDirection="up" showChart={true} />
      <MockLivePriceCard metricName="Ethereum" price={3124.78} change={-1.23} priceDirection="down" showChart={true} />
      <MockLivePriceCard metricName="Solana" price={null} change={null} isConnected={false} priceDirection="neutral" />
      <MockLivePriceCard metricName="Cardano" price={0.456789} change={5.67} priceDirection="up" connectionError="Rate limited" />
    </div>
}`,...x.parameters?.docs?.source}}};const R=["Default","Negative","WithChart","Disconnected","WithError","HighValue","LowValue","AllVariants"];export{x as AllVariants,l as Default,m as Disconnected,u as HighValue,g as LowValue,p as Negative,d as WithChart,h as WithError,R as __namedExportsOrder,F as default};
