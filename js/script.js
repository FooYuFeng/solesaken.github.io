//. means class
//# means id

//Vars
const hamBtn=document.querySelector("#menuButton");
const menuItemsList=document.querySelector("nav ul");

var audioarrowland = new Audio('audio/arrowland.mp3');
var audioarrowshot = new Audio('audio/shot.mp3');
var triggerArrowPhysic;
var currentArrowHasShot = false;
var currentArrowColided = false;
var currentArrowRotation = 0;
var currentArrowX = 0;
var currentArrowY = 0;
var currentArrowPower = 20;
var currentArrowSpeedX = 0;
var currentArrowSpeedY = 0;
var currentGravity = 0.1;
var currentDrag = 0.99;
var currentAimRotation = 0;
var targetPosX = 500;
var targetPosY = 250;

var allpages=document.querySelectorAll(".page");
var allinmenubuttons=document.querySelectorAll(".inMenuButtons");

var page1btn = document.querySelector("#page1btn");
var page2btn = document.querySelector("#page2btn");
var page3btn = document.querySelector("#page3btn");
var shotbutton = document.querySelector("#shotbutton");
var resetbutton = document.querySelector("#resetbutton");
var settargetposbutton = document.querySelector("#settargetposbutton");
var playfieldaccuracy = document.querySelector("#accuracyPoints");

//On Start
console.log(allpages);
hideall();
show(1);

//FullScreen Controls
function toggleFullScreen() {
    var doc = window.document;
    var docEl = doc.documentElement;
  
    var requestFullScreen =
      docEl.requestFullscreen ||
      docEl.mozRequestFullScreen ||
      docEl.webkitRequestFullScreen ||
      docEl.msRequestFullscreen;
    var cancelFullScreen =
      doc.exitFullscreen ||
      doc.mozCancelFullScreen ||
      doc.webkitExitFullscreen ||
      doc.msExitFullscreen;
  
    if (
      !doc.fullscreenElement &&
      !doc.mozFullScreenElement &&
      !doc.webkitFullscreenElement &&
      !doc.msFullscreenElement
    ) {
      requestFullScreen.call(docEl);
    } else {
      cancelFullScreen.call(doc);
    }
  }

  //FullScreenButton Listener
  var goFS = document.getElementById('goFS');
  goFS.addEventListener(
    'click',
    function () {
        toggleFullScreen();
    }
  );

//Menu Event Listeners
hamBtn.addEventListener("click", toggleMenus); //Expend/Compress Menu
page1btn.addEventListener("click",function(){show(1);}); //Show Page 1
page2btn.addEventListener("click",function(){show(2);}); //Show Page 2
page3btn.addEventListener("click",function(){show(3);}); //Show Page 3

//Playfield Event Listeners
//on shot button click
shotbutton.addEventListener("click", function(){
    //shot only if simulation and arrow is not running nor colided.
    if (triggerArrowPhysic == null && !currentArrowColided){
        //set target button disabled if it was active.
        if (settargetposbutton.classList.contains("buttonActive"))
        {
            settargetposbutton.classList.toggle("buttonActive");
        }

        //play shotting sound.
        audioarrowshot.pause();
        audioarrowshot.currentTime = 0;
        audioarrowshot.play();

        //set arrow to has been shot.
        currentArrowHasShot = true;

        //set current arrow velocity based on arrow power.
        currentArrowSpeedX = Math.cos(currentArrowRotation / 180 * Math.PI) * currentArrowPower;
        currentArrowSpeedY = Math.sin(currentArrowRotation / 180 * Math.PI) * currentArrowPower;
    
        //stop arrow physic if it was still running to prevent muitiple functions running on update loop.
        if (triggerArrowPhysic != null)
        {
            clearInterval(triggerArrowPhysic);
        }
        //run arrow physic.
        triggerArrowPhysic=setInterval(shotArrow,33.33);
    }
});

