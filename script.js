'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const btnScrollTo = document.querySelector('.btn--scroll-to');

const section1 = document.querySelector('#section--1');

const tabs = document.querySelectorAll('.operations__tab');

const tabsContainer = document.querySelector('.operations__tab-container');

const tabsContent =  document.querySelectorAll('.operations__content');

const nav = document.querySelector('.nav');


const openModal = function (e) {
  e.preventDefault();

  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));



btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//page navigation

//event delagation
//1 add evemt listenrer to common parent
//2. determone what element orignioted the evenr

document.querySelector('.nav__links').addEventListener('click', function(e){
 
  e.preventDefault();

  // Matvhing strategy
  if(e.target.classList.contains('nav__link')){
    
    e.preventDefault();
        const id = e.target.getAttribute('href');
  
        document.querySelector(id).scrollIntoView({behavior: 'smooth'  });
  }
})

// tabbed component


// event delegation
tabsContainer.addEventListener('click', function(e){
  const clicked = e.target.closest('.operations__tab');
  // console.log(clicked);
  // guard clause
  if(!clicked) return;

  // remove active class
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));


  // activate Tab
  clicked.classList.add('operations__tab--active')

  // ACTIVATE CONTENT AREA

  // console.log(clicked.dataset.tab);

  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active'); 
});

//Menu fade animation
const handleHover = function(e){
  if(e.target.classList.contains('nav__link') ){
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el =>{
      if(el !== link) el.style.opacity = this;
    
    })
    logo.style.opacity = this;
  }

}
// Passing "argument into handler"
nav.addEventListener('mouseover', handleHover.bind(0.5) );

nav.addEventListener('mouseout', handleHover.bind(1));

// Sticky navigation
// const initialCoords = section1.getBoundingClientRect()

// window.addEventListener('scroll', function(e){
//   // console.log(window.scrollY);

//   if(window.scrollY >initialCoords.top) nav.classList.add('sticky') 
//   else nav.classList.remove('sticky')
// })
  
// intersection observer API
// const obsCallback = function(entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   })

// };
// const obsOptions = {
//   root: null,
//   threshold: [0, 1, 0.2],
// }
// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);

