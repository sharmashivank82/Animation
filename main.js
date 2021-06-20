// Find the latest version by visiting https://cdn.skypack.dev/three.
  
import * as THREE from 'https://cdn.skypack.dev/three@0.126.1';
import {OrbitControls} from 'https://cdn.skypack.dev/three@0.126.1/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';
import gsap from 'gsap';

//console.log(dat);
//console.log(THREE);
//console.log(OrbitControls);

const gui = new dat.GUI();

const world = {
  plane:{
    width:1,
    height:5.2,
    widthsegment:23,
    heightsegment:24
  }
};


function change_the_design()
{
  PlaneMesh.geometry.dispose();            //remove the geometry from the mesh
  PlaneMesh.geometry = new THREE.PlaneGeometry(world.plane.width,world.plane.height,world.plane.widthsegment,world.plane.heightsegment);
  const {array} = PlaneMesh.geometry.attributes.position;
  for(let i=0;i<array.length;i++)
    array[i+2] += Math.random();
    
    const colors = [];
    for(let i=0;i<PlaneMesh.geometry.attributes.position.count;i++)
      colors.push(0,0.19,0.4);
    PlaneMesh.geometry.setAttribute('color',new THREE.BufferAttribute(new Float32Array(colors),3));
}

gui.add(world.plane,'width',1,15).onChange(()=>{change_the_design()})         //adjust with the width
gui.add(world.plane,'height',1,15).onChange(()=>{change_the_design()})         //adjust with the height
gui.add(world.plane,'widthsegment',1,50).onChange(()=>{change_the_design()})     //adjust with the widthsegment
gui.add(world.plane,'heightsegment',1,50).onChange(()=>{change_the_design()})        //adjust with the heightsegment


const raycaster = new THREE.Raycaster();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75,innerWidth/innerHeight,0.1,1000);
const render = new THREE.WebGLRenderer();

// console.log(scene);
// console.log(render);
// console.log(camera);

render.setSize(innerWidth,innerHeight);

addEventListener('resize',()=>{
  render.setSize(innerWidth,innerHeight);
})

render.setPixelRatio(devicePixelRatio);
document.body.appendChild(render.domElement);

// const boxGeometry = new THREE.BoxGeometry(1,1,1);
// console.log(boxGeometry);

// const material = new THREE.MeshBasicMaterial({color:"brown"});
// console.log(material);

// const mesh = new THREE.Mesh(boxGeometry,material);
// console.log(mesh);

// scene.add(mesh);

const planeGeometry = new THREE.PlaneGeometry(1,5,23,24);
const planeMaterial = new THREE.MeshPhongMaterial( {side:THREE.DoubleSide,
  flatShading:THREE.FlatShading,
  vertexColors:true
});
const PlaneMesh = new THREE.Mesh(planeGeometry,planeMaterial);
scene.add(PlaneMesh);


//console.log(PlaneMesh);
const colors = [];

for(let i=0;i<PlaneMesh.geometry.attributes.position.count;i++)
  colors.push(0,0.19,0.4);

PlaneMesh.geometry.setAttribute('color',new THREE.BufferAttribute(new Float32Array(colors),3));

console.log(PlaneMesh.geometry.attributes);

//console.log(PlaneMesh.geometry.attributes.position.array);
const {array} = PlaneMesh.geometry.attributes.position;

for(let i=0;i<array.length;i+=3)
  array[i+2] = array[i+2]+Math.random();

const light = new THREE.DirectionalLight("white",1);
light.position.set(0,0,1);
scene.add(light);

const rightside = new THREE.DirectionalLight("white",1);
rightside.position.set(1,0,0);
scene.add(rightside);

const leftside = new THREE.DirectionalLight("white",1);
leftside.position.set(-1,0,0);
scene.add(leftside);

new OrbitControls(camera,render.domElement);
camera.position.z = 5;



function Animate()
{
  requestAnimationFrame(Animate);
  render.render(scene,camera);
  raycaster.setFromCamera(mouse,camera);
  const intersect = raycaster.intersectObject(PlaneMesh);
  
  if(intersect.length>0){
    console.log(intersect[0].face);
    const {color} = intersect[0].object.geometry.attributes;

    //vertex 1
    color.setX(intersect[0].face.a,0.1);
    color.setY(intersect[0].face.a,0.5);
    color.setZ(intersect[0].face.a,1);

    //vertex 2
    color.setX(intersect[0].face.b,0.1);
    color.setY(intersect[0].face.b,0.5);
    color.setZ(intersect[0].face.b,1);

    //vertex 3
    color.setX(intersect[0].face.c,0.1);
    color.setY(intersect[0].face.c,0.5);
    color.setZ(intersect[0].face.c,1);
    
    color.needsUpdate = true;

    const initialcolor = {r:0,g:0.19,b:0.4};
    const hovercolor = {r:0.1,g:0.5,b:1};

    gsap.to(hovercolor,{
      r:initialcolor.r,
      g:initialcolor.g,
      b:initialcolor.b,
      onUpdate : ()=>{
        //vertex 1
    color.setX(intersect[0].face.a,hovercolor.r);
    color.setY(intersect[0].face.a,hovercolor.g);
    color.setZ(intersect[0].face.a,hovercolor.b);

    //vertex 2
    color.setX(intersect[0].face.b,hovercolor.r);
    color.setY(intersect[0].face.b,hovercolor.g);
    color.setZ(intersect[0].face.b,hovercolor.b);

    //vertex 3
    color.setX(intersect[0].face.c,hovercolor.r);
    color.setY(intersect[0].face.c,hovercolor.g);
    color.setZ(intersect[0].face.c,hovercolor.b);
      }
    })

  }
  //console.log(intersect.length);
  // mesh.rotation.x += 0.01;
  // mesh.rotation.y += 0.01;
  PlaneMesh.rotation.x += Math.random()*0.04;
  PlaneMesh.rotation.y += Math.random()*0.01;


}

const mouse = {
  x:undefined,
  y:undefined
}
let flag=0;
if(flag===0)
{
  change_the_design();
  flag=1;
}

Animate();

addEventListener('mousemove',(e)=>{
  mouse.x = (e.clientX/innerWidth)*2 - 1;
  mouse.y = -(e.clientY/innerHeight)*2 + 1;
  //console.log(mouse.x,mouse.y);
})