//on reset button click
resetbutton.addEventListener("click", function(){
    //reset all stats of the bow and arrow.
    resetPlayElements();
    //set target to a random position around where it is originally placed.
    moveTargetPos(targetPosX + Math.floor(100 - Math.random() * 200), targetPosY + Math.floor(100 - Math.random() * 200));   
});

//Button to Set Target Position in Playfield
settargetposbutton.addEventListener("click", function(){
    //reset all stats of the bow and arrow.
    resetPlayElements();
    //set this button to be deactive or active, if another function detect if this is active, it will run it.
    settargetposbutton.classList.toggle("buttonActive");
});

//mouseclick position on playfield
document.addEventListener('click', function(e){
    //move crosshair to this position.
    moveCrosshairToInteract(e.clientX, e.clientY);
});

//touchscreen touches positions on playfield
document.addEventListener('touchstart', function(e){
    //move crosshair to this position.
    moveCrosshairToInteract(e.touches[0].clientX, e.touches[0].clientY);
});

//functions
//hide all pages and deactive any active button.
function hideall(){
    for (var onepage of allpages){
        onepage.style.display="none";
    }

    for (var onebutton of allinmenubuttons)
    {
        if (onebutton.classList.contains("buttonActive"))
        {
            onebutton.classList.toggle("buttonActive");
        }
    }
}

//show a selected page.
function show(pgno){
    //hide all pages and deactive any active button.
    hideall();
    //get this specific page as an element.
    var onepage=document.querySelector("#page"+pgno);
    //show this specific page.
    onepage.style.display="block";

    //activate the selected button.
    if (!allinmenubuttons[pgno - 1].classList.contains("buttonActive"))
    {
        allinmenubuttons[pgno - 1].classList.toggle("buttonActive");
    }
}

//toggle the menu to expend or collapes for smaller screen.
function toggleMenus(){
    menuItemsList.classList.toggle("menuHide");
    hamBtn.classList.toggle("menuActive");
}

//move crosshair to this position in playfield.
function moveCrosshairToInteract(interactionPosX, interactionPosY)
{
    //check if interaction is on the right page.
    if (allpages[2].style.display == "block" && triggerArrowPhysic == null && currentArrowHasShot == false)
        {
            //get all required variables.
            var varqueryplayfield = document.querySelector(".playfield");

            var playfieldselector = varqueryplayfield.getBoundingClientRect();
            var playfieldselectorcrosshair = document.querySelector(".playfieldcrosshair");

            var playfieldselectortarget = document.querySelector(".playfieldtarget");

            //check if the playfield is zoom out, if it is, interaction scales with zoom distance.
            if (getComputedStyle(varqueryplayfield).getPropertyValue('zoom') == '0.5')
            {
                interactionPosX /= 0.5;
                interactionPosY /= 0.5;
            }

            //check if interaction is on the right position.
            if (interactionPosX >= playfieldselector.left && interactionPosY >= playfieldselector.top && interactionPosX <= playfieldselector.right && interactionPosY <= playfieldselector.bottom)
            {
                //check if set target button is active.
                if (settargetposbutton.classList.contains("buttonActive"))
                {
                    //deactivate the set targetpos button and set the target to the mouse position.
                    settargetposbutton.classList.toggle("buttonActive");

                    targetPosX = Math.round(interactionPosX - 1 - playfieldselectortarget.clientWidth * 0.5 - playfieldselector.left);
                    targetPosY = Math.round(interactionPosY - 1 - playfieldselectortarget.clientHeight * 0.5 - playfieldselector.top);

                    //set target to the mouse position
                    moveTargetPos(targetPosX, targetPosY);
                }
                else
                {
                    //set crosshair to interaction position.
                    playfieldselectorcrosshair.style.left = Math.round(interactionPosX - 1 - playfieldselectorcrosshair.clientWidth * 0.5 - playfieldselector.left) + "px";
                    playfieldselectorcrosshair.style.top = Math.round(interactionPosY - 1 - playfieldselectorcrosshair.clientHeight * 0.5 - playfieldselector.top) + "px";
            
                    currentAimRotation = 90 - (Math.atan2(interactionPosX - (playfieldselector.left + 50), interactionPosY - (playfieldselector.bottom - 45)) * 180 / Math.PI);
                    
                    //set the bow and arrow aim angle facing towards crosshair.
                    setRotationPlayElements(currentAimRotation);
                }
            }
        }
}

