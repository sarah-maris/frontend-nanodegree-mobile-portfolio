## Website Performance Optimization portfolio project


####Part 1: Optimized PageSpeed Insights score for index.html



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
   
5) Compressed images and reduced size of pizzeria.jpg to reduce load time.
   Reduced width of pizzeria.jpg to 1440px 
   Used gulp imagemin for pizza.png and imagemin-jpeg-recompress for pizzeria.jpg 
   
   