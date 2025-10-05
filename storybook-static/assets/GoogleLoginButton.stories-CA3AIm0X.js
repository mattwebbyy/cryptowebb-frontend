import{j as e}from"./jsx-runtime-D_zvdyIk.js";const l=({onClick:r,disabled:n})=>e.jsxs("button",{onClick:r,disabled:n,className:"w-full flex items-center justify-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors",children:[e.jsx("svg",{className:"w-5 h-5",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 488 512",children:e.jsx("path",{fill:"#4285f4",d:"M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"})}),"Continue with Google"]});l.__docgenInfo={description:"",methods:[],displayName:"GoogleLoginButton",props:{onClick:{required:!0,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},disabled:{required:!1,tsType:{name:"boolean"},description:""}}};const c={title:"Auth/GoogleLoginButton",component:l,parameters:{layout:"padded",backgrounds:{default:"dark",values:[{name:"dark",value:"#000000"},{name:"light",value:"#ffffff"}]}},decorators:[r=>e.jsx("div",{className:"min-h-[200px] bg-black p-6 flex items-center justify-center",children:e.jsx("div",{className:"w-full max-w-md",children:e.jsx(r,{})})})]},a={args:{onClick:()=>console.log("Google login clicked")}},o={args:{onClick:()=>console.log("Google login clicked"),disabled:!0}},s={args:{onClick:()=>console.log("Google login clicked")},parameters:{backgrounds:{default:"light"}},decorators:[r=>e.jsx("div",{className:"min-h-[200px] bg-white p-6 flex items-center justify-center",children:e.jsx("div",{className:"w-full max-w-md",children:e.jsx(r,{})})})]},t={args:{onClick:()=>console.log("Google login clicked")},decorators:[r=>e.jsx("div",{className:"min-h-[400px] bg-black p-6 flex items-center justify-center",children:e.jsxs("div",{className:"w-full max-w-md bg-black border border-matrix-green/30 rounded-lg p-6",children:[e.jsx("h2",{className:"text-matrix-green text-xl font-semibold text-center mb-6",children:"Sign In"}),e.jsxs("div",{className:"space-y-4",children:[e.jsx("input",{type:"email",placeholder:"Email",className:"w-full px-3 py-2 bg-black border border-matrix-green/50 text-matrix-green rounded focus:border-matrix-green outline-none"}),e.jsx("input",{type:"password",placeholder:"Password",className:"w-full px-3 py-2 bg-black border border-matrix-green/50 text-matrix-green rounded focus:border-matrix-green outline-none"}),e.jsx("button",{className:"w-full bg-matrix-green text-black py-2 rounded hover:bg-matrix-green/80 transition-colors",children:"Sign In"}),e.jsxs("div",{className:"relative my-4",children:[e.jsx("hr",{className:"border-matrix-green/30"}),e.jsx("span",{className:"absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-black px-3 text-matrix-green/60 text-sm",children:"or"})]}),e.jsx(r,{})]})]})})]};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    onClick: () => console.log('Google login clicked')
  }
}`,...a.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    onClick: () => console.log('Google login clicked'),
    disabled: true
  }
}`,...o.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    onClick: () => console.log('Google login clicked')
  },
  parameters: {
    backgrounds: {
      default: 'light'
    }
  },
  decorators: [Story => <div className="min-h-[200px] bg-white p-6 flex items-center justify-center">
        <div className="w-full max-w-md">
          <Story />
        </div>
      </div>]
}`,...s.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    onClick: () => console.log('Google login clicked')
  },
  decorators: [Story => <div className="min-h-[400px] bg-black p-6 flex items-center justify-center">
        <div className="w-full max-w-md bg-black border border-matrix-green/30 rounded-lg p-6">
          <h2 className="text-matrix-green text-xl font-semibold text-center mb-6">Sign In</h2>
          
          <div className="space-y-4">
            <input type="email" placeholder="Email" className="w-full px-3 py-2 bg-black border border-matrix-green/50 text-matrix-green rounded focus:border-matrix-green outline-none" />
            <input type="password" placeholder="Password" className="w-full px-3 py-2 bg-black border border-matrix-green/50 text-matrix-green rounded focus:border-matrix-green outline-none" />
            <button className="w-full bg-matrix-green text-black py-2 rounded hover:bg-matrix-green/80 transition-colors">
              Sign In
            </button>
            
            <div className="relative my-4">
              <hr className="border-matrix-green/30" />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-black px-3 text-matrix-green/60 text-sm">
                or
              </span>
            </div>
            
            <Story />
          </div>
        </div>
      </div>]
}`,...t.parameters?.docs?.source}}};const d=["Default","Disabled","OnLightBackground","InForm"];export{a as Default,o as Disabled,t as InForm,s as OnLightBackground,d as __namedExportsOrder,c as default};
