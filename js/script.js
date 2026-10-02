const scenes=[...document.querySelectorAll('.scene')];
const links=[...document.querySelectorAll('.chapter-nav a')];
const num=document.querySelector('#num');
const progress=document.querySelector('.scroll-progress i');
const photo=document.querySelector('.photo-image');
const photoImg=document.querySelector('.photo-image img');
const light=document.querySelector('.photo-light');

let currentScene='home';

function clamp(v,a=0,b=1){return Math.max(a,Math.min(b,v));}

function animate(){
  const pageMax=document.documentElement.scrollHeight-innerHeight;
  const global=clamp(scrollY/Math.max(1,pageMax));

  // Full-screen landscape photo has one continuous cinematic camera movement.
  const scale=1.05+global*.24;
  const x=Math.sin(global*Math.PI*2)*1.7;
  const y=Math.cos(global*Math.PI*1.4)*1.2;
  photo.style.transform=`translate3d(${x}%,${y}%,0) scale(${scale})`;
  photoImg.style.filter=`brightness(${.62+global*.12}) contrast(${1.08+global*.05}) saturate(${.72+global*.18})`;
  light.style.transform=`translate(calc(-50% + ${x*2}vw),calc(-50% + ${y*2}vh))`;

  progress.style.width=(global*100)+'%';

  // Each scene is treated as a cinematic chapter.
  let nearest=null,best=Infinity;
  scenes.forEach(scene=>{
    const r=scene.getBoundingClientRect();
    const center=r.top+r.height*.5;
    const distance=Math.abs(center-innerHeight*.5);
    if(distance<best){best=distance;nearest=scene}
  });

  scenes.forEach(scene=>{
    const r=scene.getBoundingClientRect();
    const center=r.top+r.height*.5;
    const d=(center-innerHeight*.5)/innerHeight;
    const focus=clamp(1-Math.abs(d)/.8);

    if(focus>.18) scene.classList.add('active');
    else if(focus<.02) scene.classList.remove('active');

    // Subtle depth on the text as it passes the center.
    const content=scene.querySelector('.scene-content');
    if(content){
      const shift=Math.max(-35,Math.min(35,d*35));
      content.style.setProperty('--depthY',shift+'px');
    }
  });

  if(nearest && nearest.id!==currentScene){
    currentScene=nearest.id;
    const n=nearest.dataset.num;
    num.textContent=n;
    links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+nearest.id));
  }
}

addEventListener('scroll',animate,{passive:true});
addEventListener('resize',animate);
animate();

links.forEach(a=>{
  a.addEventListener('click',e=>{
    e.preventDefault();
    document.querySelector(a.getAttribute('href')).scrollIntoView({behavior:'smooth'});
  });
});
