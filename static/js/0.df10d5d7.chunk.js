(this.webpackJsonprebuild=this.webpackJsonprebuild||[]).push([[0],{266:function(e,t,n){"use strict";n.r(t),n.d(t,"default",function(){return c});var f=n(15),h=n(18),a=n(22),w=n(0),x=n(11),O=n(100),p=n(3),m=a.ethers.constants.Zero,v={bond:m,want:m,I:{bond:"",want:""},old:{bond:"",want:""}},y=function(e,t){return a.ethers.utils.formatUnits(e,t||18)},g=function(e,t){return a.ethers.utils.parseUnits(e||"0",t||18)};function c(){Object(w.useContext)(x.e).state.controller;var e=Object(w.useContext)(x.f),t=e.liteState,n=t.pool,a=t.bond,c=t.want,o=(t.coll,t.data),i=e.classesChild,s=e.handleClick,e=Object(w.useReducer)(function(e,t){return Object(f.a)(Object(f.a)({},e),t)},v),e=Object(h.a)(e,2),l=e[0],r=e[1],e=Object(w.useState)(!0),e=Object(h.a)(e,2),b=e[0],d=e[1],e=Object(w.useState)(""),e=Object(h.a)(e,2),j=e[0],u=e[1];return Object(w.useEffect)(function(){return l==v||r(v)},[n]),Object(w.useEffect)(function(){var t=g(l.I.bond),e=g(l.I.want);t.eq(l.bond)?e.eq(l.want)||r({bond:e,want:e,I:Object(f.a)(Object(f.a)({},l.I),{},{bond:y(e)})}):n.ct.get_dy(t).then(function(e){u(""),r({bond:t,want:e,I:Object(f.a)(Object(f.a)({},l.I),{},{want:y(e)})})}).catch(function(){u("insufficient"),r({bond:m,want:m})})},[l.I]),Object(w.useMemo)(function(){return Object(p.jsxs)("div",{className:i.root,children:[Object(p.jsxs)("div",{className:i.amount,children:[Object(p.jsx)("div",{children:b?Object(p.jsx)(O.a,{title:"bond",State:{state:l,setState:r,token:a,max:o.balance.bond,if_max:o.allowance.bond.gt("100000000000000000000000000000000")},style:{height:"90px"}}):Object(p.jsx)(O.a,{title:"want",State:{state:l,setState:r,token:c,max:o.balance.want,if_max:o.allowance.want.gt("100000000000000000000000000000000")},style:{height:"90px"}})}),Object(p.jsx)("span",{className:i.icon,onClick:function(){d(!b),r(v)},children:"swap_horiz"}),b?Object(p.jsx)(O.a,{title:"want",State:{state:l,setState:r,token:c,max:o.balance.want,if_max:o.allowance.want.gt("100000000000000000000000000000000")},style:{height:"90px"}}):Object(p.jsx)(O.a,{title:"bond",State:{state:l,setState:r,token:a,max:o.balance.bond,if_max:o.allowance.bond.gt("100000000000000000000000000000000")},style:{height:"90px"}})]}),Object(p.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[Object(p.jsx)("div",{style:{fontFamily:"Helvetica",fontSize:"14px",color:"red"},children:j}),Object(p.jsx)(O.b,{apy:parseFloat(o.apy).toPrecision(3),info:"APY is the fixed-rate lending interest received by \n          lender. This is the total cost for the 2-year-duration\n          loan. When lender exits before the expiry date, the\n          interest earned for the remainder of the loan at that\n          moment will be deducted in COLLAR.\n          "})]}),Object(p.jsx)("div",{className:i.buttonOne,children:b?Object(p.jsxs)("div",{children:[Object(p.jsx)(O.e,{name:"Approve",onClick:function(){return s("approve")(a)},disabled:o.allowance.bond.gt("100000000000000000000000000000000")||!n.ct.signer}),Object(p.jsx)(O.e,{name:"Borrow",onClick:function(){return s("borrow")(l.bond,l.want).then(function(){return r({I:{bond:"",want:""}})})},disabled:m.eq(l.want)||o.allowance.bond.lt("100000000000000000000000000000000")})]}):Object(p.jsxs)("div",{children:[Object(p.jsx)(O.e,{name:"Approve",onClick:function(){return s("approve")(c)},disabled:o.allowance.want.gt("100000000000000000000000000000000")||!n.ct.signer}),Object(p.jsx)(O.e,{name:"Repay",onClick:function(){return s("repay")(l.want).then(function(){return r({I:{bond:"",want:""}})})},disabled:m.eq(l.bond)||o.allowance.want.lt("100000000000000000000000000000000")})]})})]})},[l,o,b,j])}}}]);