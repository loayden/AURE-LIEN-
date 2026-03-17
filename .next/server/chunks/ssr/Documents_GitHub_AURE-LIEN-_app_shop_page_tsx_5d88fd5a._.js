module.exports=[15174,a=>{"use strict";var b=a.i(36214),c=a.i(325),d=a.i(67011),e=a.i(90463),f=a.i(19076),g=a.i(39442),h=a.i(6033),i=a.i(7041),j=a.i(19736);let k=(0,j.default)("Grid",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",ry:"2",key:"1m3agn"}],["line",{x1:"3",x2:"21",y1:"9",y2:"9",key:"1vqk6q"}],["line",{x1:"3",x2:"21",y1:"15",y2:"15",key:"o2sbyz"}],["line",{x1:"9",x2:"9",y1:"3",y2:"21",key:"13tij5"}],["line",{x1:"15",x2:"15",y1:"3",y2:"21",key:"1hpv9i"}]]);var l=a.i(78287);let m=(0,j.default)("List",[["line",{x1:"8",x2:"21",y1:"6",y2:"6",key:"7ey8pc"}],["line",{x1:"8",x2:"21",y1:"12",y2:"12",key:"rjfblc"}],["line",{x1:"8",x2:"21",y1:"18",y2:"18",key:"c3b1m8"}],["line",{x1:"3",x2:"3.01",y1:"6",y2:"6",key:"1g7gq3"}],["line",{x1:"3",x2:"3.01",y1:"12",y2:"12",key:"1pjlvk"}],["line",{x1:"3",x2:"3.01",y1:"18",y2:"18",key:"28t2mc"}]]);var n=a.i(58322);let o=(0,j.default)("SlidersHorizontal",[["line",{x1:"21",x2:"14",y1:"4",y2:"4",key:"obuewd"}],["line",{x1:"10",x2:"3",y1:"4",y2:"4",key:"1q6298"}],["line",{x1:"21",x2:"12",y1:"12",y2:"12",key:"1iu8h1"}],["line",{x1:"8",x2:"3",y1:"12",y2:"12",key:"ntss68"}],["line",{x1:"21",x2:"16",y1:"20",y2:"20",key:"14d8ph"}],["line",{x1:"12",x2:"3",y1:"20",y2:"20",key:"m0wm8r"}],["line",{x1:"14",x2:"14",y1:"2",y2:"6",key:"14e1ph"}],["line",{x1:"8",x2:"8",y1:"10",y2:"14",key:"1i6ji0"}],["line",{x1:"16",x2:"16",y1:"18",y2:"22",key:"1lctlv"}]]);var p=a.i(69293),q=a.i(25932),r=a.i(46448);let s=[{value:"default",label:"Featured"},{value:"newest",label:"Newest"},{value:"price-low",label:"Price: Low to High"},{value:"price-high",label:"Price: High to Low"}],t=[{label:"Under 1,000 EGP",min:0,max:1e3},{label:"1,000 - 5,000 EGP",min:1e3,max:5e3},{label:"5,000 - 10,000 EGP",min:5e3,max:1e4},{label:"10,000+ EGP",min:1e4,max:1/0}];function u(){return(0,b.jsxs)("div",{className:"pointer-events-none fixed inset-0 overflow-hidden z-0",children:[(0,b.jsx)(f.motion.div,{animate:{opacity:[.04,.08,.04]},transition:{duration:8,repeat:1/0},style:{position:"absolute",width:800,height:800,top:"-18%",right:"-12%",background:"radial-gradient(circle, rgba(198,169,98,0.07) 0%, transparent 65%)",filter:"blur(100px)"}}),(0,b.jsx)(f.motion.div,{animate:{opacity:[.03,.06,.03]},transition:{duration:10,repeat:1/0},style:{position:"absolute",width:600,height:600,bottom:"5%",left:"-10%",background:"radial-gradient(circle, rgba(150,140,220,0.05) 0%, transparent 65%)",filter:"blur(90px)"}})]})}function v(){let[a,j]=(0,r.useState)("default"),[v,w]=(0,r.useState)(!1),[x,y]=(0,r.useState)("grid"),[z,A]=(0,r.useState)({priceRange:null,search:""}),[B,C]=(0,r.useState)(!1),[D,E]=(0,r.useState)([]),F=(0,r.useRef)(null),{scrollYProgress:G}=(0,g.useScroll)({target:F,offset:["start start","end start"]}),H=(0,h.useTransform)(G,[0,.8],[1,0]),I=(0,h.useTransform)(G,[0,1],["0%","20%"]),J=(0,r.useMemo)(()=>{let a=[...d.default];if(null!==z.priceRange){let b=t[z.priceRange];a=a.filter(a=>a.price>=b.min&&a.price<=b.max)}return z.search&&(a=a.filter(a=>a.name.toLowerCase().includes(z.search.toLowerCase())||a.description?.toLowerCase().includes(z.search.toLowerCase()))),a},[z]),K=(0,r.useMemo)(()=>{let b=[...J];return"price-low"===a&&b.sort((a,b)=>a.price-b.price),"price-high"===a&&b.sort((a,b)=>b.price-a.price),b},[J,a]),L=s.find(b=>b.value===a)?.label??"Featured";return(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)("style",{children:`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@200;300;400;500&display=swap');
        * { --gold: #C6A962; --dark: #080808; }
        body { background: var(--dark); }

        @keyframes fadeUp {
          from { opacity:0; transform:translateY(20px); }
          to { opacity:1; transform:translateY(0); }
        }
        @keyframes slideIn {
          from { opacity:0; transform:translateX(-20px); }
          to { opacity:1; transform:translateX(0); }
        }

        .sh1 { animation: fadeUp 1s cubic-bezier(0.22,1,0.36,1) 0.15s both; }
        .sh2 { animation: fadeUp 1s cubic-bezier(0.22,1,0.36,1) 0.35s both; }
        .sh3 { animation: fadeUp 1s cubic-bezier(0.22,1,0.36,1) 0.55s both; }

        .glass {
          background: linear-gradient(135deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.03) 100%);
          backdrop-filter: blur(24px) saturate(160%);
          -webkit-backdrop-filter: blur(24px) saturate(160%);
          border: 1px solid rgba(255,255,255,0.10);
          box-shadow: 0 16px 48px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.16);
        }
        .glass-md {
          background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%);
          backdrop-filter: blur(20px) saturate(150%);
          -webkit-backdrop-filter: blur(20px) saturate(150%);
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 12px 36px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.10);
        }
        .gold-glass {
          background: linear-gradient(135deg, rgba(198,169,98,0.14) 0%, rgba(198,169,98,0.04) 100%);
          backdrop-filter: blur(20px) saturate(150%);
          -webkit-backdrop-filter: blur(20px) saturate(150%);
          border: 1px solid rgba(198,169,98,0.22);
          box-shadow: 0 8px 32px rgba(198,169,98,0.08), inset 0 1px 0 rgba(255,255,255,0.14);
        }

        .sort-dropdown, .filter-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          min-width: 200px;
          z-index: 50;
          background: linear-gradient(135deg, rgba(18,18,20,0.95) 0%, rgba(10,10,12,0.98) 100%);
          backdrop-filter: blur(28px) saturate(160%);
          -webkit-backdrop-filter: blur(28px) saturate(160%);
          border: 1px solid rgba(255,255,255,0.10);
          box-shadow: 0 24px 60px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.10);
          border-radius: 16px;
          overflow: hidden;
          max-height: 400px;
          overflow-y: auto;
        }
        .sort-option, .filter-option {
          padding: 11px 18px;
          font-size: 10px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          font-family: 'Jost', sans-serif;
          font-weight: 300;
          color: rgba(255,255,255,0.5);
          cursor: pointer;
          transition: all 0.25s;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .sort-option:last-child, .filter-option:last-child { border-bottom: none; }
        .sort-option:hover, .filter-option:hover { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.85); }
        .sort-option.active, .filter-option.active { color: var(--gold); background: rgba(198,169,98,0.07); }

        /* Scrollbar for dropdowns */
        .sort-dropdown::-webkit-scrollbar, .filter-dropdown::-webkit-scrollbar {
          width: 6px;
        }
        .sort-dropdown::-webkit-scrollbar-track, .filter-dropdown::-webkit-scrollbar-track {
          background: transparent;
        }
        .sort-dropdown::-webkit-scrollbar-thumb, .filter-dropdown::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 3px;
        }

        .scrollbar-hide { scrollbar-width: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}),(0,b.jsxs)(f.motion.main,{initial:{opacity:0},animate:{opacity:1},transition:{duration:.9},className:"relative bg-[#080808] text-white min-h-screen",style:{fontFamily:"'Jost', sans-serif"},children:[(0,b.jsx)(u,{}),(0,b.jsxs)("section",{ref:F,className:"relative pt-32 pb-24 px-6 overflow-hidden",children:[(0,b.jsx)("div",{className:"absolute inset-0 pointer-events-none",style:{background:"radial-gradient(ellipse at 50% 0%, rgba(198,169,98,0.06) 0%, transparent 60%)"}}),(0,b.jsxs)(f.motion.div,{style:{y:I,opacity:H},className:"relative z-10 text-center max-w-3xl mx-auto",children:[(0,b.jsx)("div",{className:"sh1 mb-7 flex justify-center",children:(0,b.jsxs)("span",{className:"glass inline-flex items-center gap-2 px-5 py-2 rounded-full text-[9px] text-white/45 tracking-[0.4em] uppercase font-light",children:[(0,b.jsx)(p.Sparkles,{size:12}),d.default.length," Curated Pieces"]})}),(0,b.jsxs)("h1",{className:"sh2 font-light text-white leading-none mb-5",style:{fontFamily:"'Cormorant Garamond', serif",fontSize:"clamp(3rem, 8vw, 7rem)",letterSpacing:"0.04em"},children:["The Quiet",(0,b.jsx)("br",{}),(0,b.jsx)("em",{style:{color:"#C6A962",fontStyle:"italic"},children:"Luxury Edit"})]}),(0,b.jsx)("p",{className:"sh3 text-white/35 font-light max-w-md mx-auto leading-relaxed",style:{fontSize:"0.85rem",letterSpacing:"0.12em"},children:"Every piece crafted with meticulous care — timeless elegance, refined for the modern connoisseur."})]})]}),(0,b.jsxs)("div",{className:"relative z-10 max-w-7xl mx-auto px-6 mb-10",children:[(0,b.jsx)(f.motion.div,{initial:{opacity:0,y:20},whileInView:{opacity:1,y:0},viewport:{once:!0},transition:{duration:.6},className:"mb-6",children:(0,b.jsxs)("div",{className:"glass-md flex items-center gap-3 px-5 py-3.5 rounded-2xl",children:[(0,b.jsx)(n.Search,{size:16,className:"text-white/40"}),(0,b.jsx)("input",{type:"text",placeholder:"Search by name or collection...",value:z.search,onChange:a=>A({...z,search:a.target.value}),className:"bg-transparent flex-1 outline-none text-white placeholder-white/30 text-[13px] tracking-wide"}),z.search&&(0,b.jsx)(f.motion.button,{whileHover:{scale:1.1},whileTap:{scale:.9},onClick:()=>A({...z,search:""}),className:"text-white/40 hover:text-white/70 transition-colors",children:(0,b.jsx)(q.X,{size:16})})]})}),(0,b.jsxs)("div",{className:"flex items-center justify-between px-6 py-4 rounded-2xl glass-md",children:[(0,b.jsxs)("div",{className:"flex items-center gap-4",children:[(0,b.jsx)(o,{strokeWidth:1.3,className:"w-4 h-4 text-white/25"}),(0,b.jsx)("div",{className:"w-px h-5",style:{background:"rgba(255,255,255,0.08)"}}),(0,b.jsxs)("span",{className:"text-white/30 text-[10px] tracking-[0.35em] uppercase",children:[K.length," Results"]})]}),(0,b.jsxs)("div",{className:"flex items-center gap-3",children:[(0,b.jsx)(f.motion.button,{whileHover:{scale:1.08},whileTap:{scale:.95},onClick:()=>y("grid"),className:"p-2.5 rounded-lg transition-all",style:"grid"===x?{background:"rgba(198,169,98,0.15)",border:"1px solid rgba(198,169,98,0.3)",color:"#C6A962"}:{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.4)"},children:(0,b.jsx)(k,{size:16})}),(0,b.jsx)(f.motion.button,{whileHover:{scale:1.08},whileTap:{scale:.95},onClick:()=>y("list"),className:"p-2.5 rounded-lg transition-all",style:"list"===x?{background:"rgba(198,169,98,0.15)",border:"1px solid rgba(198,169,98,0.3)",color:"#C6A962"}:{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.4)"},children:(0,b.jsx)(m,{size:16})})]}),(0,b.jsxs)("div",{className:"relative",children:[(0,b.jsxs)("button",{onClick:()=>w(!v),className:"flex items-center gap-3 px-5 py-2.5 rounded-full transition-all duration-300",style:v?{background:"linear-gradient(135deg, rgba(198,169,98,0.14), rgba(198,169,98,0.05))",border:"1px solid rgba(198,169,98,0.25)",backdropFilter:"blur(16px)"}:{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.09)",backdropFilter:"blur(16px)"},children:[(0,b.jsx)("span",{className:"text-[10px] tracking-[0.28em] uppercase font-light",style:{color:v?"#C6A962":"rgba(255,255,255,0.55)"},children:L}),(0,b.jsx)(f.motion.span,{animate:{rotate:180*!!v},transition:{duration:.3},children:(0,b.jsx)(i.ChevronDown,{strokeWidth:1.3,className:"w-3.5 h-3.5",style:{color:v?"#C6A962":"rgba(255,255,255,0.35)"}})})]}),v&&(0,b.jsx)(f.motion.div,{initial:{opacity:0,y:-8,scale:.97},animate:{opacity:1,y:0,scale:1},exit:{opacity:0,y:-8},transition:{duration:.25,ease:[.22,1,.36,1]},className:"sort-dropdown",children:s.map(c=>(0,b.jsx)("div",{className:`sort-option ${a===c.value?"active":""}`,onClick:()=>{j(c.value),w(!1)},children:c.label},c.value))})]})]}),(0,b.jsxs)(f.motion.div,{initial:{opacity:0},whileInView:{opacity:1},viewport:{once:!0},transition:{delay:.15,duration:.6},className:"flex items-center gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide",children:[(0,b.jsx)("span",{className:"text-white/30 text-[9px] tracking-widest uppercase flex-shrink-0 mr-2",children:"Price:"}),(0,b.jsx)(f.motion.button,{whileHover:{scale:1.05},whileTap:{scale:.95},onClick:()=>A({...z,priceRange:null}),className:"px-3 py-1.5 rounded-full text-[9px] tracking-[0.2em] uppercase font-light transition-all whitespace-nowrap flex-shrink-0",style:null===z.priceRange?{background:"rgba(198,169,98,0.15)",border:"1px solid rgba(198,169,98,0.3)",color:"#C6A962"}:{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.4)"},children:"All Prices"}),t.map((a,c)=>(0,b.jsx)(f.motion.button,{whileHover:{scale:1.05},whileTap:{scale:.95},onClick:()=>A({...z,priceRange:c}),className:"px-3 py-1.5 rounded-full text-[9px] tracking-[0.2em] uppercase font-light transition-all whitespace-nowrap flex-shrink-0",style:z.priceRange===c?{background:"rgba(198,169,98,0.15)",border:"1px solid rgba(198,169,98,0.3)",color:"#C6A962"}:{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.4)"},children:a.label},c))]})]}),(0,b.jsxs)("section",{className:"relative z-10 max-w-7xl mx-auto px-6 pb-32",children:[(0,b.jsx)("div",{className:"mb-10 h-px",style:{background:"linear-gradient(90deg, transparent, rgba(198,169,98,0.18), transparent)"}}),(0,b.jsx)(e.AnimatePresence,{mode:"wait",children:K.length>0?(0,b.jsx)(f.motion.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},transition:{duration:.3},className:"grid"===x?"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6":"space-y-4",children:K.map((a,d)=>(0,b.jsxs)(f.motion.div,{initial:{opacity:0,y:30},whileInView:{opacity:1,y:0},viewport:{once:!0},transition:{delay:d%("grid"===x?4:1)*.07,duration:.75},className:"list"===x?"glass-md rounded-2xl p-4 flex gap-4 items-start":"",children:["list"===x&&(0,b.jsx)("div",{className:"w-24 h-24 rounded-lg glass flex-shrink-0 relative overflow-hidden",children:a.images?.[0]&&(0,b.jsx)("div",{className:"w-full h-full bg-white/5"})}),(0,b.jsxs)("div",{className:"list"===x?"flex-1":"",children:[(0,b.jsx)(c.default,{product:a}),"list"===x&&(0,b.jsxs)("div",{className:"mt-3 flex items-center justify-between",children:[(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"text-white/70 text-[12px] leading-relaxed",children:a.description}),(0,b.jsxs)("p",{className:"text-white font-light mt-2",style:{fontFamily:"'Cormorant Garamond', serif",fontSize:"1.2rem",color:"#C6A962"},children:["EGP ",a.price.toLocaleString()]})]}),(0,b.jsx)(f.motion.button,{whileHover:{scale:1.15},whileTap:{scale:.9},onClick:()=>{var b;return b=String(a._id),void E(a=>a.includes(b)?a.filter(a=>a!==b):[...a,b])},className:"p-3 rounded-full transition-all",style:{background:D.includes(String(a._id))?"rgba(255,80,80,0.15)":"rgba(255,255,255,0.05)",border:D.includes(String(a._id))?"1px solid rgba(255,100,100,0.3)":"1px solid rgba(255,255,255,0.1)"},children:(0,b.jsx)(l.Heart,{size:18,className:D.includes(String(a._id))?"fill-red-400 text-red-400":"text-white/40"})})]})]})]},a._id))},x):(0,b.jsxs)(f.motion.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},exit:{opacity:0,y:-20},className:"py-32 text-center",children:[(0,b.jsx)("p",{className:"text-white/40 text-base tracking-[0.1em] font-light mb-4",children:"No pieces match your filters"}),(0,b.jsx)(f.motion.button,{whileHover:{scale:1.05},whileTap:{scale:.95},onClick:()=>A({priceRange:null,search:""}),className:"gold-glass px-6 py-3 rounded-full text-white/80 text-[10px] tracking-[0.2em] uppercase font-light hover:text-white transition-colors",children:"Clear All Filters"})]})})]})]})]})}a.s(["default",()=>v],15174)}];

//# sourceMappingURL=Documents_GitHub_AURE-LIEN-_app_shop_page_tsx_5d88fd5a._.js.map