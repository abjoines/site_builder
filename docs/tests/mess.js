// console.log("make a mess");



let mess_settings = {
    time_after_scroll: 1000
};
let mess_info = {};
let mess_private = {};



function setup() {
    // collect useful info for sketch to use
    mess_info.mess_millis = 0;
    mess_info.scroll_start_millis = 0;
    mess_info.scroll_millis = 0;
    mess_info.document_height = $(document).height();
    mess_info.document_width = $(document).width();
    mess_info.scroll_y = $(window).scrollTop();
    mess_info.scroll_y_normalized = mess_info.scroll_y / (mess_info.document_height - $(window).height());

    // create the canvas
    mess_private.p5_canvas = createCanvas(windowWidth, windowHeight);
    $(mess_private.p5_canvas.canvas).addClass("mess");
    $(mess_private.p5_canvas.canvas).attr("style", "");

    mess_private.should_draw = false;
    mess_private.mess_start_time = performance.now();
    mess_private.scroll_start_time = performance.now();
    mess_private.scroll_time = undefined;
    mess_private.scroll_timeout = null;

    // let sketch setup
    mess_setup && mess_setup();
}

function draw() {
    clear();

    // if we are not drawing, bail
    if (!mess_private.should_draw) {
        return;
    }

    // update useful info for sketch to use
    let now = performance.now();

    mess_info.mess_millis = now - mess_private.mess_start_time;
    mess_info.scroll_start_millis = now - mess_private.scroll_start_time;
    mess_info.scroll_millis = now - mess_private.scroll_time;

    mess_info.document_height = $(document).height();
    mess_info.document_width = $(document).width();
    mess_info.scroll_y = $(window).scrollTop();
    mess_info.scroll_y_normalized = mess_info.scroll_y / (mess_info.document_height - $(window).height());

    // let sketch draw
    mess_draw && mess_draw();
}

// keep track of user scrolling
$(window).on("scroll", (e) => {
    if (!mess_private.scroll_timeout) {
        start_scroll();
    }

    scroll();

    clearTimeout(mess_private.scroll_timeout);

    mess_private.scroll_timeout = setTimeout(() => {
        mess_private.scroll_timeout = null;
        stop_scroll();
    }, mess_settings.time_after_scroll);
});

$(window).on("resize", (e) => {
    console.log("Resize");
    clearTimeout(mess_private.resize_timeout);
    mess_private.resize_timeout = setTimeout(() => {
        // console.log(windowWidth, $(window).width(), windowWidth - $(window).width());
        console.log(windowWidth);
        resizeCanvas && resizeCanvas(windowWidth, windowHeight);
        $(mess_private.p5_canvas.canvas).attr("style", "");
    }, 100);

});



function start_scroll() {
    // console.log("start_scroll");
    mess_private.scroll_start_time = performance.now();
    mess_private.should_draw = true;
}

function scroll() {
    // console.log("scroll");
    mess_private.scroll_time = performance.now();
}

function stop_scroll() {
    // console.log("stop_scroll");
    mess_private.should_draw = false;
    clear && clear();
}




let particles = [];

function mess_setup() {
    for (i = 0; i < 100; i++) {
        particles.push({
            x: random(mess_info.document_width),
            y: random(mess_info.document_height)
        });
    }
}

function mess_draw() {

    clear();

    // draw fixed window rectangle
    noFill();
    stroke(0, 255, 255);
    rect(10, 10, width - 20, height - 20);
    line(10, 10, width - 10, height - 10);



    // draw info overlay
    noStroke();
    fill(0, 100, 100);
    text(`
mess
====

width: ${ width }
height: ${ height }

window_width: ${ windowWidth }
window_height: ${ windowHeight }
document_width: ${ mess_info.document_width }
document_height: ${ mess_info.document_height }
scroll_y: ${ mess_info.scroll_y }
scroll_y_normalized: ${ mess_info.scroll_y_normalized.toFixed(2) }

mess_millis: ${mess_info.mess_millis.toFixed(0)}
scroll_start_millis: ${mess_info.scroll_start_millis.toFixed(0)}
scroll_millis: ${mess_info.scroll_millis.toFixed(0)}
`, 20, 80);


    // apply scroll transform
    translate(0, -mess_info.scroll_y);


    // draw scrolling document rectangle
    stroke(255, 0, 255);
    noFill();
    rect(5, 5, width - 10, mess_info.document_height - 10);

    // draw particles
    let my_blend = 255 - (mess_info.scroll_millis / 1000 * 255 * 1);




    noStroke();
    fill(255, 0, 0, my_blend);
    particles.forEach((p) => {
        p.x += random(-1, 1) * 1;
        p.y += random(-1, 1) * 1;
        ellipse(p.x, p.y, 30, 30);
    });
}