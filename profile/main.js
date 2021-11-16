const car_images = document.querySelector('.carousel_container');
const car_buttons = document.querySelectorAll('.nxt_pre_buttons');
const num_of_images = document.querySelectorAll('.carousel_container img').length;
let imageindex = 1;
let traslateX = 0;


car_buttons.forEach(button => {
    button.addEventListener('click',event => {
        if(event.target.id ==='previous'){
             imageindex--;
             traslateX +=300

        }
        else{

            imageindex++;
            traslateX-=300
        }

        car_images.style.transform = translateX({traslateX});

    });


});