const { gsap } = window

const clouds = document.querySelector('.sky-clouds')
const scene = document.querySelector('.sky-scene')
const landing = document.querySelector('.landing')
const dinosaur = document.querySelector('.sky-dino')
const dinosaurTrigger = document.querySelector('.dino-trigger')
const dinosaurStatus = document.querySelector('#dino-status')

dinosaurTrigger.addEventListener('click', () => {
  dinosaurStatus.textContent = 'The dinosaur noticed you!'
})

const sectionLinks = document.querySelectorAll('.site-nav a')
const updateCurrentSection = () => {
  const section = location.hash || '#home'
  sectionLinks.forEach((link) => {
    if (link.hash === section) link.setAttribute('aria-current', 'location')
    else link.removeAttribute('aria-current')
  })
}

window.addEventListener('hashchange', updateCurrentSection)
updateCurrentSection()

const media = gsap.matchMedia()

media.add('(prefers-reduced-motion: no-preference)', () => {
  gsap.to(clouds, {
    xPercent: 1.35,
    yPercent: -0.7,
    duration: 8,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  })
})

media.add('(prefers-reduced-motion: no-preference)', () => {
  const feeding = gsap.timeline({ repeat: -1 })
    .set(dinosaur, { '--pose': 0 }, 0)
    .set(dinosaur, { '--pose': 1 }, 2.6)
    .set(dinosaur, { '--pose': 2 }, 2.73)
    .set(dinosaur, { '--pose': 3 }, 2.87)
    .set(dinosaur, { '--pose': 4 }, 3.03)
    .set(dinosaur, { '--pose': 5 }, 3.31)
    .set(dinosaur, { '--pose': 4 }, 3.57)
    .set(dinosaur, { '--pose': 5 }, 3.76)
    .set(dinosaur, { '--pose': 6 }, 3.97)
    .set(dinosaur, { '--pose': 7 }, 4.15)
    .set(dinosaur, { '--pose': 6 }, 4.33)
    .set(dinosaur, { '--pose': 7 }, 4.49)
    .set(dinosaur, { '--pose': 1 }, 4.65)
    .set(dinosaur, { '--pose': 0 }, 4.81)

  const reaction = gsap.timeline({
    paused: true,
    onComplete: () => feeding.restart(),
  })
    .to(dinosaur, { yPercent: -4, duration: 0.17, ease: 'power2.out' })
    .to(dinosaur, { yPercent: 0, duration: 0.25, ease: 'power2.in', clearProps: 'transform' })

  const surprise = () => {
    feeding.pause()
    gsap.set(dinosaur, { '--pose': 0, clearProps: 'transform' })
    reaction.invalidate().restart()
  }

  dinosaurTrigger.addEventListener('click', surprise)
  return () => dinosaurTrigger.removeEventListener('click', surprise)
})

media.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
  const moveX = gsap.quickTo(scene, 'x', { duration: 0.9, ease: 'power3.out' })
  const moveY = gsap.quickTo(scene, 'y', { duration: 0.9, ease: 'power3.out' })
  const drift = (event) => {
    moveX((event.clientX / window.innerWidth - 0.5) * 13)
    moveY((event.clientY / window.innerHeight - 0.5) * 9)
  }
  const reset = () => {
    moveX(0)
    moveY(0)
  }

  landing.addEventListener('pointermove', drift)
  landing.addEventListener('pointerleave', reset)

  return () => {
    landing.removeEventListener('pointermove', drift)
    landing.removeEventListener('pointerleave', reset)
    gsap.killTweensOf(scene)
    gsap.set(scene, { clearProps: 'transform' })
  }
})

const { ScrollTrigger } = window
gsap.registerPlugin(ScrollTrigger)

media.add('(prefers-reduced-motion: no-preference)', () => {
  const movingScenes = document.querySelectorAll('.motion-scene')
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      target.classList.toggle('is-moving', isIntersecting)
    })
  }, { rootMargin: '8% 0px' })
  movingScenes.forEach((chapter) => observer.observe(chapter))

  gsap.utils.toArray('[data-reveal]').forEach((element) => {
    ScrollTrigger.create({
      trigger: element,
      start: 'top 93%',
      once: true,
      onEnter: () => gsap.from(element, {
        y: 24,
        opacity: 0.66,
        duration: 0.72,
        ease: 'power2.out',
        clearProps: 'transform,opacity',
        overwrite: 'auto',
      }),
    })
  })

  return () => {
    observer.disconnect()
    movingScenes.forEach((chapter) => chapter.classList.remove('is-moving'))
  }
})
