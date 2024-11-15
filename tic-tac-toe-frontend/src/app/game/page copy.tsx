'use client';

import React, { useEffect, useRef, useState } from "react";
import * as THREE from 'three';
import { boxMovement, cameraPos, canvasPointer, changeMaterial, changeMaterialTexture, coordToIdx, idxtoCoord, initalGameBoard, turnValue, whoIsWinner } from "@/lib/utils/GameUtils";
import { GameBoard, Winner } from "@/types/GameTypes";
import styles from './page.module.css';
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import GameInfo from "@/components/GameInfo/GameInfo";
import Win from "@/components/WinPage/WinPage";
import { useThree } from "@/hooks/useThree";


export default function Game() {
  console.log("Game");

  const store = useSelector((state: RootState) => state.index);
  const [board, setBoard] = useState<GameBoard>(initalGameBoard);
  const [turn, setTurn] = useState<number>(0);
  const [winner, setWinner] = useState<Winner>(Winner.null);

  const canvas = useRef<HTMLDivElement>(null);
  const three = useThree(canvas);

  // const canvas = useRef<HTMLDivElement>(null);
  // const scene = useRef<THREE.Scene>(new THREE.Scene());
  // const renderer = useRef<THREE.WebGLRenderer>();
  // const camera = useRef<THREE.PerspectiveCamera>(new THREE.PerspectiveCamera());
  // const raycaster = useRef<THREE.Raycaster>(new THREE.Raycaster());
  // const circle = useRef<THREE.Texture>();
  // const cross = useRef<THREE.Texture>();

  // useEffect(() => {
  //   if (!canvas.current) return;

  //   // Init THREE
  //   loadAssets();
  //   camera.current.position.copy(cameraPos(boardSize, boxSize, boxTotal, fov));

  //   if (!renderer.current) {
  //     renderer.current = new THREE.WebGLRenderer({ alpha: true });
  //     canvas.current.appendChild(renderer.current.domElement);  
  //   }
  //   let light = scene.current.getObjectByName('light');
  //   if (!light) {
  //     light = new THREE.AmbientLight(0x404040, 25);
  //     light.name = 'light';
  //     scene.current.add(light);
  //   }
  //   let light2 = scene.current.getObjectByName('light2');
  //   if (!light2) {
  //     light2 = new THREE.DirectionalLight(0x404040, 30);
  //     light2.name = 'light2';
  //     light2.position.set(0, 0, boxSize * 2);
  //     scene.current.add(light2);  
  //   }
  //   const boxes = scene.current.getObjectsByProperty('name', 'box');
  //   if (!boxes.length) {
  //     for (let y = 0; y < boxCount; y++) {
  //       for (let x = 0; x < boxCount; x++) {
  //         // Add Boxes to scene, the materials[5] is the sybol side
  //         const idx = coordToIdx(boxCount, x, y);

  //         const material = new THREE.MeshStandardMaterial({ color: boxColor });
  //         const textureMaterial = new THREE.MeshStandardMaterial({ color: boxColor });
  //         const materials = [material, material, material, material, material, textureMaterial];
  //         const mesh = new THREE.Mesh(boxGeo, materials);
    
  //         mesh.name = 'box';
  //         mesh.userData.idx = idx;
  //         mesh.position.set(x * boxTotal, y * boxTotal, 0)
  //         scene.current.add(mesh);
  //       }
  //     }  
  //   }

  //   return () => {        
  //     resetBoxes();
  //     renderer.current?.dispose();
  //   }
  // }, []);

  const move = () => {

  }

  const startTouch = () => {
    
  }

  useEffect(() => {
      let animationID: number;

      function animate() {          
        animationID = requestAnimationFrame(animate);
  
        // Canvas animation;
        movement();
  
        // Rendering
        renderer.current?.render(scene.current, camera.current);
      }
  
      animate();
  
      window.addEventListener('mousedown', startTouch);
      window.addEventListener('mousemove', moveMouse);
      window.addEventListener('touchstart', startTouch);

      return () => {
        cancelAnimationFrame(animationID);
        window.removeEventListener('mousedown', startTouch);
        window.removeEventListener('mousemove', moveMouse);
        window.removeEventListener('touchstart', startTouch);
      };    
  }, [turn, board]);

  useEffect(() => {

  }, [store.isNetwork]);

//   function loadAssets() {
//     const loader = new THREE.TextureLoader();
//     if (!circle.current) {
//       loader.load('/images/circle.png', (texture: THREE.Texture) => {
//         circle.current = texture;
//       });  
//     }
//     if (!cross.current) {
//       loader.load('/images/cross.png', (texture: THREE.Texture) => {
//         cross.current = texture;
//       });  
//     }
//   }
 
//   const movement = () => {
//     const boxes = scene.current.getObjectsByProperty('name', 'box');
//     for (let y = 0; y < board.length; y++) {
//       for (let x = 0; x < board[y].length; x++) {
//         const idx = coordToIdx(boxCount, x, y);
//         const value = board[y][x];
//         if (value <= 0) continue;

//         const box = boxes.find((item) => item.userData.idx === idx);
//         if (!box) continue;

//         boxMovement(box, new THREE.Vector2(x, y), boxCount, boxTotal);
//       }
//     }
//   };

//   const startTouch = (e: MouseEvent | TouchEvent) => {
//     if (!renderer.current) return;

//     const pointer = canvasPointer(renderer.current, e);
//     raycaster.current.setFromCamera(pointer, camera.current);
//     const intersect = raycaster.current.intersectObjects(scene.current.children);
    
//     if (!intersect?.length) return;
//     const box = (intersect[0].object as THREE.Mesh);
//     const idx = box.userData.idx;
//     const coord = idxtoCoord(boxCount, idx);

//     if (!box || board[coord.y][coord.x] > 0) return;
//     // Process if move valid
//     console.log(board);
//     const value = turnValue(turn);
//     changeMaterial(box, boxColor);
//     changeMaterialTexture(box, value, turn % 2 ? cross.current : circle.current)
    
//     const nextBoard = JSON.parse(JSON.stringify(board));
//     nextBoard[coord.y][coord.x] = value;
//     setBoard(nextBoard);
//     console.log(nextBoard);

//     const win = whoIsWinner(nextBoard, boxCount);
//     console.log(win);
//     if (win) {
//       setWinner(win);
//     } else {
//       setTurn(turn + 1);
//     }
//   }

//   const moveMouse = (e: MouseEvent) => {
//     if (!renderer.current) return;

//     const pointer = canvasPointer(renderer.current, e);
//     raycaster.current.setFromCamera(pointer, camera.current);
//     const intersect = raycaster.current.intersectObjects(scene.current.children);
//     const boxes = scene.current.getObjectsByProperty('name', 'box');

//     for (let y = 0; y < board.length; y++) {
//       for (let x = 0; x < board[y].length; x++) {
//         const idx = coordToIdx(boxCount, x, y);
//         const box = (boxes.find((item) => item.userData.idx === idx) as THREE.Mesh);
//         if (!box || !intersect.length || board[y][x] > 0) continue;

//         if (box == intersect[0]?.object) {
//           changeMaterial(box, hoverColor);
//         } else {
//           changeMaterial(box, boxColor);
//         }
//       }
//     }    
//   };

  const restart = () => {
    setTurn(0);
    setBoard((state: GameBoard) => {
      let newBaord: number[][] = [];
      state.forEach((itemY, y) => {
        newBaord.push([]);
        itemY.forEach((itemX, x) => {
          newBaord[y][x] = 0;
        })
      });
      return newBaord;
    });
    setWinner(0);
    resetBoxes();
  }

  const resetBoxes = () => {
    const boxes = scene.current.getObjectsByProperty('name', 'box');

    for (let y = 0; y < boxCount; y++) {
      for (let x = 0; x < boxCount; x++) {
        const idx = coordToIdx(boxCount, x, y);
        const box = boxes.find((item) => item.userData.idx === idx) as THREE.Mesh;
        if (!box) continue;

        changeMaterial(box, boxColor);
        changeMaterialTexture(box, 0, null);
        box.position.set(x * boxTotal, y * boxTotal, 0);
        box.rotation.x = 0;
        box.rotation.y = 0;
      }
    }  
}

  return (
    <div className={styles.container}>
      <GameInfo turn={turn} />
      <div ref={canvas} className={styles.container}></div>
      { winner > 0 && <Win winner={winner} restart={restart} /> }
    </div>
  )
}