//js for {{name}}
console.log('hey there from {{name}} ');
//for documentation, we'll use markdown
var marked = require('marked');
var dom = require('domquery');


window.addEventListener('load', function(){


  //render all markdown in the html using marked library
  dom('.marked').forEach(function( el, i ){
  el.outerHTML = '<p class="marked">' + marked(el.textContent) + '</p>';
  });

}); //on load