const  header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const slider = function(){
const stickyNav = function(entries){
  const [entry ] = entries;
  if(!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
}

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`
});
headerObserver.observe(header);


// reveal elements on scroll
const allSections = document.querySelectorAll('.section')
const revealSection = function(entries, observer){
  const [entry] = entries;
  if(!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden')
  observer.unobserve(entry.target)

}
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
  rootMargin: '200px'
})
allSections.forEach(function(section
  ){
    sectionObserver.observe(section)
    // section.classList.add('section--hidden')
  })

//lazy load image

const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function(entries, observer) {
  const [entry] = entries;

  if(!entry.isIntersecting) return;

  //replace src with data-src
entry.target.src = entry.target.dataset.src;


entry.target.addEventListener('load', function(){
  entry.target.classList.remove('lazy-img')
});

observer.unobserve(entry.target);
};
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
});

imgTargets.forEach(img => imgObserver.observe(img));


// building a slider component

const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right')

const dotContainer = document.querySelector('.dots')

let curSlide = 0;
const maxSlide = slides.length;


// function
const createDots = function(){
  slides.forEach(function(_,i){
    dotContainer.insertAdjacentHTML('beforeend',`<button class ="dots__dot" data-slide= "${i}"></button>`)
  })
}

const activateDot = function(slide){
  document.querySelectorAll('.dots__dot').forEach(dot => dot.classList.remove('dots__dot--active'))

document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active')
}

const goToSlide = function(slide){
  
  slides.forEach((s,i) => (s.style.transform = `translateX(${100 * (i-slide)}%)`));
}


//next slide
const nextSlide = function(){
  if(curSlide === maxSlide-1){
    curSlide =0;
  }else {
    curSlide++;
  }
  goToSlide(curSlide)
  activateDot(curSlide)
};

const prevSlide = function(){
  if(curSlide===0){
    curSlide= maxSlide - 1;
  } else{

    curSlide--;

  }
  
  goToSlide(curSlide)
  activateDot(curSlide)
}

const init = function(){
  goToSlide(0)
  createDots();
  activateDot(0)
}
init()

// event handlers
btnRight.addEventListener('click', nextSlide )
btnLeft.addEventListener('click', prevSlide)


document.addEventListener('keydown', function(e){

  if(e.key=== 'ArrowRight') nextSlide();
  else if (e.key==='ArrowLeft') prevSlide();
})

// event delegation
dotContainer.addEventListener('click', function(e){
  if(e.target.classList.contains('dots__dot')){
    const slide = e.target.dataset.slide;
    goToSlide(slide)
    activateDot(slide)
  }
})
}
slider();

document.addEventListener('DOMContentLoaded', function(e){

});

window.addEventListener('load', function(e){

})

// window.addEventListener('beforeunload', function(e){
//   e.preventDefault();
//   e.returnValue = ' ';
// })
//lectures
// const h1 = document.querySelector('h1');

// going downwards
// console.log(h1.querySelectorAll('.highlight'));
// h1.firstElementChild.style.color = 'white';
// h1.lastElementChild.style.color = 'orangered';

// // going upwards

// h1.closest('.header').style.background = 'var(--gradient-secondary)';

// h1.closest('h1').style.background = 'var(--gradient-primary)'

// sideways; siblings

// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);

// console.log(h1.previousSibling);
// console.log(h1.nextSibling);

// console.log(h1.parentElement.children);
// [...h1.parentElement.children].forEach(function(el){
//   if(el !== h1) el.style.transform = 'scale(0.9)';
// })




// document.querySelectorAll('.nav__link').forEach(function(el){
//   el.addEventListener('click', function(e){
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({behavior:'smooth' })
//   })
// })



// smooth scrolling



btnScrollTo.addEventListener('click', function(e){
  const s1coords = section1.getBoundingClientRect();
  // console.log(s1coords);


  // console.log(e.target.getBoundingClientRect());

  // console.log('current scroll (X/Y', window.pageXOffset, window.pageYOffset);

  //scrolling

  // window.scrollTo(s1coords.left + window.pageXOffset, s1coords.top + window.pageYOffset);

  // window.scrollTo({
  //  left: s1coords.left + window.pageXOffset, top: s1coords.top + window.pageYOffset,
  //  behavior: 'smooth'
  // });

  section1.scrollIntoView({behavior: 'smooth'})

})

//events

// const h1 = document.querySelector('h1');

// const alertH1 = function(e){
//   alert('addeventListener: Great you are reaind the heading');

  
// }

// h1.addEventListener('mouseenter',alertH1 );
// setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000)


// rgb(255,255,255)

// const randomInt = (min, max) => Math.floor(Math.random() * (max- min +1) + min);

// const randomColor = () => `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;

// document.querySelector('.nav__link').addEventListener('click', function(e){
//  this.style.backgroundColor = randomColor()

//  e.stopPropagation()
// })



// document.querySelector('.nav__links').addEventListener('click', function(e){
//   this.style.backgroundColor = randomColor()

// })


// document.querySelector('.nav').addEventListener('click', function(e){

//   this.style.backgroundColor = randomColor();
//   // console.log('NAV', e.target);

// });
// h1.onmouseenter = function(e){
//   alert('onmouseenter: Great! you are reading the heading :) ')
// };



// selecting
// console.log(document.documentElement);
// console.log(document.head);

// const header = document.querySelector('.header');

// const allSections = document.querySelectorAll('.section');

// console.log(allSections);

// document.getElementById('seciom--1');
// const allButtons = document.getElementsByTagName('button')
// console.log(allButtons);

// document.getElementsByClassName('btn')

// creating and inserting elements
//.insertAdjacentHTML

// const message = document.createElement('div');
// message.classList.add('cookie-message');
// // message.textContent = 'we usde cookied for improved functionality and analytics.'
// message.innerHTML = 'we use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">close</button>';

// // header.prepend(message);
// header.append(message);

// // header.append(message.cloneNode(true))

// // header.before(message);

// // delete elements
// document.querySelector('.btn--close-cookie').addEventListener('click', function(){
//   // message.remove();
//   message.parentElement.removeChild(message);
// });

// // styles
// message.style.backgroundColor = '#37383d';
// message.style.width = '120%'

// console.log(message.style.backgroundColor);

// console.log(getComputedStyle(message).color);

// console.log(getComputedStyle(message).height)

// message.style.height = Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

// document.documentElement.style.setProperty('--color-primary', 'orangered')


//attrinutes
// const logo = document.querySelector('.nav__logo');
// logo.alt = 'Beautiful minimalist logo'
// console.log(logo.src);
// console.log(logo.alt);
// logo.setAttribute('company', 'Bankist');
// console.log(logo.getAttribute('src'));

// const link = document.querySelector('.nav__link--btn');
// console.log(link.href);
// console.log(link.getAttribute('href'));

// //data attributes

// // classess
// logo.classList.add('c')
// logo.classList.remove('c')
// logo.classList.toggle('c')
// logo.classList.contains('c')

