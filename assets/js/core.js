/*!
=========================================================
* JohnDoe Landing page
=========================================================

* Copyright: 2019 DevCRUD (https://devcrud.com)
* Licensed: (https://devcrud.com/licenses)
* Coded by www.devcrud.com

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/


var canvas = document.getElementById('header-background');
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;
var context = canvas.getContext('2d');
var laptop_source_video = document.getElementById("laptop-video");
var cube_source_video = document.getElementById("cube-video");
var controller_source_video = document.getElementById("controller-video");
var laptop_queue_turns = 1;
var cube_queue_turns = 1;
var controller_queue_turns = 1;

var img = new Image();
img.src = "../assets/imgs/Background.png";
img.onload = () => {
    context.fillStyle = "#030305";
    context.fillRect(0, 0, canvas.width, canvas.height);
};

var current_bg_frame = img;

var scrollCooldown = 600;
var isOnCooldown = false;
var scrollTime = 500;

var touchX = null;
var touchY = null;

var previous_section = 0;
var current_section = 0;

var section_identifiers_pc = ["#home", "#about", "#timeline", "#skills", "#portfolio-riverrunners", "#portfolio-followthelight", "#portfolio-bewitchvr", "#portfolio-blender", "#portfolio-3d", "#portfolio-mobile", "#contact"];
var section_identifiers_mobile = ["#home", "#about", "#timeline", "#skills", "#portfolio-riverrunners", "#portfolio-followthelight", "#portfolio-bewitchvr", "#portfolio-blender", "#portfolio-3d", "#portfolio-mobile", "#contact"];

var section_identifiers = [section_identifiers_mobile, section_identifiers_pc];

var parent_sections = {"#timeline" : "#timeline", "#portfolio-3d" : "#portfolio-3d"};

var width_range = [991.98];
var width_mode = 0;

var isVideoActive = false;

var videos = {"#portfolio-riverrunners" : ["https://www.youtube.com/embed/WN4ZUu4RaRQ","River Runners - Story Trailer","River Runners - Story Trailer"],
              "#portfolio-followthelight" : ["https://www.youtube.com/embed/MpLndVTCAs0","Follow The Light - Short Demo","Follow The Light - Short Demo"],
              "#portfolio-bewitchvr" : ["https://www.youtube.com/embed/oRlSEZox83I","BeWitchVR - Short Gameplay Demo","BeWitchVR - Short Demo"],
};
var current_video = "#portfolio-riverrunners";

var isReadMoreActive = false;
var initialReadMoreHTML = "";
var readMoreTextId = "read-more-textbox"
var readMoreHeaderId = "read-more-header"

var isScrollEnabled = true;

if(sessionStorage.getItem("current_hash")) {
    updateWidthMode(false);
    goToHash(sessionStorage.getItem("current_hash"));
}

// smooth scroll
$(document).ready(function(){
    $(".navbar .nav-link").on('click', function(event) {

        if (this.hash !== "") {

            event.preventDefault();

            var hash = this.hash;

            if (section_identifiers[width_mode].indexOf(hash) != current_section) {
              previous_section = current_section;
              setIsOnCooldown(true);
                window.setTimeout(onCooldownEnd, scrollCooldown);
            }
            current_section = section_identifiers[width_mode].indexOf(hash);
            sessionStorage.setItem("current_hash", section_identifiers[width_mode][current_section]);

            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, scrollTime, function(){
                window.location.hash = hash;
            });

            if (Object.keys(videos).indexOf(hash) >= 0) {
                fadeVideoButtonTransition(true);
            }
            else
            {
                fadeVideoButtonTransition(false);
            }
        } 
    });

    $(document).on('wheel', function(event) {
        if (event.originalEvent.deltaY > 75 && !event.originalEvent.shiftKey && !isReadMoreActive && isScrollEnabled) {
            scrollToNext(1);
        }
        else if(event.originalEvent.deltaY < -75  && !event.originalEvent.shiftKey && !isReadMoreActive && isScrollEnabled) {
            scrollToNext(-1);
        }
      
        if(!isScrollEnabled){
            if(document.getElementsByTagName("html")[0].scrollTop > window.innerHeight*2)
            {
                laptop_source_video.pause();
                controller_source_video.pause();
                cube_source_video.pause();
            }
            else
            {
                if((laptop_source_video.paused || laptop_source_video.ended) && (controller_source_video.paused || cube_source_video.ended) && (cube_source_video.paused|| cube_source_video.ended)){
                    setTimeout(playRandomBackgroundVideo(), Math.random() * 2000);
                }
            }
        }
    });

    $(".video-close").on('click', function(event) {
        isVideoActive = false;
        updateVideoVisibility();
    });
    $("#video-player-background").on('click', function(event) {
        isVideoActive = false;
        updateVideoVisibility();
    });


    $("#video-show").on('click', function(event) {
        if(!isOnCooldown) {
            showVideo();
        }
    });

    $(".image-display-extrainfo-text-container").on('click', function(event) {
        event.stopPropagation();
    });

    $(".image-display-container").on('click', function(event) {
        event.stopPropagation();
        document.querySelectorAll(".image-display-extrainfo-text-active").forEach(
        function (value) {
            value.classList.remove("image-display-extrainfo-text-active")
        });
        document.querySelectorAll(".image-display-extrainfo-text-container-active").forEach(
        function (value) {
            value.classList.remove("image-display-extrainfo-text-container-active")
            value.style.width = "0%";
        });
        document.querySelectorAll(".image-display-extrainfo-button-icon").forEach(
        function (value) {
            value.style.rotate = "0deg";            
        });

        if (event.target.parentElement.parentElement.classList.contains("image-display-container")) {
            if(event.target.parentElement.parentElement.classList.contains("image-display-container-clicked")) {

                event.target.parentElement.parentElement.classList.remove("image-display-container-clicked");
                
                document.querySelectorAll(".image-display-container").forEach(
                    function (value) {
                        value.style.opacity = 1;
                    });
            }
            else
            {
                event.target.parentElement.parentElement.classList.add("image-display-container-clicked");
                document.querySelectorAll(".image-display-container").forEach(
                    function (value) {
                        value.style.opacity = 0.1;
                    });
                event.target.parentElement.parentElement.style.opacity = 1;
            }
        } 
        else if (event.target.parentElement.parentElement.parentElement.classList.contains("image-display-container")) {
            if(event.target.parentElement.parentElement.parentElement.classList.contains("image-display-container-clicked")) {
                event.target.parentElement.parentElement.parentElement.classList.remove("image-display-container-clicked");
                document.querySelectorAll(".image-display-container").forEach(
                    function (value) {
                        value.style.opacity = 1;
                    });
            }
            else
            {
                event.target.parentElement.parentElement.parentElement.classList.add("image-display-container-clicked");
                document.querySelectorAll(".image-display-container").forEach(
                    function (value) {
                        value.style.opacity = 0.1;
                    });
                event.target.parentElement.parentElement.parentElement.style.opacity = 1;
            }
        }
    });

    $(".skill-tree-node").on('click', function(event) {
        event.stopPropagation();
        var target = event.target;
        if (event.target.classList.contains("skill-tree-icon")) 
        {
            target = event.target.parentElement;
        }
        if (target.classList.contains("skill-tree-node")) 
        {
            document.querySelectorAll(".skill-tree-node-active").forEach(
            function (value) {
                value.classList.remove("skill-tree-node-active")
            });
            target.classList.add("skill-tree-node-active")
        }
        document.querySelectorAll(".skill-tree-cell-active").forEach(
        function (value) {
            value.classList.remove("skill-tree-cell-active")
        });
        target.querySelector("div").closest(".skill-tree-cell").classList.add("skill-tree-cell-active")
    });

    $(".image-display-extrainfo-button").on('click', function(event) {
        event.stopPropagation();
        document.querySelectorAll(".image-display-extrainfo-button-icon").forEach(
        function (value) {
            if (value.style.rotate == "180deg"){
                value.style.rotate = "0deg";
            }
            else
            {
                value.style.rotate = "180deg";
            }
            
        });
    });
    
    updateVideoVisibility();
    if(!isOnCooldown){
       updateWidthMode();
       updateScrollPosition(); 
    }
    else
    {
        updateWidthMode(false);
    }
    
    

});

// portfolio filters
$(window).on("load", function() {
    var t = $(".portfolio-container");
    t.isotope({
        filter: ".new",
        animationOptions: {
            duration: 750,
            easing: "linear",
            queue: !1
        }
    }), $(".filters a").click(function() {
        $(".filters .active").removeClass("active"), $(this).addClass("active");
        var i = $(this).attr("data-filter");
        return t.isotope({
            filter: i,
            animationOptions: {
                duration: 750,
                easing: "linear",
                queue: !1
            }
        }), !1
    });

    addVideoListeners();
    drawFrame(img)

    $( "#loading-screen" ).fadeTo(500, 0, function() {
        setTimeout(playRandomBackgroundVideo(), Math.random() * 2000);
    }); 
});

// Update window when resized
$(window).on("resize",function(event) {

    updateWidthMode();

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    context.fillStyle = "#030305";
    context.fillRect(0, 0, canvas.width, canvas.height);
    drawFrame(current_bg_frame);

    if(!isOnCooldown & isScrollEnabled) {
        goToHash(section_identifiers[width_mode][current_section]);
    }

    
    
});

// Update window when go back/forward
$(window).on('popstate', function(event) {
    if(!isOnCooldown) {
        goToHash(window.location.hash);
        closeReadMore();
    }
});

// Press any key to continue
$(window).on("keydown",function(event) {
    if(!isOnCooldown && isScrollEnabled && current_section == 0 && (event.which < 112 || event.which > 123)) {
        scrollToNext();
    }
    if(!isOnCooldown && (event.originalEvent.key == "ArrowDown" || event.originalEvent.key == "ArrowRight")) {
        scrollToNext(1);
    }
    if(!isOnCooldown && (event.originalEvent.key == "ArrowUp") || event.originalEvent.key == "ArrowLeft") {
        scrollToNext(-1);
    }
    if(isVideoActive && event.which == 27)
    {
        isVideoActive = false;
        updateVideoVisibility();
    }
    
});
$(window).on("pointerdown",function(event) {
    if(!isOnCooldown && current_section == 0 && isScrollEnabled && event.target.className != "ti-github" && event.target.className != "ti-linkedin") {
        scrollToNext();
    }
});


// Scrolls to another section
function scrollToNext(direction = 1) {
  direction = Math.floor(direction);
  if (current_section + direction < section_identifiers[width_mode].length && current_section + direction >= 0 && !isVideoActive && !isOnCooldown && Math.abs(direction) > 0) {
    previous_section = current_section;
    current_section += direction;
    sessionStorage.setItem("current_hash", section_identifiers[width_mode][current_section]);

    setIsOnCooldown(true);
    window.setTimeout(onCooldownEnd, scrollCooldown);

    closeReadMore();
    updateScrollPosition();
    
  }
}

// Scroll animation
function updateScrollPosition(time = scrollTime) {
    if (current_section >= 0 && current_section < section_identifiers[width_mode].length) {
        var hash = section_identifiers[width_mode][current_section];

        $('html, body').animate({
            scrollTop: $(hash).offset().top
        }, time, function(){
            window.location.hash = hash;
        });

        if (Object.keys(videos).indexOf(hash) >= 0) {
            fadeVideoButtonTransition(true);
        }
        else
        {
            fadeVideoButtonTransition(false);
        }

        
    }
}


// when scroll is over
function onCooldownEnd() {
    setIsOnCooldown(false);
    if (current_section == 0)
    {
        setTimeout(playRandomBackgroundVideo(), Math.random() * 2000);
    }
    else
    {
        drawFrame(img);
    }
}

// switches between pc and mobile modes
function updateWidthMode(scroll=true) {
    var hash = section_identifiers[width_mode][current_section];
    var previous_width_mode = width_mode;
    var width = window.innerWidth;
    width_mode = width_range.length;
    for (i = 0; i < width_range.length; i++){
        if (width < width_range[i]) {
            width_mode = i;
        }
    }


    if (width_mode == 0){

        document.getElementsByTagName("body")[0].style.overflowY = "scroll";
        isScrollEnabled = false;

        var sections = document.getElementsByClassName("mobile-only-section");

        for (i=0; i < sections.length; i++){
            sections[i].style.display = 'initial';
        }

        var components = document.getElementsByClassName("mobile-hidden-component");

        for (i=0; i < components.length; i++){
            components[i].style.visibility = 'hidden';
        }

        var images = document.getElementsByClassName("blob-image-right");
        for (i=0; i < images.length; i++){
            images[i].style.opacity = 0.5;
            images[i].style.height = '60vh';
        }
        images = document.getElementsByClassName("blob-image-left");
        for (i=0; i < images.length; i++){
            images[i].style.opacity = 0.5;
            images[i].style.height = '60vh';
        }

    }
    else
    {
        document.getElementsByTagName("body")[0].style.overflowY = "hidden";
        isScrollEnabled = true;

        var sections = document.getElementsByClassName("mobile-only-section");

        for (i=0; i < sections.length; i++){
            sections[i].style.display = 'none';
        }


        var components = document.getElementsByClassName("mobile-hidden-component");

        for (i=0; i < components.length; i++){
            components[i].style.visibility = 'visible';
        }

        var images = document.getElementsByClassName("blob-image-right");
        for (i=0; i < images.length; i++){
            images[i].style.opacity = 0.9;
            images[i].style.height = '75vh';
        }
        images = document.getElementsByClassName("blob-image-left");
        for (i=0; i < images.length; i++){
            images[i].style.opacity = 0.9;
            images[i].style.height = '75vh';
        }
    }
    
    if (previous_width_mode != width_mode && scroll) {
        
        if (Object.keys(parent_sections).indexOf(hash) >= 0) {
            hash = parent_sections[hash];   
        }
        if (section_identifiers[width_mode].indexOf(hash) != current_section) {
            previous_section = current_section;
            setIsOnCooldown(true);
              window.setTimeout(onCooldownEnd, scrollCooldown);
            }
            current_section = section_identifiers[width_mode].indexOf(hash);
            sessionStorage.setItem("current_hash", section_identifiers[width_mode][current_section]);
            $('html, body').stop();
            goToHash(hash);
    

    }

    if (previous_width_mode != width_mode) {
        //reset image displays
        document.querySelectorAll(".image-display-container").forEach(
        function (value) {
            value.style.opacity = 1;
        });
        document.querySelectorAll(".image-display-container-clicked").forEach(
        function (value) {
            value.classList.remove("image-display-container-clicked");
        });
    }
}

// shows/hides video player
function updateVideoVisibility(video="") {
    if(video!=""){current_video = video;}
    if (isVideoActive) {
       
        document.getElementById("video-player").src = "";

        if(Object.keys(videos).indexOf(current_video) >= 0){
            document.getElementById("video-player").src = videos[current_video][0];
            document.getElementById("video-description").innerText = videos[current_video][1];

        }



        document.getElementById("video-player-background").style.display = "initial";


    }
    else
    {
        
        document.getElementById("video-player").src = "";
        document.getElementById("video-player-background").style.display = "none";
    }
}

function showVideo() {
    var hash = section_identifiers[width_mode][current_section];
    if (Object.keys(videos).indexOf(hash) >= 0) {
        isVideoActive = true;
        updateVideoVisibility(hash);
    }
    else
    {
        isVideoActive = false;
        updateVideoVisibility();
    }

}

function fadeVideoButtonTransition(show = false, duration= 700) {
    if(show) {
        var hash = section_identifiers[width_mode][current_section];
        if(document.getElementById("video-show").style.opacity != 0 && document.getElementById("video-name").textContent != videos[hash][2]){
            $( "#video-name" ).fadeTo(duration * 0.7 /2 , 0.0, function() {
                if (Object.keys(videos).indexOf(hash) >= 0) {
                    document.getElementById("video-name").textContent = videos[hash][2];
                }
                $( "#video-name" ).fadeTo(duration * 0.7 /2 , 1.0, function() {
                    // Animation complete.
                });  
            }); 

        }
        else
        {
            if (Object.keys(videos).indexOf(hash) >= 0) {
                document.getElementById("video-name").textContent = videos[hash][2];
            }
            $( "#video-name" ).stop();
        }
        $( "#video-show" ).fadeTo(duration * 0.8 , 1.0, function() {
            // Animation complete.
            document.getElementById("video-show").style.pointerEvents = "auto";
            document.getElementById("video-show").parentElement.style.pointerEvents = "auto";
        }); 
        $( "#video-name" ).fadeTo(duration * 0.6 , 1.0, function() {
            // Animation complete.
        });  
    }
    else
    {
        $( "#video-show" ).fadeTo(duration * 0.8 , 0.0, function() {
            // Animation complete.
            document.getElementById("video-show").style.pointerEvents = "none";
            document.getElementById("video-show").parentElement.style.pointerEvents = "none";
        });
        $( "#video-name" ).stop();
        $( "#video-name" ).fadeTo(duration * 0.6 , 0.0, function() {
            // Animation complete.
        });  
    }
}

function setIsOnCooldown(value){
    isOnCooldown = value;
}

function goToHash(hash, time=scrollTime) {
        if (section_identifiers[width_mode].indexOf(hash) >= 0) {
            previous_section = current_section;
            current_section = section_identifiers[width_mode].indexOf(hash);
            setIsOnCooldown(true);
            window.setTimeout(onCooldownEnd, scrollCooldown);
            $('html, body').stop();
            updateScrollPosition(time);
            
        }
        else
        {
            if (Object.keys(parent_sections).indexOf(hash) >= 0) {
                hash = parent_sections[hash];   
                previous_section = current_section;
                current_section = section_identifiers[width_mode].indexOf(hash);
                setIsOnCooldown(true);
                window.setTimeout(onCooldownEnd, scrollCooldown);
                $('html, body').stop();
                updateScrollPosition(time);
            }
        }  
}

function playRandomBackgroundVideo() {
    if(laptop_queue_turns > 3) {
        playBackgroundVideo("laptop");
    }
    else if(cube_queue_turns > 3) {
        playBackgroundVideo("cube");
    }
    else if(controller_queue_turns > 3) {
        playBackgroundVideo("controller");
    }
    else
    {
        let random = Math.random();
        if(laptop_queue_turns == 0) {
            if (random > 0.5) {
                playBackgroundVideo("cube");
            }
            else
            {
                playBackgroundVideo("controller");
            }
            
        }
        else if(cube_queue_turns == 0) {
            if (random > 0.5) {
                playBackgroundVideo("laptop");
            }
            else
            {
                playBackgroundVideo("controller");
            }
        }
        else if(controller_queue_turns == 0) {
            if (random > 0.5) {
                playBackgroundVideo("cube");
            }
            else
            {
                playBackgroundVideo("laptop");
            }
        }
        else
        {
            if (random < 0.33) {
                playBackgroundVideo("laptop");
            }
            else if (random < 0.66) {
                playBackgroundVideo("cube");
            }
            else
            {
                playBackgroundVideo("controller");
            }
        }
    }
}

function playBackgroundVideo(video) {
    switch (video) {
        case "laptop":
            laptop_queue_turns = 0;
            cube_queue_turns++;
            controller_queue_turns++;

            laptop_source_video.currentTime = 0;
            laptop_source_video.loop = false; 
            laptop_source_video.muted = true;
            laptop_source_video.play();
            controller_source_video.pause();
            cube_source_video.pause();
            break;
        
        case "cube":
            cube_queue_turns = 0;
            laptop_queue_turns++;
            controller_queue_turns++;

            cube_source_video.currentTime = 0;
            cube_source_video.loop = false; 
            cube_source_video.muted = true;
            cube_source_video.play();
            laptop_source_video.pause();
            controller_source_video.pause();
            break;

        case "controller":
            controller_queue_turns = 0;
            laptop_queue_turns++;
            cube_queue_turns++;

            controller_source_video.currentTime = 0;
            controller_source_video.loop = false; 
            controller_source_video.muted = true;
            controller_source_video.play();
            laptop_source_video.pause();
            cube_source_video.pause();
            break;
    
        default:
            laptop_queue_turns = 0;
            cube_queue_turns++;
            controller_queue_turns++;

            laptop_source_video.currentTime = 0;
            laptop_source_video.loop = false; 
            laptop_source_video.muted = true;
            laptop_source_video.play();
            break;
    }
}

function addVideoListeners() {
    laptop_source_video.currentTime = 0;
    laptop_source_video.loop = false; 
    laptop_source_video.muted = true;
    cube_source_video.currentTime = 0;
    cube_source_video.loop = false; 
    cube_source_video.muted = true;
    controller_source_video.currentTime = 0;
    controller_source_video.loop = false; 
    controller_source_video.muted = true;

    laptop_source_video.addEventListener('play', function () {
        laptop_source_video.currentTime = 0;
        laptop_source_video.loop = false; 
        laptop_source_video.muted = true;
        var $this = this; //cache
        (function step() {
            if (!$this.paused && !$this.ended) {
                current_bg_frame = $this;
                drawFrame($this);
                requestAnimationFrame(step);
            }
            if ($this.ended) {
                setTimeout(playRandomBackgroundVideo(), Math.random()*2000);
            }
        })();
    }, 0);

    cube_source_video.addEventListener('play', function () {
        cube_source_video.currentTime = 0;
        cube_source_video.loop = false; 
        cube_source_video.muted = true;
        var $this = this; //cache
        (function step() {
            if (!$this.paused && !$this.ended) {
                current_bg_frame = $this;
                drawFrame($this);
                requestAnimationFrame(step);
            }
            if ($this.ended) {
                setTimeout(playRandomBackgroundVideo(), Math.random()*2000);
            }
        })();
    }, 0);

    controller_source_video.addEventListener('play', function () {
        controller_source_video.currentTime = 0;
        controller_source_video.loop = false; 
        controller_source_video.muted = true;
        var $this = this; //cache
        (function step() {
            if (!$this.paused && !$this.ended) {
                current_bg_frame = $this;
                drawFrame($this);
                requestAnimationFrame(step);
            }
            if ($this.ended) {
                setTimeout(playRandomBackgroundVideo(), Math.random()*2000);
            }
        })();
    }, 0);
}

function resetBackgroundAnimation()
{
    controller_source_video.pause();
    controller_source_video.currentTime = 0;
    controller_source_video.loop = false; 
    controller_source_video.muted = true;

    laptop_source_video.pause();
    laptop_source_video.currentTime = 0;
    laptop_source_video.loop = false; 
    laptop_source_video.muted = true;

    cube_source_video.pause();
    cube_source_video.currentTime = 0;
    cube_source_video.loop = false; 
    cube_source_video.muted = true;
    
}

function drawFrame(frame, frame_width=1920, frame_height=1080) {

    if (current_section <= 1) {
        
        if (current_section == 1)
        {
            resetBackgroundAnimation();
        }    

            var scale_factor = Math.min(canvas.width/frame_width, canvas.height/frame_height);
            var newWidth = frame_width * scale_factor;
            var newHeight = frame_height * scale_factor;
            var x = 0;
            var y = 0;

            if (width_mode == 0) {
                var transition_width = 1500
                if (canvas.width - width_range[width_mode] > -1 * transition_width) {
                    scale_factor = canvas.width/frame_width;
                    height_scale_factor = canvas.height/frame_height;

                    scale_factor = scale_factor + (height_scale_factor - scale_factor) * 1 - (canvas.width - width_range[width_mode])/(-1 * transition_width);
                    if(scale_factor < canvas.width/frame_width)
                    {
                        scale_factor = canvas.width/frame_width;
                    }

                }
                else
                {
                    scale_factor = canvas.width/frame_width;
                }

                newWidth = frame_width * scale_factor;
                newHeight = frame_height * scale_factor;
                
                x = canvas.width/2 - newWidth/2;
                y = canvas.height - newHeight;

            }
            else
            {
                var transition_width = 1500
                scale_factor = canvas.height/frame_height;

                newWidth = frame_width * scale_factor;
                newHeight = frame_height * scale_factor;

                x = canvas.width/2 - newWidth/2;
                y = canvas.height - newHeight;

            }
            try {
                context.drawImage(frame, x, y, newWidth, newHeight);
            } catch (error) {
                
            }
            
    
    }  
}

function setElementOpacity(id, opacity, makeinvisible = []){
    document.getElementById(id).style.opacity = opacity;
    makeinvisible.forEach(element => {
        document.getElementById(element).style.opacity = 0;
    });
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
    var element = document.getElementById("copied-info");
    if(element.style.animationPlayState != "running") {
        setTimeout(() => {
            var element = document.getElementById("copied-info");
            element.style.animationPlayState = "paused";
        }, 3000);
    }
    element.style.animationPlayState = "running";
}

function onClickReadMore(sourceId) {
    var sourceText = document.getElementById(sourceId).innerHTML;
    var sourceImage = document.getElementById(sourceId).firstElementChild.style.backgroundImage;
    document.getElementById(readMoreTextId).style.bottom = "0%";
    if (initialReadMoreHTML == ""){ initialReadMoreHTML = document.getElementById(readMoreTextId).innerHTML;}
    document.getElementById(readMoreTextId).innerHTML = initialReadMoreHTML + sourceText;
    document.getElementById(readMoreHeaderId).style.top = "0%";
    document.getElementById(readMoreHeaderId).firstElementChild.style.backgroundImage = document.getElementById(sourceId).firstElementChild.style.backgroundImage;
    isReadMoreActive = true;
}

function closeReadMore(){
    document.getElementById(readMoreTextId).style.bottom = "-80%";
    document.getElementById(readMoreHeaderId).style.top = "-20%";
    isReadMoreActive = false;
}


function scrollHorizontalElementByPercent(elementId, percent, smooth = true)
{
    var element = document.getElementById(elementId);
    var pixels = element.clientWidth * percent/100;
    if (smooth)
    {
        element.scrollBy({
        left: pixels,
        behavior: "smooth",
    });
    return;
    }
    element.scrollBy({
        left: pixels,
        behavior: "instant",
    });
}

function hideAllSkillTooltips(){
    document.querySelectorAll(".skill-tree-node-active").forEach(
    function (value) {
        value.classList.remove("skill-tree-node-active")
    });
    document.querySelectorAll(".skill-tree-cell-active").forEach(
    function (value) {
        value.classList.remove("skill-tree-cell-active")
    });
}

function toggleImageDisplayInfo(containerID){
    var container = document.getElementById(containerID);
    if (container.classList.contains("image-display-extrainfo-text-container"))
    {
        if(container.classList.contains("image-display-extrainfo-text-container-active"))
        {
            //disable info
            container.classList.remove("image-display-extrainfo-text-container-active")
            container.style.width = "0%";
            container.querySelectorAll(".image-display-extrainfo-text-active").forEach(
            function (value) {
                value.classList.remove("image-display-extrainfo-text-active")
            });
        }
        else
        {
            //enable info
            container.classList.add("image-display-extrainfo-text-container-active")
            container.style.width = container.style.maxWidth;
            container.querySelectorAll(".image-display-extrainfo-text").forEach(
            function (value) {
                value.classList.add("image-display-extrainfo-text-active")
            });
        }
    }
}

function hideImageDisplayInfo(containerID){
    var container = document.getElementById(containerID);
    if (container.classList.contains("image-display-extrainfo-text-container"))
    {
        if(container.classList.contains("image-display-extrainfo-text-container-active"))
        {
            //disable info
            container.classList.remove("image-display-extrainfo-text-container-active")
            container.querySelectorAll(".image-display-extrainfo-text-active").forEach(
            function (value) {
                value.classList.remove("image-display-extrainfo-text-active")
            });
        }
    }
}