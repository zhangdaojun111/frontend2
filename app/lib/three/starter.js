import * as THREE from "three";
import {CanvasRenderer} from "./CanvasRenderer";

let starter = {};

var SEPARATION = 100, AMOUNTX = 50, AMOUNTY = 50;
var container;
var camera, scene, renderer;
var particles, particle, count = 0;
var mouseX = 0, mouseY = -400;
var windowHalfX = getWidth() / 2;
var windowHalfY = getHeight() / 2;

function getWidth() {
    return document.documentElement.clientWidth;
}

function getHeight() {
    return document.documentElement.clientHeight / 1.5;
}


starter.init = function () {
    container = document.createElement( 'div' );
    document.body.appendChild( container );
    $(container).addClass('wave');
    camera = new THREE.PerspectiveCamera( 75, getWidth() / getHeight(), 1, 10000 );
    camera.position.z = 1000;
    scene = new THREE.Scene();
    particles = [];
    var PI2 = Math.PI * 2;
    var material = new CanvasRenderer.SpriteCanvasMaterial( {
        color: 0x0099ff,
        fillColor: 0x023150,
        program: function ( context ) {
            context.beginPath();
            context.arc( 0, 0, 0.5, 0, PI2, true );
            context.fill();
        }
    } );
    var i = 0;
    for ( var ix = 0; ix < AMOUNTX; ix ++ ) {
        for ( var iy = 0; iy < AMOUNTY; iy ++ ) {
            particle = particles[ i ++ ] = new THREE.Sprite( material );
            particle.position.x = ix * SEPARATION - ( ( AMOUNTX * SEPARATION ) / 2 );
            particle.position.z = iy * SEPARATION - ( ( AMOUNTY * SEPARATION ) / 2 );
            scene.add( particle );
        }
    }
    renderer = new CanvasRenderer.CanvasRenderer({
        fillColor: 0xffffff,
        alpha: true
    });
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( getWidth(), getHeight() );
    container.appendChild( renderer.domElement );
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    // document.addEventListener( 'touchstart', onDocumentTouchStart, false );
    // document.addEventListener( 'touchmove', onDocumentTouchMove, false );
    //
    window.addEventListener( 'resize', onWindowResize, false );
};
function onWindowResize() {
    windowHalfX = getWidth() / 2;
    windowHalfY = getHeight() / 2;
    camera.aspect = getWidth() / getHeight();
    camera.updateProjectionMatrix();
    renderer.setSize( getWidth(), getHeight() );
}
//
function onDocumentMouseMove( event ) {
    mouseX = event.clientX - windowHalfX;
    mouseY = -400;
}
// function onDocumentTouchStart( event ) {
//     if ( event.touches.length === 1 ) {
//         event.preventDefault();
//         mouseX = event.touches[ 0 ].pageX - windowHalfX;
//         mouseY = event.touches[ 0 ].pageY - windowHalfY;
//     }
// }
// function onDocumentTouchMove( event ) {
//     if ( event.touches.length === 1 ) {
//         event.preventDefault();
//         mouseX = event.touches[ 0 ].pageX - windowHalfX;
//         mouseY = event.touches[ 0 ].pageY - windowHalfY;
//     }
// }

starter.animate = function () {
    requestAnimationFrame( starter.animate );
    starter.render();
};
starter.render = function () {
    camera.position.x += ( mouseX - camera.position.x ) * .02;
    camera.position.y += ( - mouseY - camera.position.y ) * .05;
    camera.lookAt( scene.position );
    var i = 0;
    for ( var ix = 0; ix < AMOUNTX; ix ++ ) {
        for ( var iy = 0; iy < AMOUNTY; iy ++ ) {
            particle = particles[ i++ ];
            particle.position.y = ( Math.sin( ( ix + count ) * 0.3 ) * 50 ) +
                ( Math.sin( ( iy + count ) * 0.5 ) * 50 );
            particle.scale.x = particle.scale.y = ( Math.sin( ( ix + count ) * 0.3 ) + 1 ) * 4 +
                ( Math.sin( ( iy + count ) * 0.5 ) + 1 ) * 4;
        }
    }
    renderer.render( scene, camera );
    count += 0.1;
};

export {starter};