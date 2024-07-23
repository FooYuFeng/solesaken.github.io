//. means class
//# means id
//Vars
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
const hamBtn=document.querySelector("#menuButton");
const menuItemsList=document.querySelector("nav ul");

//Defining vars from id
var page1btn = document.querySelector("#page1btn");
var page2btn = document.querySelector("#page2btn");
var page3btn = document.querySelector("#page3btn");
var shotbutton = document.querySelector("#shotbutton");
var resetbutton = document.querySelector("#resetbutton");
var settargetposbutton = document.querySelector("#settargetposbutton");

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

  var goFS = document.getElementById('goFS');
  goFS.addEventListener(
    'click',
    function () {
        toggleFullScreen();
    }
  );

//Menu
hamBtn.addEventListener("click", toggleMenus);
page1btn.addEventListener("click",function(){show(1);});
page2btn.addEventListener("click",function(){show(2);});
page3btn.addEventListener("click",function(){show(3);});

//playfield
settargetposbutton.addEventListener("click", function(){
    resetPlayElements();
    settargetposbutton.classList.toggle("buttonActive");
});

shotbutton.addEventListener("click", function(){
    if (triggerArrowPhysic == null && !currentArrowColided){
        if (settargetposbutton.classList.contains("buttonActive"))
        {
            settargetposbutton.classList.toggle("buttonActive");
        }

        currentArrowHasShot = true;

        currentArrowSpeedX = Math.cos(currentArrowRotation / 180 * Math.PI) * currentArrowPower;
        currentArrowSpeedY = Math.sin(currentArrowRotation / 180 * Math.PI) * currentArrowPower;
    
        if (triggerArrowPhysic != null)
        {
            clearInterval(triggerArrowPhysic);
        }
        triggerArrowPhysic=setInterval(shotArrow,33.33); //use this instead
    }
});

resetbutton.addEventListener("click", function(){
    resetPlayElements();
    moveTargetPos(targetPosX + Math.floor(100 - Math.random() * 200), targetPosY + Math.floor(100 - Math.random() * 200));   
});

//mouseclick
document.addEventListener('click', function(e){
    moveCrosshairToInteract(e.clientX, e.clientY);
});

//touchscreen
document.addEventListener('touchstart', function(e){
    moveCrosshairToInteract(e.touches[0].clientX, e.touches[0].clientY);
});

//keyboard
document.addEventListener('keyup', function(e){
    console.log(e);
    if (e.code === "KeyZ" && triggerArrowPhysic == null && !currentArrowColided){
        
    }
    if (e.code === "KeyX"){
        resetPlayElements();
    }

    // if (e.code === "ArrowRight"){
    //     ball1=document.querySelector(".ball");
    //     csty=getComputedStyle(ball1);
    //     console.log(parseInt(csty.left));
    //     ball1.style.left=parseInt(csty.left)+10+"px";
    // }
    
    // if (e.code === "ArrowLeft"){
    //     ball1=document.querySelector(".ball");

    //     csty=getComputedStyle(ball1);
    //     console.log(parseInt(csty.left));
    //     ball1.style.left=parseInt(csty.left)-10+"px";
    // }        
    
    // if (e.code === "ArrowDown"){
    //     ball1=document.querySelector(".ball");
    //     csty=getComputedStyle(ball1);
    //     console.log(parseInt(csty.top));
    //     ball1.style.top=parseInt(csty.top)+10+"px";
    // }

    // if (e.code === "ArrowUp"){
    //     ball1=document.querySelector(".ball");
    //     csty=getComputedStyle(ball1);
    //     console.log(parseInt(csty.top));
    //     ball1.style.top=parseInt(csty.top)-10+"px";
    // }
});

//functions
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

function show(pgno){
    hideall();
    var onepage=document.querySelector("#page"+pgno);
    onepage.style.display="block";

    if (!allinmenubuttons[pgno - 1].classList.contains("buttonActive"))
    {
        allinmenubuttons[pgno - 1].classList.toggle("buttonActive");
    }
}

function toggleMenus(){
    menuItemsList.classList.toggle("menuHide");
    hamBtn.classList.toggle("menuActive");
}