//reset the bow and arrow vars.
function resetPlayElements()
{
    //get all required variables.
    var playfieldselectorarrow=document.querySelector(".playfieldarrow");

    //clear looping update function of arrow physic.
    clearInterval(triggerArrowPhysic);
    triggerArrowPhysic = null;

    //reset arrow stats.
    currentArrowX = 0;
    currentArrowY = 0;
    currentArrowSpeedX = 0;
    currentArrowSpeedY = 0;
    currentArrowHasShot = false;
    currentArrowColided = false;

    //reset arrow position.
    playfieldselectorarrow.style.left = 20 + "px";
    playfieldselectorarrow.style.bottom = 38 + "px";

    //reset bow and arrow rotation.
    setRotationPlayElements(currentAimRotation);
}

//set bow and arrow rotation
function setRotationPlayElements(targetangle)
{
    //set global arrow rotation to new angle.
    currentArrowRotation = targetangle;

    //run this if simulation has not start.
    if (!triggerArrowPhysic)
    {
        //set the bow rotation.
        var playfieldelementbow = document.getElementById("playfieldbow");
        var bowangle = currentArrowRotation - 2;
        playfieldelementbow.style.transform = 'rotate(' + bowangle + 'deg)';
    }

    //set the arrow rotation.
    var playfieldelementarrow = document.getElementById("playfieldarrow");
    playfieldelementarrow.style.transform = 'rotate(' + currentArrowRotation + 'deg)';
}

//move the arrow by 1 frame with physics.
function shotArrow()
{
    //get all required variables.
    var playfieldselectorarrow=document.querySelector(".playfieldarrow");

    //get css style of arrow.
    var csty = getComputedStyle(playfieldselectorarrow);

    //save current position before updating.
    var lastcurrentArrowX = currentArrowX;
    var lastcurrentArrowY = currentArrowY;

    //get amount of distance moved rounding to int for visual, but keep float values for future updates.
    currentArrowX += currentArrowSpeedX;
    var moveX = Math.round(currentArrowX);
    currentArrowY += currentArrowSpeedY;
    var moveY = Math.round(currentArrowY);

    //move the arrow by distance calculated.
    playfieldselectorarrow.style.left = parseInt(csty.left) + moveX + "px";
    playfieldselectorarrow.style.bottom = parseInt(csty.bottom) + (-moveY) + "px";

    //set the new arrow rotation based off the last position pointing to the new position.
    var aimangle = 90 - (Math.atan2(currentArrowX - lastcurrentArrowX, currentArrowY - lastcurrentArrowY) * 180 / Math.PI);
    setRotationPlayElements(aimangle);

    //check arrow colider.
    checkarrowcolider();


    //calculated physic after moving.
    currentArrowX = currentArrowX - moveX;
    currentArrowY = currentArrowY - moveY;

    //gravity affecting arrow.
    currentArrowSpeedY += currentGravity;

    //drag of the arrow.
    currentArrowSpeedX *= currentDrag;
    currentArrowSpeedY *= currentDrag;
}

