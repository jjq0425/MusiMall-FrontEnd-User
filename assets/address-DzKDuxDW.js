import{g as s}from"./index-DUDzG8So.js";const t="/api/order/v1/deliveryAddress",a=(e,d)=>s({url:`${t}/searchByPageCurrentUser`,method:"post",data:{pageNo:e,pageSize:d}}),o=e=>s({url:`${t}/add`,method:"post",data:e}),u=e=>s({url:`${t}/update`,method:"post",data:e}),n=e=>s({url:`${t}/deleteByIds`,method:"post",data:[e]}),p=e=>s({url:`${t}/setDefault`,method:"post",params:{id:e}}),l=e=>s({url:`${t}/findById`,method:"get",params:{id:e}});export{o as a,a as b,n as d,l as g,p as s,u};