function moveCrosshairToInteract(interactionPosX, interactionPosY)
{
    if (allpages[2].style.display == "block" && triggerArrowPhysic == null && currentArrowHasShot == false)
        {
            var varqueryplayfield = document.querySelector(".playfield");

            var playfieldselector = varqueryplayfield.getBoundingClientRect();
            var playfieldselectorcrosshair = document.querySelector(".playfieldcrosshair");

            var playfieldselectortarget = document.querySelector(".playfieldtarget");

            if (getComputedStyle(varqueryplayfield).getPropertyValue('zoom') == '0.5')
            {
                interactionPosX /= 0.5;
                interactionPosY /= 0.5;
            }

            if (interactionPosX >= playfieldselector.left && interactionPosY >= playfieldselector.top && interactionPosX <= playfieldselector.right && interactionPosY <= playfieldselector.bottom)
            {
                if (settargetposbutton.classList.contains("buttonActive"))
                {
                    settargetposbutton.classList.toggle("buttonActive");

                    // var targetdistancefromleft = (interactionPosX - 1 - playfieldselectortarget.clientWidth * 0.5 - playfieldselector.left);
                    // var targetdistancefromtop = (interactionPosY - 1 - playfieldselectortarget.clientHeight * 0.5 - playfieldselector.top);

                    // if (targetdistancefromleft < 0)
                    // {
                    //     targetdistancefromleft = 0;
                    // }
                    // if (targetdistancefromtop < 0)
                    // {
                    //     targetdistancefromtop = 0;
                    // }

                    // playfieldselectortarget.style.right = Math.round((playfieldselector.right - playfieldselector.left - playfieldselectortarget.clientWidth - 3) - targetdistancefromleft) + "px";
                    // playfieldselectortarget.style.bottom = Math.round((playfieldselector.bottom - playfieldselector.top - playfieldselectortarget.clientWidth - 3) - targetdistancefromtop) + "px";
                
                    targetPosX = Math.round(interactionPosX - 1 - playfieldselectortarget.clientWidth * 0.5 - playfieldselector.left);
                    targetPosY = Math.round(interactionPosY - 1 - playfieldselectortarget.clientHeight * 0.5 - playfieldselector.top);

                    moveTargetPos(targetPosX, targetPosY);

                    // var targetdistancefromright = Math.round((playfieldselector.right - playfieldselector.left - playfieldselectortarget.clientWidth - 3) - targetPosX);
                    // var targetdistancefrombottom = Math.round((playfieldselector.bottom - playfieldselector.top - playfieldselectortarget.clientWidth - 3) - targetPosY);

                    // if (targetPosX < 0)
                    // {
                    //     targetPosX = 0;
                    // }
                    // if (targetPosY < 0)
                    // {
                    //     targetPosY = 0;
                    // }

                    // if (targetdistancefromright > 0)
                    // {
                    //     targetdistancefromright = 0;
                    // }
                    // if (targetdistancefrombottom > 0)
                    // {
                    //     targetdistancefrombottom = 0;
                    // }

                    // targetPosX += targetdistancefromright;
                    // targetPosY += targetdistancefrombottom;

                    // playfieldselectortarget.style.left = targetPosX + "px";
                    // playfieldselectortarget.style.top = targetPosY + "px";
                }
                else
                {
                    playfieldselectorcrosshair.style.left = Math.round(interactionPosX - 1 - playfieldselectorcrosshair.clientWidth * 0.5 - playfieldselector.left) + "px";
                    playfieldselectorcrosshair.style.top = Math.round(interactionPosY - 1 - playfieldselectorcrosshair.clientHeight * 0.5 - playfieldselector.top) + "px";
            
                    currentAimRotation = 90 - (Math.atan2(interactionPosX - (playfieldselector.left + 50), interactionPosY - (playfieldselector.bottom - 45)) * 180 / Math.PI);
                    setRotationPlayElements(currentAimRotation);
                }
            }
        }
}

function resetPlayElements()
{
    var playfieldselectorarrow=document.querySelector(".playfieldarrow");

    clearInterval(triggerArrowPhysic);
    triggerArrowPhysic = null;

    currentArrowX = 0;
    currentArrowY = 0;
    currentArrowSpeedX = 0;
    currentArrowSpeedY = 0;
    currentArrowHasShot = false;
    currentArrowColided = false;

    playfieldselectorarrow.style.left = 20 + "px";
    playfieldselectorarrow.style.bottom = 38 + "px";
    setRotationPlayElements(currentAimRotation);
}

