import{h as F,j as f,m as L,a as k,d as i,e as b,b as R,q as U,t as u,w as e,v as $,f as o,r as n,M as r,o as p,i as _}from"./index-B-BqWMFG.js";import{g as E,r as P}from"./cart-Cfw47MSx.js";const Q={class:"cart-container"},T={style:{display:"flex","justify-content":"space-between"}},A={style:{"font-size":"16px","font-weight":"bold"}},G={style:{"font-size":"16px",color:"red","font-weight":"bold"}},H={class:"trade-item-picture"},w=10,W={__name:"cart",setup(J){const s=F([]),g=f(1),v=f(0),m=f(!1),c=f(!1),y=async()=>{c.value=!0,r.loading({content:"加载中...",id:"cart-data"});const l=await E(g.value,w).finally(()=>{c.value=!1});m.value?s.splice((g.value-1)*w,w,...l.data):s.push(...l.data),r.success({content:"加载成功",id:"cart-data"}),c.value=!1,s.length>=l.totalCount?m.value=!0:(m.value=!1,g.value++),v.value=l.totalCount},V=async l=>{r.loading({content:"删除中...",id:"cart-data"});const t=await P(l);if(t.code===200){r.success({content:t.message==null?"删除成功":t.message,id:"cart-data"});const d=s.findIndex(h=>h.id===l);d!==-1&&(s.splice(d,1),v.value--)}else r.error({content:t.message==null?"删除失败":t.message,id:"cart-data"})},z=async l=>{r.success("数量已更新")};return L(()=>{y()}),(l,t)=>{const d=n("a-empty"),h=n("icon-loading"),B=n("a-spin"),x=n("a-descriptions-item"),N=n("a-input-number"),D=n("a-descriptions"),q=n("a-list-item-meta"),I=n("a-image"),M=n("a-button"),S=n("a-list-item"),j=n("a-list");return p(),k("div",Q,[i("div",T,[t[0]||(t[0]=i("h2",{style:{"margin-bottom":"20px"}},"购物车",-1)),i("p",null,"共 "+u(v.value)+" 件商品",1)]),s.length===0&&!c.value?(p(),b(d,{key:0},{default:e(()=>t[1]||(t[1]=[_(" 购物车空空如也 ")])),_:1})):c.value&&s.length==0?(p(),b(d,{key:1},{image:e(()=>[o(h,{style:{"font-size":"68px",color:"#165dff"}})]),default:e(()=>[t[2]||(t[2]=i("div",{style:{"margin-top":"25px","font-size":"20px"}},"加载中，请稍后...",-1))]),_:1})):R("",!0),U(o(j,{data:s,"max-height":500,onReachBottom:y,scrollbar:!0,style:{"overflow-y":"always"}},{"scroll-loading":e(()=>[m.value&&!c.value?(p(),k("div",{key:0,onClick:y,style:{cursor:"pointer",color:"grey"}}," —— 我是有底线的 —— ")):(p(),b(B,{key:1}))]),item:e(({item:a})=>[o(S,null,{extra:e(()=>[i("div",H,[o(I,{src:a.cover,alt:a.productName,width:"110px",height:"110px"},null,8,["src","alt"])]),o(M,{type:"danger",onClick:C=>V(a.id),style:{"margin-top":"10px"}},{default:e(()=>t[3]||(t[3]=[_(" 删除 ")])),_:2},1032,["onClick"])]),default:e(()=>[o(q,null,{title:e(()=>[i("div",A,[_(u(a.productName)+" ",1),i("span",G," ￥"+u((a.price*a.quantity).toFixed(2)),1)])]),description:e(()=>[o(D,{column:"3",size:"small",style:{"margin-top":"10px",width:"55vh"}},{default:e(()=>[o(x,{label:"型号/描述",span:3},{default:e(()=>[_(u(a.model),1)]),_:2},1024),o(x,{label:"单价"},{default:e(()=>[_("￥"+u(a.price.toFixed(2)),1)]),_:2},1024),o(x,{label:"购买数量"},{default:e(()=>[o(N,{modelValue:a.quantity,"onUpdate:modelValue":C=>a.quantity=C,min:1,onChange:C=>z(a)},null,8,["modelValue","onUpdate:modelValue","onChange"])]),_:2},1024)]),_:2},1024)]),_:2},1024)]),_:2},1024)]),_:1},8,["data"]),[[$,s.length>0]])])}}};export{W as default};
