// ============== Основной скрипт взаимодействия (Enhanced) ==============
(function() {
  const productGrid = document.getElementById('productGrid');
  const filters = document.querySelectorAll('.filter-btn');
  const cartBtn = document.querySelector('.cart-btn');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartBackdrop = document.getElementById('cartBackdrop');
  const cartItemsEl = document.getElementById('cartItems');
  const cartCountEl = document.getElementById('cartCount');
  const cartTotalEl = document.getElementById('cartTotal');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  const header = document.querySelector('.site-header');

  let cart = [];
  let currentFilter = 'all';

  /* ========== Enhanced animations ========== */
  function animateElement(element, animation = 'fadeInUp') {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    
    requestAnimationFrame(() => {
      element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    });
  }

  function staggeredAnimation(elements, delay = 100) {
    elements.forEach((element, index) => {
      setTimeout(() => {
        animateElement(element);
      }, index * delay);
    });
  }

  /* ========== Render products with animation ========== */
  function formatPrice(num) { return num.toLocaleString('uk-UA') + ' ₴'; }

  function renderProducts() {
    const fragment = document.createDocumentFragment();
    const list = PRODUCTS.filter(p => currentFilter === 'all' || p.category === currentFilter);
    
    // Clear grid with fade out
    productGrid.style.opacity = '0';
    
    setTimeout(() => {
      list.forEach(p => {
        const card = document.createElement('article');
        card.className = 'product-card';
        card.setAttribute('data-category', p.category);
        card.innerHTML = `
          <span class="stock">${p.stock}</span>
          <img src="${p.img}" alt="${p.name}" loading="lazy" />
          <h3>${p.name}</h3>
          <div class="product-meta">
            <span class="price">${formatPrice(p.price)}</span>
            <span class="weight">${p.weight}</span>
          </div>
          <button class="add-btn" data-id="${p.id}">В корзину</button>`;
        fragment.appendChild(card);
      });
      
      productGrid.innerHTML = '';
      productGrid.appendChild(fragment);
      
      // Animate in
      productGrid.style.opacity = '1';
      const cards = productGrid.querySelectorAll('.product-card');
      staggeredAnimation(cards, 80);
    }, 200);
  }

  /* ========== Enhanced Filters ========== */
  filters.forEach(btn => btn.addEventListener('click', () => {
    // Remove active class from all buttons
    filters.forEach(b => b.classList.remove('active'));
    
    // Add active class to clicked button with animation
    btn.classList.add('active');
    
    // Update filter and render
    currentFilter = btn.dataset.filter;
    renderProducts();
    
    // Focus management
    productGrid.focus?.();
  }));

  /* ========== Enhanced Cart ========== */
  function openCart() {
    cartDrawer.classList.add('open');
    cartBackdrop.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
  }
  
  function closeCart() {
    cartDrawer.classList.remove('open');
    cartBackdrop.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
  }
  
  cartBtn.addEventListener('click', openCart);
  document.querySelector('.cart-close').addEventListener('click', closeCart);
  cartBackdrop.addEventListener('click', closeCart);
  document.addEventListener('keydown', e => { 
    if(e.key === 'Escape') closeCart(); 
  });

  // Enhanced cart state management
  function saveCart() { 
    localStorage.setItem('ikorochka_cart', JSON.stringify(cart)); 
  }
  
  function loadCart() { 
    try { 
      cart = JSON.parse(localStorage.getItem('ikorochka_cart')) || []; 
    } catch { 
      cart = []; 
    } 
  }

  function updateCartUI() {
    cartItemsEl.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
      const product = PRODUCTS.find(p => p.id === item.id);
      if(!product) return;
      
      const row = document.createElement('div');
      row.className = 'cart-item';
      total += product.price * item.qty;
      
      row.innerHTML = `
        <img src="${product.img}" alt="${product.name}" />
        <div>
          <h4>${product.name}</h4>
          <div class="ci-meta">${product.weight}</div>
          <div class="qty" data-id="${item.id}">
            <button class="minus" aria-label="Уменьшить">−</button>
            <span class="val">${item.qty}</span>
            <button class="plus" aria-label="Увеличить">+</button>
          </div>
          <button class="remove-item" data-id="${item.id}">Удалить</button>
        </div>
        <strong>${formatPrice(product.price * item.qty)}</strong>`;
      
      cartItemsEl.appendChild(row);
      animateElement(row);
    });
    
    cartCountEl.textContent = cart.reduce((s,i)=>s+i.qty,0);
    cartTotalEl.textContent = formatPrice(total);
    
    // Animate cart badge
    if (cart.length > 0) {
      cartBtn.style.transform = 'scale(1.1)';
      setTimeout(() => cartBtn.style.transform = 'scale(1)', 200);
    }
  }

  function addToCart(id) {
    const existing = cart.find(i => i.id === id);
    if(existing) existing.qty += 1; 
    else cart.push({ id, qty: 1 });
    
    saveCart();
    updateCartUI();
    
    // Visual feedback
    const button = document.querySelector(`[data-id="${id}"]`);
    button.style.transform = 'scale(0.95)';
    setTimeout(() => button.style.transform = 'scale(1)', 150);
  }

  productGrid.addEventListener('click', e => {
    const btn = e.target.closest('.add-btn');
    if(btn) { 
      addToCart(btn.dataset.id); 
      openCart(); 
    }
  });

  cartItemsEl.addEventListener('click', e => {
    const minus = e.target.closest('.minus');
    const plus = e.target.closest('.plus');
    const remove = e.target.closest('.remove-item');
    
    if(minus || plus) {
      const wrap = e.target.closest('.qty');
      const id = wrap.dataset.id;
      const item = cart.find(i=>i.id===id);
      
      if(item) {
        if(minus) item.qty = Math.max(1, item.qty - 1);
        if(plus) item.qty += 1;
      }
      
      saveCart();
      updateCartUI();
    }
    
    if(remove) {
      cart = cart.filter(i => i.id !== remove.dataset.id);
      saveCart();
      updateCartUI();
    }
  });

  checkoutBtn.addEventListener('click', () => {
    alert('Форма оформления заказа появится позже.');
  });

  /* ========== Enhanced Forms validation ========== */
  function attachForm(form) {
    if(!form) return;
    
    form.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;
      
      // Enhanced validation with animations
      form.querySelectorAll('[required]').forEach(f => {
        const errEl = form.querySelector(`[data-error-for="${f.id||f.name}"]`);
        if(errEl) errEl.textContent = '';
        
        f.style.borderColor = '';
        
        if(f.type === 'checkbox' && !f.checked) {
          valid = false; 
          if(errEl) errEl.textContent = 'Обязательно';
          f.parentElement.style.borderColor = '#ff6a4b';
        } else if(f.value.trim().length < 2) {
          valid = false; 
          if(errEl) errEl.textContent = 'Введите корректно';
          f.style.borderColor = '#ff6a4b';
        } else if(f.type === 'tel' && f.value.replace(/\D/g,'').length < 11) {
          valid = false; 
          if(errEl) errEl.textContent = 'Телефон неверен';
          f.style.borderColor = '#ff6a4b';
        }
      });
      
      if(valid) {
        const success = form.querySelector('.form-success');
        if(success) {
          success.hidden = false;
          animateElement(success);
        }
        
        form.reset();
        setTimeout(()=>{
          success && (success.hidden = true); 
          form.closest('dialog')?.close(); 
        }, 2500);
      }
    });
  }

  attachForm(document.getElementById('contactForm'));
  attachForm(document.getElementById('callbackForm'));
  attachForm(document.getElementById('consultForm'));

  // Enhanced Subscribe form
  const subscribeForm = document.getElementById('subscribeForm');
  if(subscribeForm) {
    subscribeForm.addEventListener('submit', e => {
      e.preventDefault();
      const email = subscribeForm.email.value.trim();
      
      if(/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        subscribeForm.reset();
        const successEl = document.querySelector('.subscribe-success');
        successEl.hidden = false;
        animateElement(successEl);
        setTimeout(()=> successEl.hidden = true, 3500);
      }
    });
  }

  /* ========== Enhanced Dialog helpers ========== */
  function openDialog(id) {
    const el = document.getElementById(id);
    if(el && el.showModal) { 
      el.showModal(); 
      document.body.classList.add('modal-open'); 
      
      // Animate modal content
      const modalBox = el.querySelector('.modal-box');
      if(modalBox) animateElement(modalBox);
    }
  }
  
  function closeDialog(d) { 
    d.close(); 
    document.body.classList.remove('modal-open'); 
  }
  
  document.querySelectorAll('[data-dialog]').forEach(btn => 
    btn.addEventListener('click', () => {
      const map = { callback: 'callbackDialog', consult: 'consultDialog', story: 'storyDialog' };
      openDialog(map[btn.dataset.dialog]);
    })
  );
  
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('close', () => document.body.classList.remove('modal-open'));
    modal.addEventListener('click', e => { 
      if(e.target === modal) closeDialog(modal); 
    });
  });

  /* ========== Enhanced Mobile nav ========== */
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    mainNav.classList.toggle('open');
  });
  
  mainNav.querySelectorAll('a').forEach(a => 
    a.addEventListener('click', () => {
      if(mainNav.classList.contains('open')) {
        navToggle.classList.remove('active');
        mainNav.classList.remove('open');
      }
    })
  );

  /* ========== Enhanced Header scroll state ========== */
  let ticking = false;
  
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        if(window.scrollY > 20) {
          header.classList.add('scrolled'); 
        } else {
          header.classList.remove('scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  }
  
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ========== Enhanced Grain effect ========== */
  const grainCanvas = document.getElementById('grainCanvas');
  if (grainCanvas) {
    const ctx = grainCanvas.getContext('2d');
    let w = 0, h = 0, intervalId = null;

    function resize() {
      // Limit canvas size to avoid huge allocations on very large viewports
      w = Math.min(innerWidth, 1600);
      h = Math.min(innerHeight, 900);
      grainCanvas.width = w;
      grainCanvas.height = h;
    }

    function drawOnce() {
      // Skip drawing if canvas is not in the viewport
      const rect = grainCanvas.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > innerHeight) return;

      const cols = Math.ceil(w / 4);
      const rows = Math.ceil(h / 4);
      const imageData = ctx.createImageData(cols * 4, rows * 4);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const v = Math.random() * 255;
        data[i] = v; data[i+1] = v; data[i+2] = v; data[i+3] = 10;
      }

      // Scale the small noise up to full canvas to reduce work
      const off = document.createElement('canvas');
      off.width = imageData.width; off.height = imageData.height;
      const offCtx = off.getContext('2d');
      offCtx.putImageData(imageData, 0, 0);
      ctx.clearRect(0,0,w,h);
      ctx.globalAlpha = 0.12;
      ctx.drawImage(off, 0, 0, w, h);
      ctx.globalAlpha = 1;
    }

    resize();
    // Low frequency update to save CPU: 8 FPS
    intervalId = setInterval(() => drawOnce(), 125);

    addEventListener('resize', () => {
      resize();
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        clearInterval(intervalId);
        intervalId = null;
      } else if (!intervalId) {
        intervalId = setInterval(() => drawOnce(), 125);
      }
    });
  }

  /* ========== Enhanced Intersection Observer for animations ========== */
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        
        if (target.classList.contains('benefit-card')) {
          animateElement(target);
        } else if (target.classList.contains('delivery-card')) {
          animateElement(target);
        }
        
        observer.unobserve(target);
      }
    });
  }, observerOptions);

  // Observe elements for scroll animations
  function observeElements() {
    document.querySelectorAll('.benefit-card, .delivery-card').forEach(el => {
      observer.observe(el);
    });
  }

  /* ========== Init ========== */
  loadCart();
  renderProducts();
  updateCartUI();
  
  // Initialize scroll animations after page load
  window.addEventListener('load', () => {
    observeElements();
  });
  
})();
