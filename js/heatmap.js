// Build heatmap (52 weeks x 7 days)
const hm = document.getElementById('heatmap');
if(hm){
  const total = 52*7;
  let arr=[];
  // weighted random
  for(let i=0;i<total;i++){
    const r=Math.random();
    let cls='';
    // give later weeks more activity (recent ramp up)
    const weekBoost = (i/total)*.5;
    if(r < .35 - weekBoost) cls='';
    else if(r < .55) cls='h1';
    else if(r < .75) cls='h2';
    else if(r < .9) cls='h3';
    else cls='h4';
    arr.push(cls);
  }
  hm.innerHTML = arr.map(c=>`<div class="${c}"></div>`).join('');
}
