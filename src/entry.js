import "./style.scss"


// console.log("entry.js");

// import test from "./test/test"
// test();

$(main);

function main() {
  $('.carousel').carousel({
    interval: false,
    wrap: false
    })
  $('.carousel').carousel('pause');
}