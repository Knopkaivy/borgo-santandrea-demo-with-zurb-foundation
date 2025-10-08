gsap.registerPlugin(ScrollTrigger)

// Initialize a new Lenis instance for smooth scrolling
const lenis = new Lenis();

// Synchronize Lenis scrolling with GSAP's ScrollTrigger plugin
lenis.on('scroll', ScrollTrigger.update);

// Add Lenis's requestAnimationFrame (raf) method to GSAP's ticker
// This ensures Lenis's smooth scroll animation updates on each GSAP tick
gsap.ticker.add((time) => {
  lenis.raf(time * 1000); // Convert time from seconds to milliseconds
});

// Disable lag smoothing in GSAP to prevent any delay in scroll animations
gsap.ticker.lagSmoothing(0);

document.addEventListener("DOMContentLoaded", function(arg) {

    const variables = {
        dataSelectors: {
            beachLink: '[data-beach-link]',
            carouselLinkName: '[data-carousel-link-name]',
            languagesDropdown: '[data-languages-dropdown]',
            languagesAlternative: '[data-languages-alternative]',
            languagesChevron: '[data-languages-chevron]',
            menu: '[data-menu]',
            menuCloseBtn: '[data-menu-close]',
            menuOpenBtn: '[data-menu-open]',
            menuItem: '[data-menu-item]',
            menuBgOverlay: '[data-bg-overlay]',
            menuImage: '[data-menu-image]',
            menuSublist: '[data-menu-sublist]',
            navbar: '[data-navbar]',
            volume: '[data-volume]',
            volumeMute: '[data-volume-mute]',
            volumeMedium: '[data-volume-medium]',
        },
        classes:{
            navBarLightBG: 'navbar--light-bg',
            navBarHide: 'navbar--hide',
            navBarShow: 'navbar--show',
            languageAlternativeHide: 'navbar__languages-alternative--hide',
            languageAlternativeShow: 'navbar__languages-alternative--show',
            chevronUp: 'icon__chevron--up',
            chevronDown: 'icon__chevron--down',
            hidden: 'hidden',
            menuActive: 'is-menu-active',
            menuClosed: 'is-menu-closed',
            menuImageShowImage: 'menu__bg-image--show-image',
        },
        idSelectors: {
            navBar: '#section-navbar',
            menuImageId: '#menu-back-img-',
            menuSublistId: '#menu-list-',
            audio: '#audio',
            video: '#page_top_video'
        }
    };
    const NAVBAR_HEIGHT = 108;
    const NAVBAR_STICKY_HEIGHT = 288;
    const LINK_TRANSLATE_FRACTION = .5;

    const navBar = document.querySelector(variables.idSelectors.navBar);
    const languagesDropdown = document.querySelector(variables.dataSelectors.languagesDropdown);
    const languagesAlternative = document.querySelector(variables.dataSelectors.languagesAlternative);
    const languagesChevron = document.querySelector(variables.dataSelectors.languagesChevron);
    const volumeButtons = document.querySelectorAll(variables.dataSelectors.volume);
    const menuOpenBtn = document.querySelector(variables.dataSelectors.menuOpenBtn);
    const menuCloseBtn = document.querySelector(variables.dataSelectors.menuCloseBtn);
    const menuItems = document.querySelectorAll(variables.dataSelectors.menuItem);
    const menuImages = document.querySelectorAll(variables.dataSelectors.menuImage);
    const menuSublists = document.querySelectorAll(variables.dataSelectors.menuSublist);
    const menuBgOverlay = document.querySelector(variables.dataSelectors.menuBgOverlay);
    const navbar = document.querySelector(variables.dataSelectors.navbar);
    const audio = document.querySelector(variables.idSelectors.audio);
    const video = document.querySelector(variables.idSelectors.video);


    let oldScroll = 0;

    languagesDropdown.addEventListener('click', ()=>{
        languagesAlternative.classList.toggle(variables.classes.languageAlternativeHide);
        languagesAlternative.classList.toggle(variables.classes.languageAlternativeShow);

        languagesChevron.classList.toggle(variables.classes.chevronDown);
        languagesChevron.classList.toggle(variables.classes.chevronUp);
    });

    volumeButtons.forEach(volumeBtn =>{
        volumeBtn.addEventListener('click', () =>{
            volumeBtn.querySelector(variables.dataSelectors.volumeMute).classList.toggle(variables.classes.hidden);
            volumeBtn.querySelector(variables.dataSelectors.volumeMedium).classList.toggle(variables.classes.hidden);
            if(audio.paused){
                audio.play();
            } else {
                audio.pause();
            }
        });
    })

    window.addEventListener(
        'scroll',
        (event) => {
            navbarOnScrollUpdate(event);
        }, 
        { passive: true }
    );

    const setNavbarStyles = () =>{
        if(window.scrollY <= NAVBAR_HEIGHT) {
            navBar.classList.remove(variables.classes.navBarLightBG);
        } else if(window.scrollY > NAVBAR_HEIGHT){
            navBar.classList.add(variables.classes.navBarLightBG);
        }
    }

    const navbarOnScrollUpdate = (event) =>{
        setNavbarStyles();

        if(oldScroll > window.scrollY){
            navBar.classList.remove(variables.classes.navBarHide);
            navBar.classList.add(variables.classes.navBarShow);
        } else{
            navBar.classList.remove(variables.classes.navBarShow);
            navBar.classList.add(variables.classes.navBarHide);
        }
        oldScroll = window.scrollY;
    }

    const toggleMenu = () =>{
        document.body.classList.toggle(variables.classes.menuActive);
        document.querySelector(variables.dataSelectors.menu).classList.toggle(variables.classes.menuActive);
        navbar.classList.toggle(variables.classes.menuActive);
        if(navbar.classList.contains(variables.classes.menuActive)){
            navbar.classList.remove(variables.classes.menuClosed);
        } else{
            navbar.classList.add(variables.classes.menuClosed);
        }
    }

    const showItemImage = (event) =>{
        menuBgOverlay.style.opacity = .8;
        const itemId = event.target.id.slice(-1);
        document.querySelector(`${variables.idSelectors.menuImageId}${itemId}`).classList.add(variables.classes.menuImageShowImage);
    }

    const hideItemImage = (event) =>{
        menuBgOverlay.style.opacity = 1;
        menuImages.forEach(image =>{
            image.classList.remove(variables.classes.menuImageShowImage);
        });
    }

    const toggleItemSublist = (event) =>{
        const itemId = event.target.id.slice(-1);
        menuSublists.forEach(sublist =>{
            const sublistId = sublist.id.slice(-1);
            if(sublistId === itemId && (sublist.style.height === '0px' || sublist.style.height === '')){
                sublist.style.height = `${sublist.childElementCount * 31}px`;
            } else{
                sublist.style.height = '0px';
            }
        })
    }

    menuOpenBtn.addEventListener('click', toggleMenu);

    menuItems.forEach(item =>{
        item.addEventListener('mouseover', event => {
            showItemImage(event);
        });
    });

    menuItems.forEach(item =>{
        item.addEventListener('mouseout', event => {
            hideItemImage(event);
        });
    });

    menuItems.forEach(item =>{
        item.addEventListener('click', event => {
            toggleItemSublist(event);
        });
    });


    /* BEACH */
    const swiper = new Swiper('.swiper', {
        speed: 1000,
        slidesPerGroup: 1,
        slidesPerView: 2.11,
        centeredSlides: true,
        initialSlide: 1,
        grabCursor: true,
        effect: "creative",
        breakpoints: {
        320: {
        slidesPerView: 1.3,
        creativeEffect: {
        prev: {
        shadow: false,
        translate: ["-140%", 0, -700],
        },
        next: {
        shadow: false,
        translate: ["146%", 0, -700],
        },
        },
        },
        1280: {
        slidesPerView: 2.11,
        creativeEffect: {
        prev: {
        shadow: false,
        translate: ["-140%", 0, -500],
        },
        next: {
        shadow: false,
        translate: ["146%", 0, -500],
        },
        },
        }
        },
        navigation: {
        nextEl: '.carousel-button-next',
        prevEl: '.carousel-button-prev',
        }
    });

    swiper.slideTo(1, false,false);

    const carouselLinkNameUpdateOnSlideChange = () =>{
        setTimeout(()=>{
            let name;
        
            switch (swiper.activeIndex){
                case 0:
                    name = 'DOCKING AT THE BORGO';
                    break;
                case 1:
                    name = 'MARINELLA PRIVATE BEACH';
                    break;
                case 2:
                    name = 'BEACH CLUB PIZZERIA & GRILL';
                    break;
                default:
                    break;
            }
        
            document.querySelector(variables.dataSelectors.carouselLinkName).textContent = name;
        },500)
    }

    const setLinkTransition = (dirA, dirB) =>{
        const link = document.querySelector(variables.dataSelectors.beachLink);
        
    const linkTransition = link.animate([{ transform: `translateX(0)`, opacity: 1 }, { transform: `translateX(${dirA}rem)`, opacity: .5 },{ transform: `translateX(0)`, opacity: 0 }, { transform: `translateX(${dirB/2}rem)`, opacity: .5 }, { transform: `translateX(0)`, opacity: 1 },],     {
            fill: "forwards",
            easing: "ease-in-out",
            duration: 1000,
            iterations: 1
        },);
        linkTransition.play();
    }

    swiper.on('slideChange', carouselLinkNameUpdateOnSlideChange);
    swiper.on('slideNextTransitionStart', function(){
        setLinkTransition(-4, 4);
    });

    swiper.on('slidePrevTransitionStart', function(){
        setLinkTransition(4, -4);
    });


/* ScrollTrigger */

/* HERO */

    ScrollTrigger.create({
        trigger: video,
        start: "top center",
        end: "bottom top",
        onEnter: () => video.play(),
        onLeave: () => video.pause(),
        onEnterBack: () => video.play(),
        onLeaveBack: () => video.pause()
    });

    gsap.from(".hero__header--one", {
        scrollTrigger: {
            trigger: "#section-hero",
            toggleAction: "none none none none",
        },
        duration: .5,
        yPercent: -10,
        opacity: 0,
        delay: 1
    });

    gsap.from(".hero__header--two", {
        scrollTrigger: {
            trigger: "#section-hero",
            toggleAction: "none none none none",
        },
        duration: .5,
        yPercent: -15,
        opacity: 0,
        delay: .5
    });

    gsap.to(".hero__header--one", {
        scrollTrigger: {
            trigger: ".hero__header--one",
            start: "top 35%",
            end: "top 0%",
            scrub: true,
            toggleAction: "restart pause reverse pause",
        },
        duration: 0.5,
        yPercent: -5,
        stagger: 0.5,
        delay: .9
    });

    gsap.to(".hero__header--two", {
        scrollTrigger: {
            trigger: ".hero__header--two",
            start: "top 35%",
            end: "top 0%",
            scrub: true,
            toggleAction: "restart pause reverse pause"
        },
        duration: 0.8,
        yPercent: -20,
        stagger: 0.5,
        delay: .9
    });

    gsap.to(".haven__content-image-container", {
        scrollTrigger: {
            trigger: ".haven__content-image-container",
            start: "top 50%",
            end: "top 0%",
            scrub: true,
            toggleAction: "restart pause reverse pause",
        },
        duration: 0.8,
        yPercent: -15,
        stagger: 0.5,
        delay: .9
    });

/* HAVEN */

        gsap.from(".haven__content-header--one", {
        scrollTrigger: {
            trigger: "#section-haven",
            start: "top 50%",
            toggleAction: "none none none none",
        },
        duration: .5,
        yPercent: -10,
        opacity: 0,
        skewY: "6deg",
        delay: 0
    });

        gsap.from(".haven__content-header--two", {
        scrollTrigger: {
            trigger: "#section-haven",
            start: "top 50%",
            toggleAction: "none none none none",
        },
        duration: .5,
        yPercent: -10,
        opacity: 0,
        skewY: "6deg",
        delay: .25
    });

        gsap.from(".haven__content-header--three", {
        scrollTrigger: {
            trigger: "#section-haven",
            start: "top 50%",
            toggleAction: "none none none none",
        },
        duration: .5,
        yPercent: -10,
        opacity: 0,
        skewY: "6deg",
        delay: .5
    });

        gsap.from(".haven__content-decoration-line", {
        scrollTrigger: {
            trigger: "#section-haven",
            start: "top 25%",
            toggleAction: "none none none none",
        },
        duration: .5,
        yPercent: 20,
        opacity: 0,
        delay: 0
    });

        gsap.from(".haven__content-text--one", {
        scrollTrigger: {
            trigger: "#section-haven",
            start: "top 25%",
            toggleAction: "none none none none",
        },
        duration: .5,
        yPercent: 20,
        opacity: 0,
        delay: 0
    });

        gsap.from(".haven__content-text--two", {
        scrollTrigger: {
            trigger: "#section-haven",
            start: "top 25%",
            toggleAction: "none none none none",
        },
        duration: .5,
        yPercent: 20,
        opacity: 0,
        delay: .5
    });

    gsap.to(".haven__image-main", {
        scrollTrigger: {
            trigger: ".haven__image-main-container",
            start: "top 80%",
            end: "bottom 0%",
            scrub: true,
            toggleAction: "restart pause reverse pause",
        },
        duration: 0.8,
        scaleX: 1,
        scaleY: 1,
        stagger: 0.5,
        delay: .9
    });
    
/* STORY */

    gsap.from(".story__headline", {
    scrollTrigger: {
        trigger: "#section-story",
        start: "top 50%",
        toggleAction: "none none none none",
    },
    duration: .5,
    yPercent: 200,
    opacity: 0,
    delay: 0
    });

    gsap.from(".story__image-container--secondary", {
    scrollTrigger: {
        trigger: "#section-story",
        start: "top 50%",
        toggleAction: "none none none none",
    },
    duration: .5,
    yPercent: 20,
    opacity: 0,
    delay: 0
    });

    gsap.from(".story__description", {
    scrollTrigger: {
        trigger: "#section-story",
        start: "top 15%",
        toggleAction: "none none none none",
    },
    duration: .5,
    yPercent: 20,
    opacity: 0,
    delay: 0
    });

    gsap.from(".story__main-content", {
    scrollTrigger: {
        trigger: "#section-story",
        start: "top -20%",
        toggleAction: "none none none none",
    },
    duration: .5,
    yPercent: 5,
    opacity: 0,
    delay: 0
    });

    gsap.from(".story__link-name", {
    scrollTrigger: {
        trigger: "#section-story",
        start: "top -20%",
        toggleAction: "none none none none",
    },
    duration: .5,
    yPercent: 20,
    opacity: 0,
    delay: .5
    });

/* GARDENS HOME */

    var tl_gardens_home = gsap.timeline({
        paused: true
    })

    tl_gardens_home
        .from(".gardens__content-text", {
            duration: 0.5,
            autoAlpha: 0,
            yPercent: 35
        })
        .from(
            ".gardens__content-decoration-line",
            { duration: 0.5, autoAlpha: 0, scaleX: 0 },
            "<"
        )

    ScrollTrigger.create({
        trigger: "#section-gardens",
        pin: true,
        animation: tl_gardens_home,
        start: "top top",
        end: "bottom+=25%",
        scrub: true
    });

/* SUITES */
    
    gsap.from(".suites__headline", {
    scrollTrigger: {
        trigger: "#section-suites",
        start: "top 50%",
        toggleAction: "none none none none",
    },
    duration: .5,
    yPercent: 200,
    opacity: 0,
    });
    
    gsap.from(".suites__content-text--one", {
    scrollTrigger: {
        trigger: "#section-suites",
        start: "top -20%",
        toggleAction: "none none none none",
    },
    duration: .5,
    yPercent: 20,
    opacity: 0,
    });
    
    gsap.from(".suites__content-text--two", {
    scrollTrigger: {
        trigger: "#section-suites",
        start: "top -20%",
        toggleAction: "none none none none",
    },
    duration: .5,
    yPercent: 20,
    opacity: 0,
    delay: .25
    });
    
    gsap.from(".suites__content-link", {
    scrollTrigger: {
        trigger: "#section-suites",
        start: "top -50%",
        toggleAction: "none none none none",
    },
    duration: .5,
    yPercent: 20,
    opacity: 0,
    delay: .5
    });

    gsap.to(".suites__content-image-container", {
        scrollTrigger: {
            trigger: ".suites__content-image-container",
            start: "top 50%",
            end: "top 0%",
            scrub: true,
            toggleAction: "restart pause reverse pause",
        },
        duration: 0.8,
        yPercent: -15,
        stagger: 0.5,
        delay: .9
    });


    gsap.to(".suites__image--main", {
        scrollTrigger: {
            trigger: ".suites__image-container--main",
            start: "top 80%",
            end: "bottom 0%",
            scrub: true,
            toggleAction: "restart pause reverse pause"
        },
        duration: 0.8,
        scaleX: 1,
        scaleY: 1,
        stagger: 0.5,
        delay: .9
    });

    gsap.to(".suites__content-container", {
        scrollTrigger: {
            trigger: ".suites__content-container",
            start: "top 80%",
            end: "bottom 0%",
            scrub: true,
            toggleAction: "restart pause reverse pause"
        },
        duration: 0.8,
        yPercent: -30,
        stagger: 0.5,
        delay: .9
    });

/* JUNIOR SUITE */

    gsap.from(".jr-suite__description", {
    scrollTrigger: {
        trigger: "#section-jr-suite",
        start: "top 50%",
        toggleAction: "none none none none",
    },
    duration: .5,
    yPercent: 20,
    opacity: 0,
    });

    gsap.from(".jr-suite__main-header--one", {
        scrollTrigger: {
            trigger: "#section-jr-suite",
            start: "top 50%",
            toggleAction: "none none none none",
        },
        duration: .5,
        yPercent: -10,
        opacity: 0,
        skewY: "6deg",
        delay: 0
    });

    gsap.from(".jr-suite__main-header--two", {
        scrollTrigger: {
            trigger: "#section-jr-suite",
            start: "top 50%",
            toggleAction: "none none none none",
        },
        duration: .5,
        yPercent: -10,
        opacity: 0,
        skewY: "6deg",
        delay: .25
    });

    gsap.from(".jr-suite__main-header--three", {
        scrollTrigger: {
            trigger: "#section-jr-suite",
            start: "top 50%",
            toggleAction: "none none none none",
        },
        duration: .5,
        yPercent: -10,
        opacity: 0,
        skewY: "6deg",
        delay: .25
    });

    gsap.from(".jr-suite__main-content-link", {
        scrollTrigger: {
            trigger: ".jr-suite__image-container--main",
            start: "top 0%",
            toggleAction: "none none none none",
        },
        duration: .5,
        yPercent: 20,
        opacity: 0,
    });

    gsap.to(".jr-suite__image--main", {
        scrollTrigger: {
            trigger: ".jr-suite__image-container--main",
            start: "top 100%",
            end: "bottom 0%",
            scrub: true,
            toggleAction: "restart pause reverse pause"
        },
        duration: 0.8,
        scaleX: 1,
        scaleY: 1,
        stagger: 0.5,
        delay: .9
    });


/* RESTAURANT */

    var tl_ristorante_home = gsap.timeline({
        paused: true
    })

    gsap.from(".restaurant__header", {
        duration: 1,
        autoAlpha: 0,
        y: 150,
        scrollTrigger: {
            trigger: "#section-restaurant",
            start: "top 50%",
            scrub: 0
        }
    })

    tl_ristorante_home
    .to(
        ".restaurant__header",
        { duration: 3, yPercent: -500 },
        "+=0.5"
    )
    .to(
        ".restaurant__header",
        { duration: 1, autoAlpha: 0 },
        "-=0.5"
    )
    .to(
        ".restaurant__overlay",
        { duration: 2, opacity: 0 },
        "<"
    )
    .from(
        ".restaurant__main",
        { duration: 2, autoAlpha: 0, yPercent: 25 },
        "<50%"
    )
    .from(
        ".restaurant__link-container",
        { duration: 2, autoAlpha: 0, y: 40 },
        "<"
    )
    .to(
        ".restaurant__overlay-image",
        { duration: 2, opacity: 0.6 },
        "<+=1"
    )

    ScrollTrigger.create({
        trigger: "#section-restaurant",
        pin: true,
        animation: tl_ristorante_home,
        start: "top top",
        end: "bottom+=150%",
        scrub: true
    });

/* BEACH */
 
    gsap.from(".beach__headline", {
    scrollTrigger: {
        trigger: "#section-beach",
        start: "top 50%",
        toggleAction: "none none none none",
    },
    duration: .5,
    yPercent: 20,
    opacity: 0,
    delay: 0
    });
    
    gsap.from(".beach__description-header", {
    scrollTrigger: {
        trigger: "#section-beach",
        start: "top 50%",
        toggleAction: "none none none none",
    },
    duration: .5,
    yPercent: 200,
    opacity: 0,
    delay: 0
    });
    
    gsap.from(".beach__description-text", {
    scrollTrigger: {
        trigger: "#section-beach",
        start: "top 50%",
        toggleAction: "none none none none",
    },
    duration: .5,
    yPercent: 200,
    opacity: 0,
    delay: .25
    });
    
    gsap.from(".beach__link", {
    scrollTrigger: {
        trigger: "#section-beach",
        start: "top -20%",
        toggleAction: "none none none none",
    },
    duration: .5,
    yPercent: 50,
    opacity: 0,
    });

/* DIARY */

    gsap.from(".diary__content-header--one", {
        scrollTrigger: {
            trigger: "#section-diary",
            start: "top 50%",
            toggleAction: "none none none none",
        },
        duration: .5,
        yPercent: -10,
        opacity: 0,
        skewY: "6deg",
    });

    gsap.from(".diary__content-header--two", {
        scrollTrigger: {
            trigger: "#section-diary",
            start: "top 50%",
            toggleAction: "none none none none",
        },
        duration: .5,
        yPercent: -10,
        opacity: 0,
        skewY: "6deg",
        delay: .25
    });

    gsap.from(".diary__content-images-bg-line", {
        scrollTrigger: {
            trigger: "#section-diary",
            start: "top 25%",
            toggleAction: "none none none none",
        },
        duration: .5,
        xPercent: -100,
    });

    gsap.from(".diary__content-image-link--one", {
        scrollTrigger: {
            trigger: "#section-diary",
            start: "top 25%",
            toggleAction: "none none none none",
        },
        duration: .5,
        yPercent: 20,
        opacity: 0,
    });

    gsap.from(".diary__content-image-link--two", {
        scrollTrigger: {
            trigger: "#section-diary",
            start: "top 25%",
            toggleAction: "none none none none",
        },
        duration: .5,
        yPercent: 20,
        opacity: 0,
        delay: .2
    });

    gsap.from(".diary__content-image-link--three", {
        scrollTrigger: {
            trigger: "#section-diary",
            start: "top 25%",
            toggleAction: "none none none none",
        },
        duration: .5,
        yPercent: 20,
        opacity: 0,
        delay: .4
    });

    gsap.from(".diary__link", {
        scrollTrigger: {
            trigger: "#section-diary",
            start: "top 25%",
            toggleAction: "none none none none",
        },
        duration: .5,
        yPercent: 20,
        opacity: 0,
        delay: .5
    });

/* SOCIAL */

    gsap.from(".social__headline", {
    scrollTrigger: {
        trigger: "#section-social",
        start: "top 50%",
        toggleAction: "none none none none",
    },
    duration: .5,
    yPercent: 20,
    opacity: 0,
    });
 
    gsap.from(".social__image--a", {
    scrollTrigger: {
        trigger: "#section-social",
        start: "top 50%",
        toggleAction: "none none none none",
    },
    duration: .5,
    yPercent: 35,
    opacity: 0,
    delay: .2
    });
 
    gsap.from(".social__image--b", {
    scrollTrigger: {
        trigger: "#section-social",
        start: "top 50%",
        toggleAction: "none none none none",
    },
    duration: .5,
    yPercent: 35,
    opacity: 0,
    delay: .3
    });
 
    gsap.from(".social__image--c", {
    scrollTrigger: {
        trigger: "#section-social",
        start: "top 50%",
        toggleAction: "none none none none",
    },
    duration: .5,
    yPercent: 35,
    opacity: 0,
    delay: .4
    });
 
    gsap.from(".social__image--d", {
    scrollTrigger: {
        trigger: "#section-social",
        start: "top 50%",
        toggleAction: "none none none none",
    },
    duration: .5,
    yPercent: 35,
    opacity: 0,
    delay: .5
    });
 
    gsap.from(".social__image--e", {
    scrollTrigger: {
        trigger: "#section-social",
        start: "top 50%",
        toggleAction: "none none none none",
    },
    duration: .5,
    yPercent: 35,
    opacity: 0,
    delay: .6
    });
 
    gsap.from(".social__image--f", {
    scrollTrigger: {
        trigger: "#section-social",
        start: "top 50%",
        toggleAction: "none none none none",
    },
    duration: .5,
    yPercent: 35,
    opacity: 0,
    delay: .7
    });

    gsap.to(".social__image--main", {
        scrollTrigger: {
            trigger: ".social__image-container--main",
            start: "top 80%",
            end: "bottom 0%",
            scrub: true,
            toggleAction: "restart pause reverse pause"
        },
        duration: 0.8,
        scaleX: 1,
        scaleY: 1,
        stagger: 0.5,
        delay: .9
    });

/* SUBSCRIBE */

    gsap.from(".subscribe__header--one", {
        scrollTrigger: {
            trigger: "#section-subscribe",
            start: "top 50%",
            toggleAction: "none none none none",
        },
        duration: .5,
        yPercent: -10,
        opacity: 0,
        skewY: "6deg",
    });

    gsap.from(".subscribe__header--two", {
        scrollTrigger: {
            trigger: "#section-subscribe",
            start: "top 50%",
            toggleAction: "none none none none",
        },
        duration: .5,
        yPercent: -10,
        opacity: 0,
        skewY: "6deg",
        delay: .25
    });

    gsap.from(".subscribe__form", {
        scrollTrigger: {
            trigger: "#section-subscribe",
            start: "top 50%",
            toggleAction: "none none none none",
        },
        duration: .5,
        yPercent: 10,
        opacity: 0,
        delay: .5
    });

});