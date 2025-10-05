import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{R as m}from"./iframe-lSEetYu3.js";const p=({theme:r="dark",className:u})=>{const f=m.useRef(null);return m.useEffect(()=>{const n=f.current;if(!n)return;const t=n.getContext("2d");if(!t)return;(()=>{n.width=n.offsetWidth,n.height=n.offsetHeight})();const g="01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン",o=14,y=Math.floor(n.width/o),s=new Array(y).fill(1),b=setInterval(()=>{const h=r==="light";h?t.fillStyle="rgba(255, 255, 255, 0.03)":t.fillStyle="rgba(0, 0, 0, 0.03)",t.fillRect(0,0,n.width,n.height),t.font=`${o}px monospace`;for(let a=0;a<s.length;a++){const v=g[Math.floor(Math.random()*g.length)],x=Math.random()*.3+.4;h?t.fillStyle=`rgba(13, 115, 119, ${x})`:t.fillStyle=`rgba(51, 255, 51, ${x})`,t.fillText(v,a*o,s[a]*o),s[a]*o>n.height&&Math.random()>.975&&(s[a]=0),s[a]++}},50);return()=>{clearInterval(b)}},[r]),e.jsx("canvas",{ref:f,className:u,style:{background:r==="light"?"#ffffff":"#000000",width:"100%",height:"100%"}})},T={title:"Matrix/MatrixRain",component:p,parameters:{layout:"fullscreen",backgrounds:{default:"dark",values:[{name:"dark",value:"#000000"},{name:"light",value:"#ffffff"}]}},argTypes:{theme:{control:"select",options:["light","dark"]}}},i={args:{theme:"dark"},parameters:{backgrounds:{default:"dark"}}},l={args:{theme:"light"},parameters:{backgrounds:{default:"light"}}},d={render:r=>e.jsxs("div",{style:{width:"600px",height:"400px",border:"2px solid #00ff00",borderRadius:"8px",overflow:"hidden",position:"relative"},children:[e.jsx(p,{...r}),e.jsxs("div",{style:{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)",background:"rgba(0, 0, 0, 0.8)",color:"#00ff00",padding:"20px",borderRadius:"8px",textAlign:"center",fontFamily:"monospace",textShadow:"0 0 10px #00ff00"},children:[e.jsx("h3",{style:{margin:"0 0 10px 0"},children:"MATRIX INTERFACE"}),e.jsx("p",{style:{margin:0,fontSize:"14px"},children:"Connection Established"})]})]}),args:{theme:"dark"}},c={render:r=>e.jsxs("div",{style:{width:"100%",height:"500px",position:"relative",background:"linear-gradient(135deg, #000 0%, #003300 50%, #000 100%)"},children:[e.jsx(p,{...r,style:{position:"absolute",top:0,left:0,opacity:.3}}),e.jsxs("div",{style:{position:"absolute",top:0,left:0,right:0,bottom:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",color:"#00ff00",fontFamily:"monospace",textAlign:"center",zIndex:1},children:[e.jsx("h1",{style:{fontSize:"48px",margin:"0 0 20px 0",textShadow:"0 0 20px #00ff00",animation:"pulse 2s infinite"},children:"CRYPTOWEBB"}),e.jsx("p",{style:{fontSize:"18px",margin:"0 0 30px 0",opacity:.8},children:"Advanced Cryptocurrency Analytics Platform"}),e.jsx("div",{style:{padding:"12px 24px",border:"2px solid #00ff00",borderRadius:"4px",backgroundColor:"rgba(0, 255, 0, 0.1)",textShadow:"0 0 10px #00ff00"},children:"ENTER THE MATRIX"})]})]}),args:{theme:"dark"}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    theme: 'dark'
  },
  parameters: {
    backgrounds: {
      default: 'dark'
    }
  }
}`,...i.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    theme: 'light'
  },
  parameters: {
    backgrounds: {
      default: 'light'
    }
  }
}`,...l.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: args => <div style={{
    width: '600px',
    height: '400px',
    border: '2px solid #00ff00',
    borderRadius: '8px',
    overflow: 'hidden',
    position: 'relative'
  }}>
      <MatrixRainDemo {...args} />
      <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: 'rgba(0, 0, 0, 0.8)',
      color: '#00ff00',
      padding: '20px',
      borderRadius: '8px',
      textAlign: 'center',
      fontFamily: 'monospace',
      textShadow: '0 0 10px #00ff00'
    }}>
        <h3 style={{
        margin: '0 0 10px 0'
      }}>MATRIX INTERFACE</h3>
        <p style={{
        margin: 0,
        fontSize: '14px'
      }}>Connection Established</p>
      </div>
    </div>,
  args: {
    theme: 'dark'
  }
}`,...d.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: args => <div style={{
    width: '100%',
    height: '500px',
    position: 'relative',
    background: 'linear-gradient(135deg, #000 0%, #003300 50%, #000 100%)'
  }}>
      <MatrixRainDemo {...args} style={{
      position: 'absolute',
      top: 0,
      left: 0,
      opacity: 0.3
    }} />
      <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#00ff00',
      fontFamily: 'monospace',
      textAlign: 'center',
      zIndex: 1
    }}>
        <h1 style={{
        fontSize: '48px',
        margin: '0 0 20px 0',
        textShadow: '0 0 20px #00ff00',
        animation: 'pulse 2s infinite'
      }}>
          CRYPTOWEBB
        </h1>
        <p style={{
        fontSize: '18px',
        margin: '0 0 30px 0',
        opacity: 0.8
      }}>
          Advanced Cryptocurrency Analytics Platform
        </p>
        <div style={{
        padding: '12px 24px',
        border: '2px solid #00ff00',
        borderRadius: '4px',
        backgroundColor: 'rgba(0, 255, 0, 0.1)',
        textShadow: '0 0 10px #00ff00'
      }}>
          ENTER THE MATRIX
        </div>
      </div>
    </div>,
  args: {
    theme: 'dark'
  }
}`,...c.parameters?.docs?.source}}};const C=["DarkTheme","LightTheme","Contained","BackgroundOverlay"];export{c as BackgroundOverlay,d as Contained,i as DarkTheme,l as LightTheme,C as __namedExportsOrder,T as default};
