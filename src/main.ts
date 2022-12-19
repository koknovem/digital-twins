import './style.css';
import * as THREE from 'three';
import * as API from './api';
import { Material, PositionalAudio, Vector3 } from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
import {
  ClickableMesh,
  StateMaterialSet,
  StateMaterial,
  MouseEventManager,
  ThreeMouseEvent,
  ThreeMouseEventType,
} from "@masatomakino/threejs-interactive-object";


const init = () => {

  let robots: { BATTERY: string, BATTERY_CHARGING: string, x: number, y: number, time: string }[]

  const profiles = [
    [-35, 30, 35],
    [35, 30, -35],
    [35, 30, 35],
  ]

  var stopThrehold = 0.5
  var profileIndex: number = 0
  var prevPosition: number[] = profiles[profileIndex]

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);

  const scene: THREE.Scene = new THREE.Scene();
  const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#bg")!,
  });
  const manager = new MouseEventManager(scene, camera, renderer.domElement);


  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  renderer.render(scene, camera);
  camera.position.x = profiles[profileIndex][0]
  camera.position.y = profiles[profileIndex][1]
  camera.position.z = profiles[profileIndex][2]

  const geometry: THREE.TorusGeometry = new THREE.TorusGeometry(10, 3, 16, 100);
  const material: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({ color: 0x9f1f7a, wireframe: true })
  const torus: THREE.Mesh = new THREE.Mesh(geometry, material)

  const directionalLight: THREE.DirectionalLight = new THREE.DirectionalLight(0xFFFFFF)
  directionalLight.position.x = -10
  directionalLight.position.y = 0
  directionalLight.position.z = 0
  // pointLight.intensity = 1

  const gridHelper = new THREE.GridHelper(200, 50)

  var background = new THREE.SphereGeometry(500, 60, 40);
  background.scale(- 1, 1, 1);
  var backgroundMaterial = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load('bg.jpg')
  });
  var backgroundMesh = new THREE.Mesh(background, backgroundMaterial);

  var stlModelMesh: THREE.Object3D<THREE.Event> | THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>

  const loader = new STLLoader()
  loader.load(
    'model/pochita.stl',
    function (geometry) {
      stlModelMesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color: 0x999999 }))
      stlModelMesh.scale.setX(0.3)
      stlModelMesh.scale.setY(0.3)
      stlModelMesh.scale.setZ(0.3)
      stlModelMesh.rotation.x = -Math.PI / 2
      // scene.add(stlModelMesh)
    },
    (xhr) => {
      console.log(Math.floor((xhr.loaded / xhr.total) * 100) + '% loaded')
    },
    (error) => {
      console.log(error)
    }
  )

  function getVector3Difference(prevPosition: number[], targetPosition: number[], lowest: number): number[] {
    var difference: number[] = []
    var x1: number = prevPosition[0]
    var x2: number = targetPosition[0]
    var y1: number = prevPosition[1]
    var y2: number = targetPosition[1]
    var z1: number = prevPosition[2]
    var z2: number = targetPosition[2]

    difference.push(x2 - x1)
    difference.push(y2 - y1)
    difference.push(z2 - z1)

    difference[0] >= -lowest && difference[0] <= lowest ? 0 : difference[0]
    difference[1] >= -lowest && difference[1] <= lowest ? 0 : difference[1]
    difference[2] >= -lowest && difference[2] <= lowest ? 0 : difference[2]

    return difference
  }

  // const buttonPos1 = new THREE.Mesh(new THREE.BoxGeometry(5,5,5), new THREE.MeshStandardMaterial({color: 0xFFFFFF}))
  // scene.add(buttonPos1)

  // const controls = new OrbitControls(camera, renderer.domElement)

  const addNewAnnotation = (x: number, y: number, z: number) => {
    let clickable = new ClickableMesh({
      geo: new THREE.BoxGeometry(10, 10, 10),
      material: new StateMaterialSet({
        normal: new THREE.MeshStandardMaterial({
          color: 0xffffff,
        }),
      }),
    });
    clickable.position.set(x, y, z)
    clickable.addEventListener(ThreeMouseEventType.CLICK, (e) => {
      profileIndex == 2 ? profileIndex = 0 : profileIndex += 1
    });
    scene.add(clickable);
    return clickable
  }


  scene.add(backgroundMesh);
  scene.add(gridHelper)
  // scene.add(torus)
  scene.add(directionalLight)
  scene.add(ambientLight);

  const initRobot = async () => {
    const response = await fetch('http://192.168.3.105/api/v1/realtime/sensor?id=robot-cs&id=robot-patrol&id=robot-sanitize');
    const myJson = await response.json();
    // const myJson = {
    //   "robot-patrol":{
    //     "BATTERY":"96",
    //     "BATTERY_CHARGING":"no",
    //     "x": 10,
    //     "y":10,
    //     "time":"time"
    //   },
    //   "robot-sanitize":{
    //     "BATTERY":"96",
    //     "BATTERY_CHARGING":"no",
    //     "x": 0,
    //     "y":0,
    //     "time":"time"
    //   }
    // }
    robots = [myJson['robot-patrol'], myJson['robot-sanitize']]
    robots.map((robot) => {
      addNewAnnotation(robot.x, 0, robot.y);
    })
  }

  function animate() {
    requestAnimationFrame(animate)
    // torus.position.x += 0.005;
    // torus.position.y += 0.005;
    // torus.position.z += 0.005;
    torus.rotateX(0.02)
    torus.rotateY(0.03)
    torus.rotateZ(0.02)
    camera.lookAt(torus.position)
    stlModelMesh.rotateZ(Math.PI / 500)
    directionalLight.lookAt(stlModelMesh.position)
    var diff: number[] = getVector3Difference(prevPosition, profiles[profileIndex], stopThrehold)
    camera.position.x += diff[0] / 50
    camera.position.y += diff[1] / 50
    camera.position.z += diff[2] / 50
    prevPosition = camera.position.toArray()
    var vec = new THREE.Vector3(0, 0, 10);
    vec.applyQuaternion(camera.quaternion);
    // buttonPos1.position.copy( vec );
    // buttonPos1.rotateX(Math.PI/500)
    // controls.update()

    renderer.render(scene, camera)
  }
  document.getElementById("globalOverlayButton-changeToPosition1")!.addEventListener("click", () => { profileIndex = 0 }, false);
  document.getElementById("globalOverlayButton-changeToPosition2")!.addEventListener("click", () => { profileIndex = 1 }, false);
  document.getElementById("globalOverlayButton-changeToPosition3")!.addEventListener("click", () => { profileIndex = 2 }, false);
  document.getElementById("globalOverlayButton-temperature")!.addEventListener("click", () => {
    console.log(API.getTemperature().then(async (value) => {await console.log(value)}))
  }, false);
  // document.getElementById("globalOverlayButton-zone")!.addEventListener("click", () => {
  //   API.getZones().then((value) => { console.log(value) })
  // }, false);
  initRobot()
  animate()
}

init()