function setRotationPlayElements(targetangle)
{
    currentArrowRotation = targetangle;

    if (!triggerArrowPhysic)
    {
        var playfieldelementbow = document.getElementById("playfieldbow");
        var bowangle = currentArrowRotation - 2;
        playfieldelementbow.style.transform = 'rotate(' + bowangle + 'deg)';
    }

    var playfieldelementarrow = document.getElementById("playfieldarrow");
    playfieldelementarrow.style.transform = 'rotate(' + currentArrowRotation + 'deg)';
}

function shotArrow()
{
    var playfieldselectorarrow=document.querySelector(".playfieldarrow");

    var csty = getComputedStyle(playfieldselectorarrow);

    var lastcurrentArrowX = currentArrowX;
    var lastcurrentArrowY = currentArrowY;

    currentArrowX += currentArrowSpeedX;
    var moveX = Math.round(currentArrowX);
    currentArrowY += currentArrowSpeedY;
    var moveY = Math.round(currentArrowY);

    playfieldselectorarrow.style.left = parseInt(csty.left) + moveX + "px";
    playfieldselectorarrow.style.bottom = parseInt(csty.bottom) + (-moveY) + "px";

    var aimangle = 90 - (Math.atan2(currentArrowX - lastcurrentArrowX, currentArrowY - lastcurrentArrowY) * 180 / Math.PI);
    setRotationPlayElements(aimangle);

    checkarrowcolider();

    currentArrowX = currentArrowX - moveX;
    currentArrowY = currentArrowY - moveY;

    currentArrowSpeedY += currentGravity;

    currentArrowSpeedX *= currentDrag;
    currentArrowSpeedY *= currentDrag;
}

function checkarrowcolider()
{
    var playfieldselector = document.querySelector(".playfield").getBoundingClientRect();
    var playfieldselectorarrowhitboxbounding = document.querySelector(".playfieldarrowhitbox").getBoundingClientRect();
    var playfieldselectortarget = document.querySelector(".playfieldtarget").getBoundingClientRect();

    if (playfieldselectorarrowhitboxbounding.top < playfieldselectortarget.bottom && playfieldselectorarrowhitboxbounding.top > playfieldselectortarget.top)
    {
        if (currentArrowSpeedX >= 0 && playfieldselectorarrowhitboxbounding.left > playfieldselectortarget.left + 20 && playfieldselectorarrowhitboxbounding.left < playfieldselectortarget.right)
        {
            stoparrowphysic();
            return true;
        }
        else if (currentArrowSpeedX <= 0 && playfieldselectorarrowhitboxbounding.left > playfieldselectortarget.left && playfieldselectorarrowhitboxbounding.left < playfieldselectortarget.right - 20)
        {
            stoparrowphysic();
            return true;
        }
    }

    if (playfieldselectorarrowhitboxbounding.left < playfieldselector.left || playfieldselectorarrowhitboxbounding.top < playfieldselector.top || playfieldselectorarrowhitboxbounding.top > playfieldselector.bottom || playfieldselectorarrowhitboxbounding.left > playfieldselector.right)
    {
        stoparrowphysic();
        return false;
    }
}

function stoparrowphysic()
{
    clearInterval(triggerArrowPhysic);
    triggerArrowPhysic = null;
    currentArrowColided = true;

    setTimeout(function(){
        if (currentArrowColided)
        {
            resetPlayElements();
            moveTargetPos(targetPosX + Math.floor(100 - Math.random() * 200), targetPosY + Math.floor(100 - Math.random() * 200));   
        }
    }, 1000);
}

function moveTargetPos(tempX, tempY)
{
    var playfieldselector = document.querySelector(".playfield").getBoundingClientRect();
    var playfieldselectortarget = document.querySelector(".playfieldtarget");

    var targetdistancefromright = Math.round((playfieldselector.right - playfieldselector.left - playfieldselectortarget.clientWidth - 3) - tempX);
    var targetdistancefrombottom = Math.round((playfieldselector.bottom - playfieldselector.top - playfieldselectortarget.clientWidth - 3) - tempY);

    if (targetdistancefromright > 0)
    {
        targetdistancefromright = 0;
    }
    if (targetdistancefrombottom > 0)
    {
        targetdistancefrombottom = 0;
    }

    tempX += targetdistancefromright;
    tempY += targetdistancefrombottom;

    playfieldselectortarget.style.left = tempX + "px";
    playfieldselectortarget.style.top = tempY + "px";
}