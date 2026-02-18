<!DOCTYPE html>
<html>
<head>
    <title>Babylon.js Simple Game</title>
    <script src="https://cdn.babylonjs.com/babylon.js"></script>
    <style>
        body, html { width: 100%; height: 100%; margin: 0; overflow: hidden; }
        #renderCanvas { width: 100%; height: 100%; touch-action: none; }
    </style>
</head>
<body>
    <canvas id="renderCanvas"></canvas>
    <script>
        const canvas = document.getElementById("renderCanvas");
        const engine = new BABYLON.Engine(canvas, true);

        const createScene = function () {
            const scene = new BABYLON.Scene(engine);

            // --- Setup Camera & Light ---
            const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
            camera.setTarget(BABYLON.Vector3.Zero());
            const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

            // --- Game Objects ---
            const ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 10, height: 10}, scene);
            
            const player = BABYLON.MeshBuilder.CreateSphere("player", {diameter: 1}, scene);
            player.position.y = 0.5;
            player.material = new BABYLON.StandardMaterial("pMat", scene);
            player.material.diffuseColor = new BABYLON.Color3(0, 0.5, 1);

            const goal = BABYLON.MeshBuilder.CreateBox("goal", {size: 0.5}, scene);
            goal.position = new BABYLON.Vector3(3, 0.5, 3);
            goal.material = new BABYLON.StandardMaterial("gMat", scene);
            goal.material.diffuseColor = new BABYLON.Color3(1, 0.8, 0);

            // --- Movement Logic ---
            const inputMap = {};
            scene.actionManager = new BABYLON.ActionManager(scene);
            scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, (evt) => {
                inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
            }));
            scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, (evt) => {
                inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
            }));

            // --- Game Loop ---
            scene.onBeforeRenderObservable.add(() => {
                const speed = 0.1;
                if (inputMap["w"] || inputMap["ArrowUp"]) player.position.z += speed;
                if (inputMap["s"] || inputMap["ArrowDown"]) player.position.z -= speed;
                if (inputMap["a"] || inputMap["ArrowLeft"]) player.position.x -= speed;
                if (inputMap["d"] || inputMap["ArrowRight"]) player.position.x += speed;

                // Simple Collision Check
                if (player.intersectsMesh(goal, false)) {
                    goal.position.x = Math.random() * 8 - 4;
                    goal.position.z = Math.random() * 8 - 4;
                }
            });

            return scene;
        };

        const scene = createScene();
        engine.runRenderLoop(() => { scene.render(); });
        window.addEventListener("resize", () => { engine.resize(); });
    </script>
</body>
</html>