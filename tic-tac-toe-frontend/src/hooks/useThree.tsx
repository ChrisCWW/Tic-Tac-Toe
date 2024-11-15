import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import * as THREE from 'three';
import { RootState } from "@/lib/store/store";
import { boxMovement, cameraPos, canvasPointer, changeMaterial, changeMaterialTexture, coordToIdx, idxtoCoord, isMyTurn, turnValue } from "@/lib/utils/GameUtils";

const fov = 50;
const boxSize = 50;
const boxGap = 2;
const boxTotal = boxSize + boxGap;
const boxGeo = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
const boxColor = new THREE.Color(0xfaf8ef);
const hoverColor = new THREE.Color(0xffdd55);

export function useThree(canvas: React.RefObject<HTMLDivElement>, boxCount: number = 3) {
  
    const scene = useRef<THREE.Scene>(new THREE.Scene());
    const camera = useRef<THREE.PerspectiveCamera>(new THREE.PerspectiveCamera());
    const renderer = useRef<THREE.WebGLRenderer>();
    const raycaster = useRef<THREE.Raycaster>(new THREE.Raycaster());
    const circle = useRef<THREE.Texture>();
    const cross = useRef<THREE.Texture>();

    const mode = useSelector((state: RootState) => state.game.mode);
    const uid = useSelector((state: RootState) => state.index.uid);
    const board = useSelector((state: RootState) => state.game.board);
    const turn = useSelector((state: RootState) => state.game.turn);
    const players = useSelector((state: RootState) => state.game.players);

    const loadAssets = () => {
      const loader = new THREE.TextureLoader();
      loader.load("/images/circle.png", (texture: THREE.Texture) => {
        circle.current = texture;
      });
      loader.load("/images/cross.png", (texture: THREE.Texture) => {
        cross.current = texture;
      });
    }

    const addBoxesToScene = () => {
      for (let y = 0; y < boxCount; y++) {
        for (let x = 0; x < boxCount; x++) {
          // Add Boxes to scene, the materials[5] is the sybol side
          const idx = coordToIdx(boxCount, x, y);

          const material = new THREE.MeshStandardMaterial({ color: boxColor });
          const textureMaterial = new THREE.MeshStandardMaterial({ color: boxColor });
          const materials = [material, material, material, material, material, textureMaterial];
          const mesh = new THREE.Mesh(boxGeo, materials);
    
          mesh.name = 'box';
          mesh.userData.idx = idx;
          mesh.position.set(x * boxTotal, y * boxTotal, 0)
          scene.current.add(mesh);
        }
      }  
    }
      
    useEffect(() => {  
      loadAssets();
      
      // Setup THREE
      camera.current.fov = fov;
      camera.current.position.copy(cameraPos(boxSize * boxCount + (boxGap * boxCount - 1), boxSize, boxTotal, fov));

      if (!renderer.current) {
        renderer.current = new THREE.WebGLRenderer({ alpha: true });
        canvas.current?.appendChild(renderer.current.domElement);    
      }

      scene.current.clear();

      const light = new THREE.AmbientLight(0x404040, 25);
      scene.current.add(light);  

      const light2 = new THREE.DirectionalLight(0x404040, 30);
      light2.name = 'light2';
      light2.position.set(0, 0, boxSize * 2);
      scene.current.add(light2);  

      addBoxesToScene();

      return () => {
        renderer.current?.dispose();
      };
    }, []);
  
    useEffect(() => {  
      let animationID: number;
      function animate() {
        animationID = requestAnimationFrame(animate);
        movement();
        renderer.current?.render(scene.current, camera.current);
      }
      animate();

      return () => {
        cancelAnimationFrame(animationID);
      }
    }, [turn, board]);
      
    function movement() {
      // Get the boxes and preform movements
      const boxes = scene.current.getObjectsByProperty('name', 'box');

      for (let y = 0; y < board.length; y++) {
        for (let x = 0; x < board[y].length; x++) {
          const idx = coordToIdx(boxCount, x, y);
          const box = boxes.find((item) => item.userData.idx === idx) as THREE.Mesh<THREE.BoxGeometry, THREE.MeshStandardMaterial[]>;
          const value = board[y][x];
          if (!box || value <= 0) continue;
          const texture = value === 1 ? circle.current : value === 2 ? cross.current : null
          if (!box.material[5]?.map) changeMaterialTexture(box, value, texture);
          boxMovement(box, new THREE.Vector2(x, y), boxCount, boxTotal);
        }
      }
    }
  
    function moveTouch(e: MouseEvent) {
      if (!renderer.current || !isMyTurn(mode, turn, players, uid)) return;

      // Find the intersect box with cursor
      const pointer = canvasPointer(renderer.current, e);
      raycaster.current.setFromCamera(pointer, camera.current);
      const intersect = raycaster.current.intersectObjects(scene.current.children);
  
      const boxes = scene.current.getObjectsByProperty("name", "box");

      for (let y = 0; y < board.length; y++) {
        for (let x = 0; x < board[y].length; x++) {
          const idx = coordToIdx(boxCount, x, y);
          const box = boxes.find((item) => item.userData.idx === idx) as THREE.Mesh;
          if (!intersect.length || !box || board[y][x] > 0) continue;
  
          // Change the intersect box color
          if (box === intersect[0]?.object) {
            changeMaterial(box, hoverColor);
          } else {
            changeMaterial(box, boxColor);
          }
        }
      }
    }
  
    function startTouch(e: MouseEvent | TouchEvent) {
      if (!renderer.current || !isMyTurn(mode, turn, players, uid)) return;

      // Find the intersect box with cursor
      const pointer = canvasPointer(renderer.current, e);
      raycaster.current.setFromCamera(pointer, camera.current);
      const intersect = raycaster.current.intersectObjects(scene.current.children);
  
      if (!intersect?.length) return;
      const box = (intersect[0].object as THREE.Mesh);
      const idx = box.userData.idx;
      const coord = idxtoCoord(boxCount, idx);
  
      if (board[coord.y][coord.x] > 0) return;

      // Valid Movement
      const value = turnValue(turn);
      changeMaterial(box, boxColor);

      // Return the coord of target box
      return { idx, coord, value };
    }

    const resetBoard = () => { 
      // Get boxes from scene and reset the boxes
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
  
    return { startTouch, moveTouch, resetBoard };
  }
  