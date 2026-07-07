import{t as F,U,P as T,F as A,j as s,L,a3 as O,e as D}from"./ui-Bf5JS19o.js";import{r as E}from"./vendor-KS-HtBbU.js";import{a as g,f as p,B as $,b as Q}from"./index-BElfTswC.js";import{C as V,a as B,b as I}from"./Card-xrQm9Tn_.js";import"./validation-Drc2uKKj.js";const M=e=>g.get("/reports/sales",{params:e}),H=e=>g.get("/reports/customers",{params:e}),Z=e=>g.get("/reports/inventory",{params:e}),_=e=>g.get("/reports/profit-loss",{params:e});function z(e,m="export.csv"){if(!e||!e.length)return;const o=Object.keys(e[0]),u=[o.join(","),...e.map(f=>o.map(c=>{const r=f[c];if(r==null)return"";const d=String(r);return d.includes(",")||d.includes('"')||d.includes(`
`)?`"${d.replace(/"/g,'""')}"`:d}).join(","))].join(`
`),l="\uFEFF",x=new Blob([l+u],{type:"text/csv;charset=utf-8;"}),n=URL.createObjectURL(x),t=document.createElement("a");t.href=n,t.download=m,document.body.appendChild(t),t.click(),document.body.removeChild(t),URL.revokeObjectURL(n)}function S(e,m){const o=window.open("","_blank");o.document.write(`
    <html><head><title>${e}</title>
    <style>
      body { font-family: system-ui, sans-serif; padding: 40px; color: #1e293b; }
      h1 { font-size: 24px; margin-bottom: 8px; }
      table { width: 100%; border-collapse: collapse; margin-top: 20px; }
      th, td { padding: 10px 12px; text-align: left; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
      th { background: #f8fafc; font-weight: 600; color: #475569; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; }
      .summary { display: flex; gap: 24px; margin: 20px 0; flex-wrap: wrap; }
      .stat { background: #f8fafc; padding: 16px 24px; border-radius: 8px; border: 1px solid #e2e8f0; }
      .stat-label { font-size: 12px; color: #64748b; text-transform: uppercase; }
      .stat-value { font-size: 20px; font-weight: 700; color: #0f172a; margin-top: 4px; }
      .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; }
    </style></head><body>
    <h1>${e}</h1>
    <p style="color:#64748b;">Generated ${new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})}</p>
    ${m}
    <div class="footer">Enterprise CRM — Confidential</div>
    <script>window.print();<\/script>
    </body></html>
  `),o.document.close()}function G(e,m){return!e||!e.length?[]:e.map((o,u)=>{const l={"#":u+1};return Object.keys(o).forEach(x=>{const n=o[x];n==null?l[x]="":typeof n=="object"&&!Array.isArray(n)?Object.keys(n).forEach(t=>{l[`${x}_${t}`]=n[t]??""}):Array.isArray(n)?l[x]=n.length:l[x]=n}),l})}const P=[{title:"Sales Report",desc:"Monthly sales performance and trends",icon:F,color:"bg-green-100 text-green-600 dark:bg-green-900/30",key:"sales"},{title:"Customer Report",desc:"Customer acquisition and retention metrics",icon:U,color:"bg-blue-100 text-blue-600 dark:bg-blue-900/30",key:"customers"},{title:"Inventory Report",desc:"Stock levels and product performance",icon:T,color:"bg-amber-100 text-amber-600 dark:bg-amber-900/30",key:"inventory"},{title:"Profit & Loss",desc:"Revenue, expenses and net profit analysis",icon:A,color:"bg-purple-100 text-purple-600 dark:bg-purple-900/30",key:"pnl"}],K={sales:M,customers:H,inventory:Z,pnl:_};function v(e){return Q({queryKey:[`report-${e}`],queryFn:K[e],enabled:!1,staleTime:6e4})}function W({report:e,onView:m,onExport:o,loading:u}){return s.jsx(V,{hover:!0,children:s.jsxs("div",{className:"flex items-start gap-4",children:[s.jsx("div",{className:`w-12 h-12 rounded-xl ${e.color} flex items-center justify-center`,children:s.jsx(e.icon,{size:24})}),s.jsxs("div",{className:"flex-1",children:[s.jsx("h3",{className:"font-semibold text-text",children:e.title}),s.jsx("p",{className:"text-sm text-text-secondary mt-1",children:e.desc}),s.jsxs("div",{className:"flex gap-2 mt-4",children:[s.jsx($,{variant:"secondary",size:"sm",icon:u?s.jsx(L,{size:14,className:"animate-spin"}):s.jsx(D,{size:14}),onClick:m,children:"View"}),s.jsx($,{variant:"ghost",size:"sm",icon:s.jsx(O,{size:14}),onClick:o,children:"Export"})]})]})]})})}function ae(){const e=v("sales"),m=v("customers"),o=v("inventory"),u=v("pnl"),l={sales:e,customers:m,inventory:o,pnl:u},x=E.useCallback(async t=>{var C,w,R;const c=await l[t].refetch(),r=(w=(C=c==null?void 0:c.data)==null?void 0:C.data)==null?void 0:w.data;if(!r)return;if(t==="pnl"){const{income:i,expenses:a,netProfit:j,salesRevenue:k,purchaseCost:N,incomeCount:J,expenseCount:q}=r;S("Profit & Loss Statement",`
        <div class="summary">
          <div class="stat"><div class="stat-label">Revenue</div><div class="stat-value">${p(k)}</div></div>
          <div class="stat"><div class="stat-label">Income</div><div class="stat-value">${p(i)}</div></div>
          <div class="stat"><div class="stat-label">Expenses</div><div class="stat-value">${p(a)}</div></div>
          <div class="stat"><div class="stat-label">Purchases</div><div class="stat-value">${p(N)}</div></div>
          <div class="stat" style="border-color:${j>=0?"#10b981":"#ef4444"}"><div class="stat-label">Net Profit</div><div class="stat-value">${p(j)}</div></div>
        </div>
        <table><thead><tr><th>Metric</th><th>Value</th></tr></thead>
        <tbody>
          <tr><td>Total Revenue</td><td>${p(k)}</td></tr>
          <tr><td>Total Income</td><td>${p(i)}</td></tr>
          <tr><td>Total Expenses</td><td>${p(a)} (${q} transactions)</td></tr>
          <tr><td>Purchase Cost</td><td>${p(N)}</td></tr>
          <tr><td><strong>Net Profit</strong></td><td><strong>${p(j)}</strong></td></tr>
        </tbody></table>
      `);return}const d=r.orders||r.customers||r.products||[],y=r.summary||{},b=Object.entries(y).map(([i,a])=>`<div class="stat"><div class="stat-label">${i.replace(/([A-Z])/g," $1").trim()}</div><div class="stat-value">${typeof a=="number"&&(i.includes("Value")||i.includes("Revenue")||i.includes("Spent")||i.includes("Payroll"))?p(a):a}</div></div>`).join(""),h=d.slice(0,50).map(i=>`<tr>${Object.values(i).slice(0,6).map(a=>`<td>${(a==null?void 0:a.name)||(a==null?void 0:a.firstName)||(a==null?void 0:a.toString().slice(0,40))||"—"}</td>`).join("")}</tr>`).join("");S(((R=P.find(i=>i.key===t))==null?void 0:R.title)||t,`
      <div class="summary">${b}</div>
      ${d.length?`<table><thead><tr>${Object.keys(d[0]).slice(0,6).map(i=>`<th>${i.replace(/([A-Z])/g," $1").trim()}</th>`).join("")}</tr></thead><tbody>${h}</tbody></table>`:"<p>No data available</p>"}
    `)},[e,m,o,u]),n=E.useCallback(async t=>{var b,h;const c=await l[t].refetch(),r=(h=(b=c==null?void 0:c.data)==null?void 0:b.data)==null?void 0:h.data;if(!r)return;if(t==="pnl"){z([r],`profit-loss-${Date.now()}.csv`);return}const d=r.orders||r.customers||r.products||[];if(!d.length)return;const y=G(d);z(y,`${t}-report-${Date.now()}.csv`)},[e,m,o,u]);return s.jsxs("div",{className:"space-y-6",children:[s.jsxs("div",{children:[s.jsx("h1",{className:"text-2xl font-bold text-text",children:"Reports"}),s.jsx("p",{className:"text-sm text-text-secondary mt-1",children:"Business analytics and exportable reports"})]}),s.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:P.map(t=>{var f;return s.jsx(W,{report:t,onView:()=>x(t.key),onExport:()=>n(t.key),loading:(f=l[t.key])==null?void 0:f.isFetching},t.key)})}),s.jsxs(V,{children:[s.jsx(B,{children:s.jsx(I,{children:"Quick Export"})}),s.jsx("div",{className:"flex flex-wrap gap-3",children:[{label:"Export Sales (CSV)",key:"sales"},{label:"Export Customers (CSV)",key:"customers"},{label:"Export Inventory (CSV)",key:"inventory"},{label:"P&L Statement",key:"pnl"}].map(({label:t,key:f})=>{var c;return s.jsx($,{variant:"secondary",size:"sm",icon:(c=l[f])!=null&&c.isFetching?s.jsx(L,{size:14,className:"animate-spin"}):s.jsx(O,{size:14}),onClick:()=>n(f),children:t},t)})})]})]})}export{ae as default};
