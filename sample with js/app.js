/**
 * Created by ctw on 18/07/16.
 */


var $iframe;
var x, y,
    clicks = [],
    numberClicks = 0,
    keysPressed = 0;
// if false, the click won't be register
fromLocal = false;
recording = false;

// reset local storage
localStorage.setItem("clicks", JSON.stringify(clicks));


// document.onmousemove = handleMouseMove;

// document.onclick = handleMouseClick;

function handleMouseClick(event) {

    // add the absolut position of the iframe of the parent window
    var page = realPositionPointer(event.pageX, event.pageY)
    event.pageX = page.x;
    event.pageY = page.y;


    var highlight;
    // Add a dot to follow the cursor
    highlight = document.createElement('div');
    highlight.className = "highlight";
    highlight.style.left = event.pageX + "px";
    highlight.style.top = event.pageY + "px";
    document.body.appendChild(highlight);

}

function handleMouseMove(event, recording) {
    var dot, eventDoc, doc, body, page;

    event = event || window.event; // IE-ism


    // add the absolut position of the iframe of the parent window
    $('#x').html(event.pageX);
    $('#y').html(event.pageY);

    // page = realPositionPointer(event.pageX, event.pageY)
    // event.pageX = page.x;
    // event.pageY = page.y;

    // $('#gx').html(event.pageX);
    // $('#gy').html(event.pageY);

    if (recording) {

        // If pageX/Y aren't available and clientX/Y
        // are, calculate pageX/Y - logic taken from jQuery
        // Calculate pageX/Y if missing and clientX/Y available
        if (event.pageX == null && event.clientX != null) {
            eventDoc = (event.target && event.target.ownerDocument) || document;
            doc = eventDoc.documentElement;
            body = eventDoc.body;

            event.pageX = event.clientX +
                (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
                (doc && doc.clientLeft || body && body.clientLeft || 0);
            event.pageY = event.clientY +
                (doc && doc.scrollTop || body && body.scrollTop || 0) -
                (doc && doc.clientTop || body && body.clientTop || 0 );
        }

        // Add a dot to follow the cursor
        dot = y.createElement('div');
        dot.className = "dot";
        dot.style.left = event.pageX + "px";
        dot.style.top = event.pageY + "px";
        document.body.appendChild(dot);
    }
}

function reset() {
    numberClicks = 0;
    keysPressed = 0;
    $('#clicks').html(numberClicks);
    $('#keyspressed').html(keysPressed);
    // reset local storage
    clicks = [];
    localStorage.setItem("clicks", JSON.stringify(clicks));
}

function realPositionPointer(x, y) {
    return {
        x: x + $iframe.position().left,
        y: y + $iframe.position().top
    }
}

function restPositionPointer(x, y) {
    return {
        x: x - $iframe.position().left,
        y: y - $iframe.position().top
    }
}




/**
 * Document ready
 */
$(document).ready(function () {
    console.log("ready!");


    $iframe = $('#iframe');
    /***
     In addition to waiting for the parent document to load
     we must wait for the document inside the iframe to load as well.
     ***/
    $iframe.load(function () {

        console.log($iframe.position().left +" "+$iframe.position().top);
        //alert( $iframe.position().top);


        // be able to call into the iframe
        // y = iframe.document
        x = document.getElementById("iframe");
        y = (x.contentWindow || x.contentDocument);
        if (y.document)y = y.document;



        /**
         * MOUSE ON MOVE
         */
        $iframe.contents().find('html').on('mousemove', function (e) {
            handleMouseMove(e, recording)
        })


        /**
         * ON CLICKS
         */
        $iframe.contents().find('html').on('click', function (e) {
            if (recording) {
                handleMouseClick(e);
                numberClicks++;
                $('#clicks').html(numberClicks);


                var page = restPositionPointer(e.pageX, e.pageY)

                console.info("pageeeeeee ", page);

                !fromLocal && clicks.push({
                    x: page.x,
                    y:page.y,
                    timeStamp: e.timeStamp
                });
                // store in local storage
                localStorage.setItem("clicks", JSON.stringify(clicks));
            }
        });

        /**
         * On KEY PRESS
         */
        $iframe.contents().find('html').on('keypress', function (e) {
            keysPressed++;
            $('#keyspressed').html(keysPressed);
        });


        /**
         * BUTTONS RECORD-STOP
         */
        $('#start').click(function () {
            reset();
            recording = true;
            $('#start').attr('disabled', true);
            $('#stop').attr('disabled', false);
        });

        $('#stop').click(function () {
            recording = false;
            $('#start').attr('disabled', false);
            $('#stop').attr('disabled', true);
        });

        $('#reset').click(function () {
            reset();
        })

        /**
         * Load the website of the imput
         */
        $("#load").click(function () {
            $("#iframe").attr("src", $('#websrc').val());
        });


        /**
         * Button simulate clicks
         */
        $('#simulate').click(function () {
            fromLocal = true;

            // read from localstorage
            var storedClicks = JSON.parse(localStorage.getItem("clicks"));


            //y.elementFromPoint(35, 260).click();


            /**
             * Execute the time every 1 second
             */
            storedClicks.forEach(function (k, i) {
                (function(i){
                    setTimeout(function(){
                        y.elementFromPoint(k.x, k.y).click();
                    }, 2000 * i);
                }(i));
            })

            // Close flag from local storage
            fromLocal = false;

        })

        // Show clicks
        // $("#iframe").contents().click(function (event) {
        //     console.log(event);
        // });
    });

});

