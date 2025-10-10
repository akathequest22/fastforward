import './style.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const navbar = document.getElementById('navbar')
const navToggle = document.getElementById('navToggle')
const navMenu = document.getElementById('navMenu')
const navLinks = document.querySelectorAll('.nav-link')

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled')
  } else {
    navbar.classList.remove('scrolled')
  }
})

navToggle.addEventListener('click', () => {
  navMenu.classList.toggle('active')
})

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('active')
    navLinks.forEach(l => l.classList.remove('active'))
    link.classList.add('active')
  })
})

const canvas = document.getElementById('universeCanvas')
const ctx = canvas.getContext('2d')

function resizeCanvas() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

resizeCanvas()
window.addEventListener('resize', resizeCanvas)

class Star {
  constructor() {
    this.x = Math.random() * canvas.width
    this.y = Math.random() * canvas.height
    this.size = Math.random() * 2
    this.speedX = (Math.random() - 0.5) * 0.5
    this.speedY = (Math.random() - 0.5) * 0.5
    this.opacity = Math.random()
    this.fadeDirection = Math.random() > 0.5 ? 1 : -1
  }

  update() {
    this.x += this.speedX
    this.y += this.speedY

    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1

    this.opacity += this.fadeDirection * 0.01
    if (this.opacity <= 0 || this.opacity >= 1) {
      this.fadeDirection *= -1
    }
  }

  draw() {
    ctx.fillStyle = `rgba(255, 206, 0, ${this.opacity})`
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fill()
  }
}

const stars = []
for (let i = 0; i < 150; i++) {
  stars.push(new Star())
}

function animate() {
  ctx.fillStyle = 'rgba(8, 8, 8, 0.1)'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  stars.forEach(star => {
    star.update()
    star.draw()
  })

  requestAnimationFrame(animate)
}

animate()

const statNumbers = document.querySelectorAll('.stat-number')

const animateCounter = (element) => {
  const target = parseInt(element.getAttribute('data-target'))
  const duration = 2000
  const increment = target / (duration / 16)
  let current = 0

  const updateCounter = () => {
    current += increment
    if (current < target) {
      element.textContent = Math.ceil(current)
      requestAnimationFrame(updateCounter)
    } else {
      element.textContent = target
    }
  }

  updateCounter()
}

const observerOptions = {
  threshold: 0.5,
  rootMargin: '0px'
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target)
      observer.unobserve(entry.target)
    }
  })
}, observerOptions)

statNumbers.forEach(stat => observer.observe(stat))

gsap.from('.service-card', {
  scrollTrigger: {
    trigger: '.services-grid',
    start: 'top 80%'
  },
  y: 50,
  opacity: 0,
  duration: 0.6,
  stagger: 0.1
})

gsap.from('.package-card', {
  scrollTrigger: {
    trigger: '.packages-grid',
    start: 'top 80%'
  },
  y: 50,
  opacity: 0,
  duration: 0.6,
  stagger: 0.2
})

gsap.from('.portfolio-item', {
  scrollTrigger: {
    trigger: '.portfolio-grid',
    start: 'top 80%'
  },
  scale: 0.8,
  opacity: 0,
  duration: 0.6,
  stagger: 0.15
})

const filterBtns = document.querySelectorAll('.filter-btn')
const portfolioItems = document.querySelectorAll('.portfolio-item')

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'))
    btn.classList.add('active')

    const filter = btn.getAttribute('data-filter')

    portfolioItems.forEach(item => {
      if (filter === 'all' || item.getAttribute('data-category') === filter) {
        gsap.to(item, {
          scale: 1,
          opacity: 1,
          display: 'block',
          duration: 0.3
        })
      } else {
        gsap.to(item, {
          scale: 0,
          opacity: 0,
          duration: 0.3,
          onComplete: () => {
            item.style.display = 'none'
          }
        })
      }
    })
  })
})

