<script lang="ts">
	import * as THREE from 'three';
	import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
	import { T, Three, useFrame } from '@threlte/core';

	// TODO: limit the camera movement based on the collider
	// raycast in direction of camera and move it if it's further than the closest point

	const clock = new THREE.Clock();

	let player, controls;

	$: console.log(player);

	let playerIsOnGround = false;
	let fwdPressed = false;
	let bkdPressed = false;
	let lftPressed = false;
	let rgtPressed = false;

	const playerVelocity = new THREE.Vector3();
	const upVector = new THREE.Vector3(0, 1, 0);
	const tempVector = new THREE.Vector3();
	const tempVector2 = new THREE.Vector3();
	const tempBox = new THREE.Box3();
	const tempMat = new THREE.Matrix4();
	const tempSegment = new THREE.Line3();

	// if (params.firstPerson) {
	// 	controls.maxPolarAngle = Math.PI;
	// 	controls.minDistance = 1e-4;
	// 	controls.maxDistance = 1e-4;
	// }

	// useFrame((_ctx, delta) => {
	// 	// console.log(delta);
	// 	// const physicsSteps = params.physicsSteps;
	// 	// for (let i = 0; i < physicsSteps; i++) {
	// 	// 	updatePlayer(delta / physicsSteps);
	// 	// }
	// 	if (player) {
	// 		updatePlayer(delta);
	// 	}
	// });

	function reset() {
		// playerVelocity.set(0, 0, 0);
		// player.position.set(15.75, -3, 30);
		// camera.position.sub(controls.target);
		// controls.target.copy(player.position);
		// camera.position.add(player.position);
		// controls.update();
	}

	function updatePlayer(delta) {
		// playerVelocity.y += playerIsOnGround ? 0 : delta * params.gravity;
		player.position.addScaledVector(playerVelocity, delta);

		// move the player
		const angle = controls.getAzimuthalAngle();
		if (fwdPressed) {
			tempVector.set(0, 0, -1).applyAxisAngle(upVector, angle);
			player.position.addScaledVector(tempVector, params.playerSpeed * delta);
		}

		if (bkdPressed) {
			tempVector.set(0, 0, 1).applyAxisAngle(upVector, angle);
			player.position.addScaledVector(tempVector, params.playerSpeed * delta);
		}

		if (lftPressed) {
			tempVector.set(-1, 0, 0).applyAxisAngle(upVector, angle);
			player.position.addScaledVector(tempVector, params.playerSpeed * delta);
		}

		if (rgtPressed) {
			tempVector.set(1, 0, 0).applyAxisAngle(upVector, angle);
			player.position.addScaledVector(tempVector, params.playerSpeed * delta);
		}

		player.updateMatrixWorld();

		// adjust player position based on collisions
		const capsuleInfo = player.capsuleInfo;
		tempBox.makeEmpty();
		tempMat.copy(collider.matrixWorld).invert();
		tempSegment.copy(capsuleInfo.segment);

		// get the position of the capsule in the local space of the collider
		tempSegment.start.applyMatrix4(player.matrixWorld).applyMatrix4(tempMat);
		tempSegment.end.applyMatrix4(player.matrixWorld).applyMatrix4(tempMat);

		// get the axis aligned bounding box of the capsule
		tempBox.expandByPoint(tempSegment.start);
		tempBox.expandByPoint(tempSegment.end);

		tempBox.min.addScalar(-capsuleInfo.radius);
		tempBox.max.addScalar(capsuleInfo.radius);

		collider.geometry.boundsTree.shapecast({
			intersectsBounds: (box) => box.intersectsBox(tempBox),

			intersectsTriangle: (tri) => {
				// check if the triangle is intersecting the capsule and adjust the
				// capsule position if it is.
				const triPoint = tempVector;
				const capsulePoint = tempVector2;

				const distance = tri.closestPointToSegment(tempSegment, triPoint, capsulePoint);
				if (distance < capsuleInfo.radius) {
					const depth = capsuleInfo.radius - distance;
					const direction = capsulePoint.sub(triPoint).normalize();

					tempSegment.start.addScaledVector(direction, depth);
					tempSegment.end.addScaledVector(direction, depth);
				}
			}
		});

		// get the adjusted position of the capsule collider in world space after checking
		// triangle collisions and moving it. capsuleInfo.segment.start is assumed to be
		// the origin of the player model.
		const newPosition = tempVector;
		newPosition.copy(tempSegment.start).applyMatrix4(collider.matrixWorld);

		// check how much the collider was moved
		const deltaVector = tempVector2;
		deltaVector.subVectors(newPosition, player.position);

		// if the player was primarily adjusted vertically we assume it's on something we should consider ground
		playerIsOnGround = deltaVector.y > Math.abs(delta * playerVelocity.y * 0.25);

		const offset = Math.max(0.0, deltaVector.length() - 1e-5);
		deltaVector.normalize().multiplyScalar(offset);

		// adjust the player model
		player.position.add(deltaVector);

		if (!playerIsOnGround) {
			deltaVector.normalize();
			playerVelocity.addScaledVector(deltaVector, -deltaVector.dot(playerVelocity));
		} else {
			playerVelocity.set(0, 0, 0);
		}

		// adjust the camera
		camera.position.sub(controls.target);
		controls.target.copy(player.position);
		camera.position.add(player.position);

		// if the player has fallen too far below the level reset their position to the start
		if (player.position.y < -25) {
			reset();
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		switch (e.code) {
			case 'KeyW':
				fwdPressed = true;
				break;
			case 'KeyS':
				bkdPressed = true;
				break;
			case 'KeyD':
				rgtPressed = true;
				break;
			case 'KeyA':
				lftPressed = true;
				break;
			case 'Space':
				if (playerIsOnGround) {
					playerVelocity.y = 10.0;
				}
				break;
		}
	}

	function handleKeyup(e: KeyboardEvent): void {
		switch (e.code) {
			case 'KeyW':
				fwdPressed = false;
				break;
			case 'KeyS':
				bkdPressed = false;
				break;
			case 'KeyD':
				rgtPressed = false;
				break;
			case 'KeyA':
				lftPressed = false;
				break;
		}
	}
</script>

<svelte:window on:keyup={handleKeyup} on:keydown={handleKeydown} />

<T.Mesh position.y={0.5} castShadow receiveShadow bind:ref={player}>
	<!-- Add interaction -->
	<!-- <InteractiveObject
    object={ref}
    interactive
    on:pointerenter={() => ($scale = 2)}
    on:pointerleave={() => ($scale = 1)}
  /> -->

	<Three type={RoundedBoxGeometry} args={[1.0, 2.0, 1.0, 10, 0.5]} />
	<T.MeshStandardMaterial color="#333333" />
</T.Mesh>
