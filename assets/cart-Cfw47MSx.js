import{g as e}from"./index-B-BqWMFG.js";const a="/api/shoppingCart/v1/shoppingCart",p=(t,r)=>e({url:`${a}/getShoppingCart`,method:"post",data:{pageNo:t,pageSize:r}}),s=(t,r)=>e({url:`${a}/insertOrUpdate`,method:"post",data:{productId:t,quantity:r}}),d=t=>e({url:`${a}/deleteProduct/${t}`,method:"put"});export{s as a,p as g,d as r};