const testimonialTrack = document.querySelector('.testimonial-track')
const testimonialCards = document.querySelectorAll('.testimonial-card')
const prevBtn = document.getElementById('prevBtn')
const nextBtn = document.getElementById('nextBtn')
let currentIndex = 0

function updateSlider() {
  const offset = -currentIndex * 100
  gsap.to(testimonialTrack, {
    x: `${offset}%`,
    duration: 0.5,
    ease: 'power2.out'
  })
}

nextBtn.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % testimonialCards.length
  updateSlider()
})

prevBtn.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + testimonialCards.length) % testimonialCards.length
  updateSlider()
})

setInterval(() => {
  currentIndex = (currentIndex + 1) % testimonialCards.length
  updateSlider()
}, 5000)

const chatButton = document.getElementById('chatButton')
const chatWindow = document.getElementById('chatWindow')
const chatClose = document.getElementById('chatClose')
const chatSend = document.getElementById('chatSend')
const chatInput = document.getElementById('chatInput')
const chatBody = document.querySelector('.chat-body')

chatButton.addEventListener('click', () => {
  chatWindow.classList.add('active')
})

chatClose.addEventListener('click', () => {
  chatWindow.classList.remove('active')
})

function addMessage(message, isUser = false) {
  const messageDiv = document.createElement('div')
  messageDiv.classList.add('chat-message')
  messageDiv.classList.add(isUser ? 'user' : 'bot')

  const p = document.createElement('p')
  p.textContent = message
  messageDiv.appendChild(p)

  chatBody.appendChild(messageDiv)
  chatBody.scrollTop = chatBody.scrollHeight
}

function getBotResponse(userMessage) {
  const message = userMessage.toLowerCase()

  if (message.includes('service') || message.includes('offer')) {
    return 'We offer Marketing Consultation, Branding, Social Media Marketing, Design Services, Web Development, SEO/SEM, and Media Buying & Monetization. Which service interests you?'
  } else if (message.includes('price') || message.includes('cost')) {
    return 'We have three packages: Starter, Growth, and Pro. Please contact us directly for detailed pricing information tailored to your needs.'
  } else if (message.includes('contact')) {
    return 'You can reach us at info@fastforwardagency.com or call +95 9 123 456 789. We serve Myanmar, Thailand, and Cambodia!'
  } else if (message.includes('hello') || message.includes('hi')) {
    return 'Hello! How can we help you grow your business today?'
  } else if (message.includes('thank')) {
    return "You're welcome! Feel free to ask if you have any other questions."
  } else {
    return "That's a great question! For detailed information, please fill out our contact form or email us at info@fastforwardagency.com."
  }
}

chatSend.addEventListener('click', () => {
  const message = chatInput.value.trim()
  if (message) {
    addMessage(message, true)
    chatInput.value = ''

    setTimeout(() => {
      const response = getBotResponse(message)
      addMessage(response, false)
    }, 500)
  }
})

chatInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    chatSend.click()
  }
})

const contactForm = document.getElementById('contactForm')

contactForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const formData = new FormData(contactForm)
  const data = Object.fromEntries(formData)

  console.log('Form submitted:', data)

  gsap.to(contactForm, {
    scale: 0.95,
    duration: 0.1,
    yoyo: true,
    repeat: 1,
    onComplete: () => {
      alert('Thank you for your message! We will get back to you soon.')
      contactForm.reset()
    }
  })
})

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute('href'))
    if (target) {
      const offsetTop = target.offsetTop - 80
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      })
    }
  })
})

gsap.from('.about-text', {
  scrollTrigger: {
    trigger: '.about',
    start: 'top 70%'
  },
  x: -100,
  opacity: 0,
  duration: 1
})

gsap.from('.about-image', {
  scrollTrigger: {
    trigger: '.about',
    start: 'top 70%'
  },
  x: 100,
  opacity: 0,
  duration: 1
})

gsap.from('.section-title', {
  scrollTrigger: {
    trigger: '.section-title',
    start: 'top 85%'
  },
  y: 30,
  opacity: 0,
  duration: 0.8,
  stagger: 0.2
})
