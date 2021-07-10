const log = console.log
const isMobile = window.matchMedia('(max-width: 768px)').matches

const feedback = document.getElementById('feedback')
const feedbackBtn = document.getElementById('feedbackBtn')
const menu = document.getElementById('menu')
const menuButton = document.getElementById('menuButton')

const advantagesInit = () => {
    const advantagesItems = document.querySelectorAll('#advantages .item')
    Array.from(advantagesItems).forEach(e => {
        const text = e.querySelector('.text')
        const textHeight = text.offsetHeight
        text.style.bottom = `-${textHeight}px`
        e.addEventListener('mouseenter', () => {
            if (!e.classList.contains('active')) {
                e.classList.add('active')
                text.style.bottom = 0
            }
        })
        e.addEventListener('mouseleave', () => {
            e.classList.remove('active')
            text.style.bottom = `-${textHeight}px`
        })
    })
}

const sideTitlesInit = () => {
    const sideTitles = document.querySelectorAll('.sideTitle')
    Array.from(sideTitles).forEach(e => {
        const p = e.querySelector('p')
        const width = p.offsetWidth
        e.style.width = 0
        e.style.top = `${width}px`
    })
}

const classActive = (el, el2) => {
    if (el.classList.contains('active')) {
        el.classList.remove('active')
    } else {
        el.classList.add('active')
    }
    if (el2) {
        if (el2.classList.contains('active')) {
            el2.classList.remove('active')
        } else {
            el2.classList.add('active')
        }
    }
}

const menuInitClose = () => {
    const menuHeight = menu.offsetHeight
    const feedbackHeight = feedback.offsetHeight
    menu.style.top = `-${menuHeight}px`
    feedback.style.top = `-${feedbackHeight}px`
    feedback.classList.remove('active')
    feedbackBtn.classList.remove('active')
}
const menuOpen = m => m.style.top = 0

const emailTest = i =>
    !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(i.value)

const formAddError = i => {
    i.parentElement.classList.add('_error')
    i.classList.add('_error')
}

const formRemoveError = i => {
    i.parentElement.classList.remove('_error')
    i.classList.remove('_error')
}

const formValidate = f => {
    let error = 0
    const req = f.querySelectorAll('._req')
    for (let i = 0; i < req.length; i++) {
        const input = req[i]
        formRemoveError(input)
        if (input.classList.contains('_email')) {
            if (emailTest(input)) {
                formAddError(input)
                error++
            }
        } else if (input.classList.contains('_name')) {
            if (input.value.length < 2) {
                formAddError(input)
                error++
            }
        } else if (input.getAttribute('type') === 'checkbox' &&
            input.checked === false) {
            formAddError(input)
            error++
        }
    }
    return error
}

const formSend = async e => {
    e.preventDefault()
    const form = e.target
    const error = formValidate(form)
    const formData = new FormData(form)

    if (error === 0) {
        form.classList.add('_sending')
        const response = await fetch('../mail.php', {
            method: 'POST',
            body: formData
        })
        if (response.ok) {
            // const result = await response.json()
            log('form sended')

            form.reset()
            form.classList.remove('_sending')
        } else {
            log('sending error')
            form.classList.remove('_sending')
        }
    } else {
        log('validation error')
    }
}

document.addEventListener('scroll', () => {
    const offset = window.scrollY
    const header = document.querySelector('header')
    offset > 100 ?
        header.classList.add('active') :
        header.classList.remove('active')
})

document.addEventListener('DOMContentLoaded', () => {

    const currentYear = document.querySelector('.currentYear')
    currentYear.innerHTML = new Date().getFullYear()

    menuInitClose()
    menuButton.addEventListener('click', () => {
        if (menuButton.classList.contains('active')) {
            menuInitClose() 
            menu.classList.remove('active')
            menuButton.classList.remove('active')
        } else {
            menuOpen(menu)
            menu.classList.add('active')
            menuButton.classList.add('active')
        }
    }) 

    feedbackBtn.addEventListener('click', () => {
        if (!feedback.classList.contains('active')) {
            menu.classList.contains('active') && menu.classList.remove('active')
            menuOpen(feedback)
            menuButton.classList.add('active')
        }
        classActive(feedbackBtn, feedback)
    })

   
    const projectsTitleSlider = new Swiper('.projectsTitleSlider', {
        speed: 500,
        spaceBetween: 20,
        slidesPerView: 1,
        loop: true,
        allowTouchMove: false,
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        }
    })
    const projectsSlides = document.querySelectorAll('.projectsSlider .swiper-slide')
    const projectsSlider = new Swiper('.projectsSlider', {
        speed: 500,
        spaceBetween: 10,
        slidesPerView: 'auto',
        loop: true,
        loopedSlides: projectsSlides.length,
        slideToClickedSlide: true,
        allowTouchMove: false,
        thumbs: {
            swiper: projectsTitleSlider
        },
        navigation: {
            nextEl: '#projects .next',
            prevEl: '#projects .prev'
        }
    })

    const callbackForm = document.getElementById('callbackForm')
    callbackForm.addEventListener('submit', formSend)

})

document.onreadystatechange = () => {
    if (document.readyState === 'complete') {
        advantagesInit()
        sideTitlesInit()
    }
}



 // const sandwichBtn = document.getElementById('sandwich')
    // const menu = document.querySelector('header .menu')
    // const menuHeight = window.getComputedStyle(menu).height
    // const menuItems = menu.querySelectorAll('li')
    // const menuOpen = () => {
    //     header.classList.add('menuOpen')
    //     sandwichBtn.classList.add('active')
    //     menu.style.top = 0
    // }
    // const menuClose = () => {
    //     header.classList.remove('menuOpen')
    //     sandwichBtn.classList.remove('active')
    //     menu.style.top = `-${menuHeight}`
    // }
    // menu.style.top = `-${menuHeight}`
    // sandwichBtn.addEventListener('click', () => {
    //     if (sandwichBtn.classList.contains('active')) {
    //         menuClose()
    //     } else {
    //         menuOpen()
    //     }
    // })
    // document.addEventListener('touchstart', e => {
    //     if (menu !== e.target &&
    //         !menu.contains(e.target) &&
    //         sandwichBtn !== e.target &&
    //         !sandwichBtn.contains(e.target) &&
    //         sandwichBtn.classList.contains('active')) {
    //         menuClose()
    //     }
    // })
    // Array.from(menuItems).forEach(e => {
    //     e.addEventListener('click', () => {
    //         if (sandwichBtn.classList.contains('active')) {
    //             menuClose()
    //         }
    //     })
    // })