import{r as e}from"./index.6460afdd.js";import{c as m,h as p}from"./client.352409db.js";const a=({value:t,name:r,hydrate:o=!0})=>{if(!t)return null;const n=o?"astro-slot":"astro-static-slot";return e.createElement(n,{name:r,suppressHydrationWarning:!0,dangerouslySetInnerHTML:{__html:t}})};a.shouldComponentUpdate=()=>!1;function y(t){for(const r in t)if(r.startsWith("__reactContainer"))return r}const h=t=>(r,o,{default:n,...f},{client:l})=>{if(!t.hasAttribute("ssr"))return;const s={identifierPrefix:t.getAttribute("prefix")};for(const[u,d]of Object.entries(f))o[u]=e.createElement(a,{value:d,name:u});const i=e.createElement(r,o,n!=null?e.createElement(a,{value:n}):n),c=y(t);return c&&delete t[c],l==="only"?e.startTransition(()=>{m(t,s).render(i)}):e.startTransition(()=>{p(t,i,s)})};export{h as default};
