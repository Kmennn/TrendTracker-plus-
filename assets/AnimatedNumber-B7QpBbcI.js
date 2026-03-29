import{c as i}from"./index-DDyvGg-O.js";import{j as u}from"./vendor-query-BWBd5ODA.js";import{r as s}from"./vendor-react-cK0GWqJY.js";import{u as a,a as m,b as f}from"./vendor-motion-DY7izz62.js";/**
 * @license lucide-react v0.563.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const p=[["path",{d:"M12 6v6l4 2",key:"mmk7yg"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]],k=i("clock",p),y=({value:n})=>{const e=s.useRef(null),t=a(0),o=m(t,{damping:100,stiffness:100}),r=f(e,{once:!0});return s.useEffect(()=>{r&&t.set(n)},[t,r,n]),s.useEffect(()=>o.on("change",c=>{e.current&&(e.current.textContent=Intl.NumberFormat("en-US").format(c.toFixed(0)))}),[o]),u.jsx("span",{ref:e})};export{y as A,k as C};
//# sourceMappingURL=AnimatedNumber-B7QpBbcI.js.map
