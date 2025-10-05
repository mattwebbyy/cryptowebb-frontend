import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{R as o}from"./iframe-BIPmi7o-.js";const a=({chartId:t="crypto-chart",title:p="CRYPTO ANALYTICS",height:d=400,className:m=""})=>{const[u,g]=o.useState(!0),[h,N]=o.useState({bitcoin:45e3,ethereum:3e3});return o.useEffect(()=>{const r=setTimeout(()=>g(!1),2e3),s=setInterval(()=>{N(x=>({bitcoin:x.bitcoin+(Math.random()-.5)*1e3,ethereum:x.ethereum+(Math.random()-.5)*100}))},3e3);return()=>{clearTimeout(r),clearInterval(s)}},[]),u?e.jsx("div",{className:`bg-black border-2 border-matrix-green p-6 ${m}`,style:{height:d},children:e.jsx("div",{className:"flex items-center justify-center h-full",children:e.jsxs("div",{className:"text-center",children:[e.jsx("div",{className:"w-16 h-16 border-4 border-matrix-green border-t-transparent rounded-full animate-spin mx-auto mb-4"}),e.jsx("div",{className:"text-matrix-green font-mono font-bold uppercase tracking-wider",children:"LOADING MATRIX DATA..."}),e.jsx("div",{className:"text-matrix-green/60 font-mono text-sm mt-2",children:"[ CONNECTING TO BLOCKCHAIN NETWORK ]"})]})})}):e.jsxs("div",{className:`bg-black border-2 border-matrix-green relative overflow-hidden ${m}`,style:{height:d},children:[e.jsx("div",{className:"absolute inset-0 opacity-10",children:e.jsx("div",{className:"w-full h-full bg-[linear-gradient(rgba(0,255,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"})}),e.jsx("div",{className:"relative z-10 p-4 border-b border-matrix-green/30",children:e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"text-matrix-green font-mono font-bold uppercase tracking-wider text-lg",children:p}),e.jsxs("div",{className:"text-matrix-green/60 font-mono text-xs mt-1",children:["REAL-TIME MARKET DATA | ID: ",t]})]}),e.jsxs("div",{className:"flex items-center space-x-4",children:[e.jsxs("div",{className:"text-right",children:[e.jsx("div",{className:"text-matrix-green font-mono text-sm",children:"BTC"}),e.jsxs("div",{className:"text-matrix-green font-mono font-bold",children:["$",h.bitcoin.toFixed(0)]})]}),e.jsxs("div",{className:"text-right",children:[e.jsx("div",{className:"text-matrix-green font-mono text-sm",children:"ETH"}),e.jsxs("div",{className:"text-matrix-green font-mono font-bold",children:["$",h.ethereum.toFixed(0)]})]}),e.jsx("div",{className:"w-3 h-3 bg-matrix-green rounded-full animate-pulse"})]})]})}),e.jsx("div",{className:"relative z-10 p-4 h-full",children:e.jsx("div",{className:"h-full flex items-center justify-center",children:e.jsx("div",{className:"w-full h-64 relative",children:e.jsxs("svg",{className:"w-full h-full",viewBox:"0 0 400 200",children:[e.jsx("polyline",{fill:"none",stroke:"#00ff00",strokeWidth:"2",points:"20,180 80,120 140,140 200,80 260,60 320,40 380,20",className:"opacity-80"}),e.jsx("polyline",{fill:"none",stroke:"#00cc00",strokeWidth:"2",points:"20,150 80,160 140,130 200,110 260,90 320,70 380,50",className:"opacity-60"}),[0,1,2,3,4].map(r=>e.jsx("line",{x1:"20",y1:40+r*40,x2:"380",y2:40+r*40,stroke:"rgba(0, 255, 0, 0.1)",strokeWidth:"1"},r)),[20,80,140,200,260,320,380].map((r,s)=>e.jsx("circle",{cx:r,cy:180-s*20-Math.random()*40,r:"3",fill:"#00ff00",className:"animate-pulse"},s))]})})})}),e.jsx("div",{className:"absolute bottom-0 left-0 right-0 bg-matrix-green/10 border-t border-matrix-green/30 p-2",children:e.jsxs("div",{className:"flex items-center justify-between text-xs font-mono text-matrix-green/60",children:[e.jsx("span",{children:"MATRIX_PROTOCOL_v3.0"}),e.jsxs("span",{children:["SYNC: ",new Date().toLocaleTimeString()]}),e.jsx("span",{children:"LATENCY: 12ms"})]})}),e.jsx("div",{className:"absolute inset-0 pointer-events-none",children:e.jsx("div",{className:"w-full h-0.5 bg-gradient-to-r from-transparent via-matrix-green to-transparent animate-pulse"})})]})},b={title:"Features/ChartRenderer",component:a,parameters:{layout:"padded",backgrounds:{default:"dark",values:[{name:"dark",value:"#000000"}]}},decorators:[t=>e.jsx("div",{className:"min-h-[500px] bg-black p-6",children:e.jsx("div",{className:"h-96 w-full",children:e.jsx(t,{})})})]},i={args:{chartId:"crypto-prices",title:"CRYPTOCURRENCY ANALYTICS",height:500}},l={args:{chartId:"btc-price",title:"BTC PRICE TRACKER",height:300},decorators:[t=>e.jsx("div",{className:"min-h-[400px] bg-black p-6",children:e.jsx("div",{className:"w-96 mx-auto",children:e.jsx(t,{})})})]},c={args:{chartId:"matrix-analytics",title:"MATRIX BLOCKCHAIN ANALYTICS",height:600},decorators:[t=>e.jsx("div",{className:"fixed inset-0 bg-black p-8",children:e.jsx("div",{className:"h-full w-full",children:e.jsx(t,{})})})],parameters:{layout:"fullscreen"}},n={render:()=>e.jsxs("div",{className:"grid grid-cols-2 gap-4 p-6 bg-black min-h-screen",children:[e.jsx(a,{chartId:"btc-chart",title:"BITCOIN ANALYTICS",height:300}),e.jsx(a,{chartId:"eth-chart",title:"ETHEREUM ANALYTICS",height:300}),e.jsx(a,{chartId:"volume-chart",title:"TRADING VOLUME",height:300}),e.jsx(a,{chartId:"portfolio-chart",title:"PORTFOLIO VALUE",height:300})]}),parameters:{layout:"fullscreen"}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    chartId: 'crypto-prices',
    title: 'CRYPTOCURRENCY ANALYTICS',
    height: 500
  }
}`,...i.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    chartId: 'btc-price',
    title: 'BTC PRICE TRACKER',
    height: 300
  },
  decorators: [Story => <div className="min-h-[400px] bg-black p-6">
        <div className="w-96 mx-auto">
          <Story />
        </div>
      </div>]
}`,...l.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    chartId: 'matrix-analytics',
    title: 'MATRIX BLOCKCHAIN ANALYTICS',
    height: 600
  },
  decorators: [Story => <div className="fixed inset-0 bg-black p-8">
        <div className="h-full w-full">
          <Story />
        </div>
      </div>],
  parameters: {
    layout: 'fullscreen'
  }
}`,...c.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <div className="grid grid-cols-2 gap-4 p-6 bg-black min-h-screen">
      <MatrixChartRenderer chartId="btc-chart" title="BITCOIN ANALYTICS" height={300} />
      <MatrixChartRenderer chartId="eth-chart" title="ETHEREUM ANALYTICS" height={300} />
      <MatrixChartRenderer chartId="volume-chart" title="TRADING VOLUME" height={300} />
      <MatrixChartRenderer chartId="portfolio-chart" title="PORTFOLIO VALUE" height={300} />
    </div>,
  parameters: {
    layout: 'fullscreen'
  }
}`,...n.parameters?.docs?.source}}};const j=["CryptoChart","CompactChart","FullScreenMatrix","MultiMetrics"];export{l as CompactChart,i as CryptoChart,c as FullScreenMatrix,n as MultiMetrics,j as __namedExportsOrder,b as default};
