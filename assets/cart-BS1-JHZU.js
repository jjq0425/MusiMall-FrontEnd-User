import{_ as h}from"./OrderConfirmationDrawer-Bg4wkPhX.js";import{h as r,i as y,a as s,d as e,f as C,t as d,b as u,o as c}from"./index-CLUkJoio.js";import"./address-CQUot1ao.js";import"./trade-oCk42qMb.js";import"./address-DM-oQc8K.js";import"./TradeList-Co-laW_8.js";const b={class:"cart-container"},k={style:{display:"flex","justify-content":"space-between"}},I={class:"floating-footer"},x={style:{display:"flex"}},R={__name:"cart",setup(P){const i=r(0),o=y([]),a=r(!1),f=t=>{i.value=t},p=t=>{a.value=t},m=t=>{o.splice(0,o.length,...t)},n=r(null),v=()=>{a.value||n.value.removeSelectCartItem()},g=()=>{a.value||n.value.createSelectOrder()},_=()=>{a.value||n.value.createOrderAll()};return(t,l)=>(c(),s("div",b,[e("div",k,[l[0]||(l[0]=e("h2",{style:{"margin-bottom":"20px"}},"购物车",-1)),e("p",null,"共 "+d(i.value)+" 件商品",1)]),C(h,{onUpdateTotalCount:f,onUpdateSelectProductId:m,onUpdateChangeItemLoading:p,ref_key:"cartProductListRef",ref:n},null,512),l[1]||(l[1]=e("div",{style:{"min-height":"40px"}},null,-1)),e("div",I,[e("p",null,"已选择 "+d(o.length)+" 件商品",1),e("div",x,[o.length>0?(c(),s("div",{key:0,class:"floating-footer-btn btn-remove",onClick:v}," 移除选中商品 ")):u("",!0),o.length>0?(c(),s("div",{key:1,class:"floating-footer-btn btn-orderPart",onClick:g}," 结算选中商品 ")):u("",!0),e("div",{class:"floating-footer-btn btn-orderAll",onClick:_}," 结算全部购物车 ")])])]))}};export{R as default};
