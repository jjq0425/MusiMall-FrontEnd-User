import{_ as z,c as $,a as c,o as s,b as P,d as e,t as v,r as _,e as g,w as u,f as d,n as O,g as S,h as k,i as I,j as w,M as C,F as j,k as A,l as F}from"./index-B6umofjF.js";import{_ as q}from"./SvgIcon-Dx5T6CJl.js";const U={class:"price-stock"},E={key:0,class:"price"},R={key:1,class:"price",style:{color:"grey"}},T={class:"stock"},W={key:0,style:{color:"#f76707"}},G={key:1},X={key:2},H={key:3},J={__name:"PriceAndStockShow",props:{price:{type:Number,required:!0},remainQuantity:{type:Number,required:!0},totalQuantity:{type:Number,required:!0}},setup(a){const o=a,i=$(()=>o.price.toFixed(2)),r=$(()=>o.remainQuantity<=0),t=$(()=>o.remainQuantity<=20&&o.remainQuantity>0),m=$(()=>o.totalQuantity-o.remainQuantity<=20);return(y,h)=>(s(),c("div",U,[r.value?P("",!0):(s(),c("div",E," ￥ "+v(i.value),1)),r.value?(s(),c("div",R,"已售罄")):P("",!0),e("div",T,[t.value?(s(),c("span",W,"库存告急，仅剩"+v(a.remainQuantity)+"件",1)):m.value?(s(),c("span",G,"新品上架，欢迎选购")):r.value?(s(),c("span",X,"商品已售罄，关注其他商品吧")):(s(),c("span",H,"已售："+v(a.totalQuantity-a.remainQuantity)+" 库存: "+v(a.remainQuantity),1))])]))}},K=z(J,[["__scopeId","data-v-357e4803"]]),Y={style:{"border-radius":"12px"}},Z=["src","alt"],tt={__name:"ProductCard",props:{product:{type:Object,required:!0}},emits:["showProductDetailModal"],setup(a,{emit:o}){const i=a,r=()=>{t("showProductDetailModal",i.product.id)},t=o;return(m,y)=>{const h=_("a-card-meta"),f=_("a-card");return s(),g(f,{hoverable:"",class:"product-card",onClick:r},{cover:u(()=>[e("div",Y,[e("img",{style:O([{width:"240px",height:"135px",overflow:"hidden"},{"border-radius":"12px 12px 12px 0"}]),src:a.product.picture,alt:a.product.name},null,8,Z)])]),default:u(()=>[d(h,{title:a.product.name,description:a.product.description},{avatar:u(()=>[d(K,{style:{transform:"translateX(-5px)"},price:a.product.price,totalQuantity:a.product.quantity,remainQuantity:a.product.remainQuantity},null,8,["price","totalQuantity","remainQuantity"])]),_:1},8,["title","description"])]),_:1})}}},et=z(tt,[["__scopeId","data-v-ca52456a"]]),M="/api/product/v1",ot=(a,o)=>S.get(`${M}/product`,{params:{page:a,pageSize:o,categoryName:null}}),at=(a,o,i)=>S.get(`${M}/product/searchPage`,{params:{query:a,page:o,pageSize:i}}),st=a=>S.get(`${M}/product/${a}`),nt={class:"product-detail-modal"},it={class:"image-section"},rt=["src","alt"],lt={class:"info-section"},ct={class:"product-name"},ut={class:"description"},dt={key:0,class:"price"},pt={key:1,class:"price",style:{color:"grey"}},_t={class:"stock-info"},mt={class:"stock-text"},vt={class:"stock-text"},yt={style:{"border-radius":"12px"},class:"footer"},ht={key:0,class:"total-price"},gt={key:1,class:"purchase"},ft={class:"purchase-btn-group"},xt={__name:"ProductDetailModal",setup(a,{expose:o}){const i=k(!1),r=k(1),t=I({id:1,name:"商品名称",description:"商品描述",picture:"",price:100,quantity:1e3,remainQuantity:1e3});o({showModal:async b=>{const n=await st(b).catch(x=>{C.error("获取商品详情失败,请稍后再试:"+x)});n.id!=null&&(Object.assign(t,n),console.log(t),i.value=!0)}});const y=()=>{i.value=!1,C.success("已加入购物车")},h=()=>{},f=$(()=>(t.price*r.value).toFixed(2));return(b,n)=>{const x=_("a-tag"),p=_("a-input-number"),l=_("a-modal");return s(),g(l,{visible:i.value,"onUpdate:visible":n[1]||(n[1]=Q=>i.value=Q),title:"商品详情",width:1200,footer:null},{default:u(()=>[e("div",nt,[e("div",it,[e("img",{src:t.picture,alt:t.name,class:"product-image"},null,8,rt)]),e("div",lt,[e("h2",ct,v(t.name),1),e("p",ut,v(t.description),1),t.remainQuantity>0?(s(),c("div",dt," 单价: ￥"+v(t.price)+"/件 ",1)):(s(),c("div",pt,"已售罄")),e("div",_t,[e("span",mt," 已售: "+v(t.quantity-t.remainQuantity),1),e("span",vt," 剩余库存: "+v(t.remainQuantity),1),t.remainQuantity<=0?(s(),g(x,{key:0,color:"red",style:{"font-size":"12px"}},{default:u(()=>n[2]||(n[2]=[w(" 已售罄 ")])),_:1})):t.remainQuantity<=20?(s(),g(x,{key:1,color:"orange",style:{"font-size":"12px"}},{default:u(()=>n[3]||(n[3]=[w(" 库存告急 ")])),_:1})):t.quantity-t.remainQuantity<=20?(s(),g(x,{key:2,color:"green",style:{"font-size":"12px"}},{default:u(()=>n[4]||(n[4]=[w(" 新品发售 ")])),_:1})):(s(),g(x,{key:3,color:"blue",style:{"font-size":"12px"}},{default:u(()=>n[5]||(n[5]=[w("备货充足")])),_:1}))]),e("div",yt,[t.remainQuantity>0?(s(),c("div",ht,[n[6]||(n[6]=e("span",{style:{"font-weight":"bold"}},"总金额：",-1)),w(" ￥"+v(f.value),1)])):P("",!0),t.remainQuantity>0?(s(),c("div",gt,[e("div",null,[d(p,{style:{width:"220px"},placeholder:"Please Enter",mode:"button",size:"large",class:"input-demo",modelValue:r.value,"onUpdate:modelValue":n[0]||(n[0]=Q=>r.value=Q),min:1,max:t.remainQuantity},null,8,["modelValue","max"])]),e("div",ft,[e("div",{class:"purchase-btn",onClick:y},[d(q,{name:"shoppingCartWhite",size:"12px"}),n[7]||(n[7]=e("span",{style:{color:"white","font-weight":"bold","font-size":"15px"}}," 加入购物车 ",-1))]),e("div",{class:"purchase-btn-2",onClick:h},[d(q,{name:"makeOrderWhite",size:"13px"}),n[8]||(n[8]=e("span",{style:{color:"white","font-weight":"bold","font-size":"15px"}}," 直接购买 ",-1))])])])):P("",!0)])])])]),_:1},8,["visible"])}}},kt=z(xt,[["__scopeId","data-v-e217527a"]]),wt={class:"product-list"},bt={__name:"ProductList",props:{productListInfo:{type:Array,required:!0}},setup(a){const o=k(null),i=r=>{o.value.showModal(r)};return(r,t)=>{const m=_("a-col"),y=_("a-row");return s(),c("div",wt,[d(y,{gutter:16},{default:u(()=>[(s(!0),c(j,null,A(a.productListInfo,h=>(s(),g(m,{key:h.id,span:6},{default:u(()=>[d(et,{product:h,onShowProductDetailModal:i},null,8,["product"])]),_:2},1024))),128))]),_:1}),d(kt,{ref_key:"showProductDetailModalRef",ref:o},null,512)])}}},Pt=z(bt,[["__scopeId","data-v-9d45e4f6"]]),Qt={class:"search"},$t={class:"search-Btn-Div"},zt={class:"product-list-div"},Ct={key:2,class:"pagination-div"},St={__name:"product",setup(a){const o=k(""),i=k(!1),r=I([]),t=k(1),m=k(8),y=k(0);F(()=>{o.value="",f()});const h=()=>{o.value&&o.value.trim()!=""?b():f()},f=async()=>{i.value=!0;const p=await ot(t.value,m.value);r.splice(0,r.length,...p.data),y.value=p.totalCount,i.value=!1},b=async()=>{i.value=!0,t.value=1;const p=await at(o.value,t.value,m.value).catch(l=>{C.error("搜索失败,请稍后再试:"+l),i.value=!1});r.splice(0,r.length,...p.data),y.value=p.totalCount,i.value=!1},n=p=>{t.value=p,o.value?b():f()},x=p=>{t.value=1,m.value=p,o.value?b():f()};return(p,l)=>{const Q=_("icon-search"),N=_("a-input-search"),D=_("a-empty"),V=_("icon-loading"),L=_("a-pagination");return s(),c("div",null,[e("div",Qt,[l[2]||(l[2]=e("div",{class:"title"},[e("h1",{style:{margin:"0 auto","text-align":"center","font-size":"45px"}}," 优选好物 ")],-1)),e("div",$t,[d(N,{class:"search-Btn",modelValue:o.value,"onUpdate:modelValue":l[0]||(l[0]=B=>o.value=B),placeholder:"输入商品关键词","search-button":"",onSearch:h,loading:i.value},{"button-icon":u(()=>[d(Q)]),"button-default":u(()=>l[1]||(l[1]=[w(" 搜好物 ")])),_:1},8,["modelValue","loading"])])]),e("div",zt,[r.length===0&&!i.value?(s(),g(D,{key:0,style:{"padding-top":"80px"}},{default:u(()=>l[3]||(l[3]=[w(" 没有搜索到商品 ")])),_:1})):i.value?(s(),g(D,{key:1,style:{"padding-top":"80px"}},{image:u(()=>[d(V,{style:{"font-size":"68px",color:"#165dff"}})]),default:u(()=>[l[4]||(l[4]=e("div",{style:{"margin-top":"25px","font-size":"20px"}},"加载中，请稍后...",-1))]),_:1})):P("",!0),d(Pt,{"product-list-info":r},null,8,["product-list-info"]),l[5]||(l[5]=e("div",{style:{height:"50px"}},null,-1)),r.length>0?(s(),c("div",Ct,[d(L,{total:y.value,current:t.value,"page-size":m.value,onChange:n,onPageSizeChange:x,"page-size-options":[8,16,32,64],"show-total":"","show-jumper":"","show-page-size":""},null,8,["total","current","page-size"])])):P("",!0)])])}}},qt=z(St,[["__scopeId","data-v-a6e38161"]]);export{qt as default};
