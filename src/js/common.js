const log = console.log
const isMobile = window.matchMedia('(max-width: 768px)').matches

const feedback = document.getElementById('feedback')
const headerFeedbackBtn = document.getElementById('feedbackBtn')
const headerFeedbackBtnMobile = document.getElementById('feedbackBtnMobile')
const feedbackBtn = document.querySelectorAll('.feedbackBtn')
const menu = document.getElementById('menu')
const menuButton = document.getElementById('menuButton')

const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Б'
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Б', 'кБ', 'мБ', 'гБ', 'тБ', 'пБ', 'EB', 'ZB', 'YB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

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

const autoHeight = (content, container) => {
    if (container.classList.contains('active')) {
        content.style.height = 0
    } else {
        content.style.height = 'auto'
        const height = content.offsetHeight
        content.style.height = 0
        content.style.transition = 'height .3s'
        setTimeout(() => content.style.height = `${height}px`, 0)
    }
}

const menuInitClose = () => {
    const menuHeight = menu.offsetHeight
    const feedbackHeight = feedback.offsetHeight
    menu.style.top = `-${menuHeight}px`
    feedback.style.top = `-${feedbackHeight}px`
    feedback.classList.remove('active')
    Array.from(feedbackBtn).forEach(e => e.classList.remove('active'))
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
    if (currentYear) { currentYear.innerHTML = new Date().getFullYear() }

    // const body = document.querySelector('html')

    menuButton.addEventListener('click', () => {
        if (menuButton.classList.contains('active')) {
            // isMobile && body.classList.remove('fixed')
            menuInitClose()
            menu.classList.remove('active')
            menuButton.classList.remove('active')
        } else {
            menuOpen(menu)
            menu.classList.add('active')
            menuButton.classList.add('active')
            // isMobile && body.classList.add('fixed')
        }
    })

    Array.from(feedbackBtn).forEach(e => {
        e.addEventListener('click', () => {
            if (!feedback.classList.contains('active')) {
                menu.classList.contains('active') && menu.classList.remove('active')
                menuOpen(feedback)
                menuButton.classList.add('active')
                classActive(isMobile ? headerFeedbackBtnMobile : headerFeedbackBtn, feedback)
                // isMobile && body.classList.add('fixed')
            }

        })
    })

    const getFile = document.querySelectorAll('a.fileSize')
    Array.from(getFile).forEach(e => {
        if (e.href.split('.').pop() === 'pdf') {
            e.classList.add('pdf')
        } else {
            e.classList.add('zip')
        }
        const getFileSize = async () => {
            const container = e.querySelector('.rightSide .size')
            const fileImg = await fetch(e.href).then(r => r.blob())
            const size = formatBytes(fileImg.size)
            container.innerHTML = size
        }
        getFileSize()
    })

    const academyItems = document.querySelectorAll('#academy .academy > .item')
    Array.from(academyItems).forEach(e => {
        const title = e.querySelector('.title')
        title.addEventListener('click', () => {
            const content = e.querySelector('.content')
            autoHeight(content, e)
            classActive(e)
        })
    })

    const faqItems = document.querySelectorAll('#faq .faq > .item')
    Array.from(faqItems).forEach(e => {
        const title = e.querySelector('.title')
        title.addEventListener('click', () => {
            const content = e.querySelector('.content')
            autoHeight(content, e)
            classActive(e)
        })
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
        slidesPerView: 1,
        loop: true,
        thumbs: {
            swiper: projectsTitleSlider
        },
        navigation: {
            nextEl: '#projects .next',
            prevEl: '#projects .prev'
        },
        breakpoints: {
            1024: {
                slidesPerView: 'auto',
                loopedSlides: projectsSlides.length,
                slideToClickedSlide: true,
                allowTouchMove: false
            }
        }
    })

    const materialProjectsSlider = new Swiper('.materialProjectsSlider', {
        speed: 500,
        spaceBetween: 10,
        slidesPerView: 2,
        slidesPerGroup: 2,
        loop: true,
        navigation: {
            nextEl: '#materialProjects .next',
            prevEl: '#materialProjects .prev'
        }
    })

    const callbackForm = document.getElementById('callbackForm')
    callbackForm.addEventListener('submit', formSend)

})

document.onreadystatechange = () => {
    if (document.readyState === 'complete') {
        menuInitClose()
        !isMobile && advantagesInit()
        sideTitlesInit()
    }
}

if (document.getElementById('contactsPage')) {
    DG.then(() => {
        let map
        const mapIcon = DG.icon({
            iconUrl: '/assets/app/img/marker.png',
            iconSize: isMobile ? [23, 24] : [33, 34]
        })
        map = DG.map('map', {
            center: [55.753466, 37.62017],
            zoom: 10
        })
        DG.marker([55.749874, 37.53774], { icon: mapIcon }).addTo(map)
        DG.marker([55.962681, 37.509696], { icon: mapIcon }).addTo(map)
    })
}