//check the arrow colider.
function checkarrowcolider()
{
    //get all required variables.
    var playfieldselector = document.querySelector(".playfield").getBoundingClientRect();
    var playfieldselectorarrowhitboxbounding = document.querySelector(".playfieldarrowhitbox").getBoundingClientRect();
    var playfieldselectortarget = document.querySelector(".playfieldtarget").getBoundingClientRect();

    //check if arrow has colided with the target.
    if (playfieldselectorarrowhitboxbounding.top < playfieldselectortarget.bottom && playfieldselectorarrowhitboxbounding.top > playfieldselectortarget.top)
    {
        //colided from the left side.
        if (currentArrowSpeedX >= 0 && playfieldselectorarrowhitboxbounding.left > playfieldselectortarget.left + 20 && playfieldselectorarrowhitboxbounding.left < playfieldselectortarget.right)
        {
            //stop arrow simulation.
            stoparrowphysic();
            //calculate score based on arrow position.
            calculateaccuracyscore();
        }
        //colided from the right side.
        else if (currentArrowSpeedX <= 0 && playfieldselectorarrowhitboxbounding.left > playfieldselectortarget.left && playfieldselectorarrowhitboxbounding.left < playfieldselectortarget.right - 20)
        {
            //stop arrow simulation.
            stoparrowphysic();
            //calculate score based on arrow position.
            calculateaccuracyscore();
        }
    }

    //colided with the boarder of playfield.
    if (playfieldselectorarrowhitboxbounding.left < playfieldselector.left || playfieldselectorarrowhitboxbounding.top < playfieldselector.top || playfieldselectorarrowhitboxbounding.top > playfieldselector.bottom || playfieldselectorarrowhitboxbounding.left > playfieldselector.right)
    {
        stoparrowphysic();
        playfieldaccuracy.innerHTML = "Accuracy: 0%";
    }
}

//function to stop simulation.
function stoparrowphysic()
{
    //play arrow hit sound.
    audioarrowland.pause();
    audioarrowland.currentTime = 0;
    audioarrowland.play();

    //stop simulation.
    clearInterval(triggerArrowPhysic);
    triggerArrowPhysic = null;

    //arrow has colided.
    currentArrowColided = true;

    //run function after 1 second.
    setTimeout(function(){
        //reset playfield if arrow has colided.
        if (currentArrowColided)
        {
            //reset the bow and arrow vars.
            resetPlayElements();
            moveTargetPos(targetPosX + Math.floor(100 - Math.random() * 200), targetPosY + Math.floor(100 - Math.random() * 200));   
        }
    }, 1000);
}

//set target to the mouse position
function moveTargetPos(tempX, tempY)
{
    //get all required variables.
    var playfieldselector = document.querySelector(".playfield").getBoundingClientRect();
    var playfieldselectortarget = document.querySelector(".playfieldtarget");

    //calculate hitbox boarder distance from right and bottom playfield boarder.
    var targetdistancefromright = Math.round((playfieldselector.right - playfieldselector.left - playfieldselectortarget.clientWidth - 3) - tempX);
    var targetdistancefrombottom = Math.round((playfieldselector.bottom - playfieldselector.top - playfieldselectortarget.clientWidth - 3) - tempY);

    //set distance to 0 if the hitbox boarder never go past the playfield of right and bottom.
    if (targetdistancefromright > 0)
    {
        targetdistancefromright = 0;
    }
    if (targetdistancefrombottom > 0)
    {
        targetdistancefrombottom = 0;
    }

    //set distance to 0 if the hitbox boarder go past the playfield of left and top.
    if (tempX < 0)
    {
        tempX = 0;
    }
    if (tempY < 0)
    {
        tempY = 0;
    }

    //add the offset if the hitbox go past the playfield of right and bottom.
    tempX += targetdistancefromright;
    tempY += targetdistancefrombottom;

    //set the target position from all calculations and checks.
    playfieldselectortarget.style.left = tempX + "px";
    playfieldselectortarget.style.top = tempY + "px";
}

//calculate score based on arrow position and target's center point.
function calculateaccuracyscore()
{
    //get all required variables.
    var playfieldselectorarrowhitboxbounding = document.querySelector(".playfieldarrowhitbox").getBoundingClientRect();
    var playfieldselectortarget = document.querySelector(".playfieldtarget").getBoundingClientRect();

    //calculater
    var radiusoftarget = (playfieldselectortarget.bottom - playfieldselectortarget.top) * 0.5;
    var tempmath = Math.abs((playfieldselectorarrowhitboxbounding.top - playfieldselectortarget.top) - radiusoftarget);
    playfieldaccuracy.innerHTML = "Accuracy: " + Math.round(((radiusoftarget - tempmath)/radiusoftarget) * 100) + "%";
}