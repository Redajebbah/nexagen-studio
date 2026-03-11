'use client';
import { useRef, useEffect } from 'react';
import * as THREE from 'three';

export default function HeroScene({ mouse }) {
  const mountRef = useRef(null);
  const refs = useRef({});
  useEffect(() => {
    const c = mountRef.current; if (!c) return;
    let w = c.clientWidth, h = c.clientHeight;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(w, h); renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    c.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 100); camera.position.z = 4.5;
    const geo = new THREE.IcosahedronGeometry(1.6, 64);
    const orig = geo.attributes.position.array.slice();
    const sphere = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: 0x00e5a0, transparent: true, opacity: 0.08, roughness: 0.3, metalness: 0.8 }));
    scene.add(sphere);
    const wf = new THREE.Mesh(new THREE.IcosahedronGeometry(1.62, 20), new THREE.MeshBasicMaterial({ color: 0x00e5a0, transparent: true, opacity: 0.06, wireframe: true }));
    scene.add(wf);
    const inner = new THREE.Mesh(new THREE.SphereGeometry(1.3, 32, 32), new THREE.MeshBasicMaterial({ color: 0x00e5a0, transparent: true, opacity: 0.03 }));
    scene.add(inner);
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(2.4, 0.008, 8, 128), new THREE.MeshBasicMaterial({ color: 0x5eead4, transparent: true, opacity: 0.15 }));
    ring1.rotation.x = Math.PI * 0.45; scene.add(ring1);
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.8, 0.005, 8, 128), new THREE.MeshBasicMaterial({ color: 0x00e5a0, transparent: true, opacity: 0.08 }));
    ring2.rotation.x = Math.PI * 0.6; ring2.rotation.y = Math.PI * 0.3; scene.add(ring2);
    const pN = 500, pPos = new Float32Array(pN * 3);
    for (let i = 0; i < pN; i++) { const th = Math.random()*Math.PI*2, ph = Math.acos(2*Math.random()-1), r = 2.2+Math.random()*3; pPos[i*3]=r*Math.sin(ph)*Math.cos(th); pPos[i*3+1]=r*Math.sin(ph)*Math.sin(th); pPos[i*3+2]=r*Math.cos(ph); }
    const pGeo = new THREE.BufferGeometry(); pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0x5eead4, size: 0.015, transparent: true, opacity: 0.4, sizeAttenuation: true }));
    scene.add(particles);
    scene.add(new THREE.AmbientLight(0xffffff, 0.3));
    const dl = new THREE.DirectionalLight(0x00e5a0, 0.6); dl.position.set(3, 3, 5); scene.add(dl);
    const dl2 = new THREE.DirectionalLight(0x5eead4, 0.3); dl2.position.set(-3, -2, 3); scene.add(dl2);
    scene.add(new THREE.PointLight(0x00e5a0, 0.5, 10));
    refs.current = { renderer, scene, camera, geo, orig, sphere, wf, inner, ring1, ring2, particles };
    const clock = new THREE.Clock(); let raf;
    const animate = () => {
      raf = requestAnimationFrame(animate); const t = clock.getElapsedTime();
      const pos = geo.attributes.position.array;
      for (let i = 0; i < pos.length; i += 3) { const ox=orig[i],oy=orig[i+1],oz=orig[i+2]; const n=Math.sin(ox*2.5+t*0.8)*Math.cos(oy*2.5+t*0.6)*Math.sin(oz*2.5+t*0.7)*0.12; pos[i]=ox*(1+n); pos[i+1]=oy*(1+n); pos[i+2]=oz*(1+n); }
      geo.attributes.position.needsUpdate = true; geo.computeVertexNormals();
      sphere.rotation.y=t*0.08; sphere.rotation.x=t*0.05; wf.rotation.y=t*0.06; wf.rotation.x=t*0.04; inner.rotation.y=-t*0.1; ring1.rotation.z=t*0.1; ring2.rotation.z=-t*0.07; particles.rotation.y=t*0.015; particles.rotation.x=t*0.008;
      renderer.render(scene, camera);
    };
    animate();
    const onR = () => { w=c.clientWidth; h=c.clientHeight; camera.aspect=w/h; camera.updateProjectionMatrix(); renderer.setSize(w,h); };
    window.addEventListener('resize', onR);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize',onR); renderer.dispose(); if(c.contains(renderer.domElement))c.removeChild(renderer.domElement); };
  }, []);
  useEffect(() => { const s=refs.current; if(!s.camera)return; s.camera.position.x+=((mouse.x-0.5)*2-s.camera.position.x)*0.02; s.camera.position.y+=(-(mouse.y-0.5)*1.2-s.camera.position.y)*0.02; s.camera.lookAt(0,0,0); }, [mouse.x, mouse.y]);
  return <div ref={mountRef} style={{ position: 'absolute', inset: 0, zIndex: 0 }} aria-hidden="true" />;
}
