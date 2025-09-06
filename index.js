let productName = document.getElementById("productName");
  let productCost = document.getElementById("productCost");
  let prName = document.getElementById("prName");
  let prCost = document.getElementById("prCost");

function add(){
    let proName=productName.value
    let proCost= productCost.value
  console.log(proName);
  console.log(proCost);
  prName.innerHTML=proName;
  prCost.innerHTML=proCost


}