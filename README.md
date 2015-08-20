## Website Performance Optimization portfolio project

To run the application load build/index.html

####Part 1: Optimized PageSpeed Insights score for index.html
1) Added media query (media="print") to print stylesheet link

2) Minified CSS and JS
   Used gulp-uncss to remove unneeded CSS and minified it
   Moved Google Analytics script to file, concatentated with perfmatter.js and minified into main.js
   Added "async" tag to main.js

3) Compressed profile picture
   Used gulp-imagemin

4) Resized and compressed pizzeria image
   Used gulp-image-resize to create 100px wide image
   
5) Inlined CSS
   Used gulp-inline-css 

####Part 2: Optimized Frames per Second in pizza.html
1) Added "will-change: tranform" to .movers to makes the pizzas separate layers to reduce

2) Reduced number of moving pizzas to minimum needed to fill the frame
   Use window height and width to calculate the number of rows and columns needed

3) Fixed function to move sliding background pizzas more efficiently
   Moved scrollTop calculation out of loop to avoid forced synchronous layout
   Moved the "phase" calculation outside of the loop and store the five possible phases in an array
   Used "transform: translateX()" instead of "left" to avoid triggering layout and paint
   Replaced document.querySelectorAll() with more efficient document.getElementsByClassName()
   Moved document.getElementsByClassName() out of function so it is not calculated with each scroll

4) Adjusted "reSizePizzas" function to avoid forced synchronous layout
   Simplified calculation to sets new pizza width as % of "randomPizzas" div
   Replaced document.querySelectorAll() with more efficient document.getElementsByClassName()
   Moved document.getElementsByClassName() out of function so it is not calculated with each move

5) Compressed and reduced size of images to reduce load time.
   Reduced width of pizzeria.jpg to 1440px
   Created mover-pizza.png to make smaller image for moving pizza and changed mover pizza with in main.js to match
   Used gulp imagemin for pizza.png and mover-pizza.png and imagemin-jpeg-recompress for pizzeria.jpg

6) Adjusted CSS to reduce load time
   Removed size from .mover -- set in main.js
   Concatenated style.css and bootstrap and then removed unneeded css with gulp-uncss