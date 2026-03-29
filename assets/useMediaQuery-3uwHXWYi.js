import{r as c}from"./vendor-react-cK0GWqJY.js";function i(s){const[t,a]=c.useState(!1);return c.useEffect(()=>{const e=window.matchMedia(s);e.matches!==t&&a(e.matches);const n=()=>a(e.matches);return e.addEventListener("change",n),()=>e.removeEventListener("change",n)},[t,s]),t}export{i as u};
//# sourceMappingURL=useMediaQuery-3uwHXWYi.js.map
