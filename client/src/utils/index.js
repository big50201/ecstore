export const caculatePrice = items=>{
    return `${items.reduce((acc,item)=>acc+item.quantity * item.price,0).toFixed(2)}`;
};