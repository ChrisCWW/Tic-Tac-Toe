import * as THREE from 'three';
import { GameBoard, GameMode } from '@/types/GameTypes';

export const initialGameBoard = (boxCount: number = 3): GameBoard => {
  return Array(boxCount).fill(Array(boxCount).fill(0));
}

export const cameraPos = (boardSize: number, boxSize: number, boxTotal: number, fov: number) => {
    const x = (boardSize - boxSize) / 2;
    const y = (boardSize - boxSize) / 2;
    const z = boardSize / 2 / Math.tan(((fov / 2) * Math.PI) / 180) + boxTotal * 1.5;
    return new THREE.Vector3(x, y, z);
}


export const boxMovement = (box: THREE.Object3D, coord: THREE.Vector2, boxCount: number, boxTotal: number) => {
  const speed = 5;

  if (Math.abs(box.rotation.x) >= Math.PI || Math.abs(box.rotation.y) >= Math.PI) {
    const z = Math.max(0, box.position.z - speed);

    box.position.setZ(z);
  } else {
    const maxZ = boxTotal;
    const z = Math.min(maxZ, box.position.z + speed);
  
    box.position.z = z;
  
    if (box.rotation.x < Math.PI && box.rotation.y < Math.PI) {
      if (coord.y === 0) {
        box.rotation.x = -(z / maxZ) * Math.PI;
      } else if (coord.y === boxCount - 1) {
        box.rotation.x = (z / maxZ) * Math.PI;
      } else if (coord.x === 0) {
        box.rotation.y = (z / maxZ) * Math.PI;
      } else {
        box.rotation.y = -(z / maxZ) * Math.PI;
      }
    }  
  }
}

export function changeMaterial(box: THREE.Mesh, color: THREE.Color) {
  const materials = box.material as THREE.Material[];
  (materials[0] as THREE.MeshStandardMaterial).color = color;
  (materials[5] as THREE.MeshStandardMaterial).color = color;
}

export function changeMaterialTexture(box: THREE.Mesh, turnValue: number, texture?: THREE.Texture | null) {
  const materials = box.material as THREE.Material[];
  if (texture !== undefined) {
    (materials[5] as THREE.MeshStandardMaterial).needsUpdate = true;
    (materials[5] as THREE.MeshStandardMaterial).map = texture;  
  } else {
    (materials[5] as THREE.MeshStandardMaterial).color = turnValue - 1 ? new THREE.Color(0x00ff00) : new THREE.Color(0xff0000);
  }
}

export function whoIsWinner(board: GameBoard, boxCount: number) {
  let valueCount = 0;
  const rows = [];
  const cols = [];
  const slopes: number[][] = [[], []];

  for (let y = 0; y < board.length; y++) {
    rows.push(board[y]);

    for (let x = 0; x < board[y].length; x++) {
      if (board[y][x] === 0) valueCount++;

      if (y === 0) {
        cols.push([board[y][x]]);
      } else {
        cols[x].push(board[y][x]);
      }
      if (y === x) {
        slopes[0].push(board[y][x]);
      }
      if (y === Math.abs(x - boxCount + 1)) {
        slopes[1].push(board[y][x]);
      }
    }
  }
  let winner = 0;
  rows.forEach((item) => {
    const win = checkWinPattern(item);
    if (win) winner = win;
  });
  cols.forEach((item) => {
    const win = checkWinPattern(item);
    if (win) winner = win;
  });
  slopes.forEach((item) => {
    const win = checkWinPattern(item);
    if (win) winner = win;
  });
  
  if (winner === 0 && valueCount === 0) {
    winner = 3;
  }
  return winner;
}

function checkWinPattern(array: number[]){
  if (array && array.every((value) => value === 1)) {
    return 1;
  }
  if (array && array.every((value) => value === 2)) {
    return 2;
  } else {
    return 0;
  }
}

export function isMyTurn(mode: GameMode, turn: number, players?: string[], uid?: string) {
  if (mode === GameMode.loacl) return true;
  if (!players?.length || players.length < 2 || !uid) return false;
  return players[turn % 2] === uid;
}

export function turnValue(turn: number) {
  return (turn % 2) + 1;
}


export function idxtoCoord(boxCount: number, idx: number) {
  return new THREE.Vector2(idx % boxCount, Math.floor(idx / boxCount));
}

export function coordToIdx(boxCount: number, x: number, y: number) {
  return (
    Math.max(0, Math.min(boxCount - 1, y)) * boxCount +
    Math.max(0, Math.min(boxCount - 1, x))
  );
}  

function transformPointer(e: MouseEvent | TouchEvent) {
  if (e instanceof MouseEvent) return new THREE.Vector2(e.clientX, e.clientY);
  else return new THREE.Vector2(e.touches[0].clientX, e.touches[0].clientY);  
}

export function canvasPointer(renderer: THREE.WebGLRenderer, e: MouseEvent | TouchEvent) {
  const pointer = transformPointer(e);
  const rec = renderer.domElement.getBoundingClientRect();
  const adjustX = Math.max(0, Math.min(rec.width, pointer.x - rec.left));
  const adjustY = Math.max(0, Math.min(rec.height, pointer.y - rec.top));
  return new THREE.Vector2((adjustX / rec.width) * 2 - 1, -(adjustY / rec.height) * 2 + 1);
}