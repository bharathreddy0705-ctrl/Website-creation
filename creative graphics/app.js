/**
 * Creative Graphics - Client Web Application
 * Client: Muppalla Rama Mohan
 * Contact: 9989961474 | creativegraphics1979@gmail.com
 * Address: 7-41-14/A, Beside Bapuji Nagar Hospital, Street Number 1, Nacharam - Mallapur Rd, Hyderabad 500076
 */

document.addEventListener('DOMContentLoaded', () => {
  initPriceCalculator();
  initServiceFilters();
  initSearch();
  initContactForm();
  initAddressCopy();
  initMobileMenu();
  initFaqAccordion();
});

// Toast notification helper
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toast-text');
  const toastIcon = document.getElementById('toast-icon');

  if (!toast || !toastText) return;

  toastText.textContent = message;
  if (type === 'success') {
    toastIcon.className = 'fas fa-check-circle text-green-500 text-lg mr-2';
  } else {
    toastIcon.className = 'fas fa-info-circle text-blue-500 text-lg mr-2';
  }

  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

// 1. Copy Address to Clipboard
function initAddressCopy() {
  const copyBtn = document.getElementById('copy-address-btn');
  const fullAddress = `Creative Graphics, 7-41-14/A, Beside Bapuji Nagar Hospital, Street Number 1, Nacharam - Mallapur Rd, Bapuji Nagar, Nacharam, Hyderabad, Telangana 500076`;

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(fullAddress).then(() => {
        showToast('Address copied to clipboard! Ready to paste in Maps or chat.');
      }).catch(err => {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = fullAddress;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('Address copied to clipboard!');
      });
    });
  }
}

// 2. Interactive Price Estimator / Quote Calculator
const pricingMatrix = {
  visiting_cards: {
    baseRate: 0.60,
    finishes: {
      standard: { name: 'Standard 350 GSM Gloss/Matte', multiplier: 1.0 },
      velvet: { name: 'Velvet Touch / Soft Matt', multiplier: 1.45 },
      spot_uv: { name: 'Spot UV 3D Emboss', multiplier: 1.85 },
      gold_foil: { name: 'Metallic Gold Foil Stamp', multiplier: 2.30 }
    },
    minQty: 100,
    unit: 'cards',
    note: 'Premium double-sided or single-sided business cards'
  },
  brochures: {
    baseRate: 4.5,
    finishes: {
      standard: { name: '170 GSM Art Paper Bi-Fold', multiplier: 1.0 },
      trifold: { name: '210 GSM Gloss Tri-Fold', multiplier: 1.35 },
      luxury: { name: '300 GSM Heavy Matt Lamination', multiplier: 1.80 }
    },
    minQty: 100,
    unit: 'copies',
    note: 'High-impact color-calibrated corporate brochures'
  },
  pamphlets: {
    baseRate: 0.85,
    finishes: {
      standard: { name: 'A5 Single Side 90 GSM Art Paper', multiplier: 1.0 },
      a5_double: { name: 'A5 Double Sided Full Colour', multiplier: 1.55 },
      a4_flyer: { name: 'A4 Full Page Vibrant Colour', multiplier: 2.10 }
    },
    minQty: 500,
    unit: 'leaflets',
    note: 'Door-to-door, newspaper inserts & promotional flyers'
  },
  wedding_cards: {
    baseRate: 25.0,
    finishes: {
      standard: { name: 'Traditional Floral 2-Fold Card', multiplier: 1.0 },
      laser_cut: { name: 'Laser-Cut Royal Shutter Card', multiplier: 1.90 },
      gold_velvet: { name: 'Hardbound Box & Velvet Gold Emboss', multiplier: 3.20 }
    },
    minQty: 100,
    unit: 'invitations',
    note: 'Custom Telugu/English/Hindi/Urdu calligraphy & motifs'
  },
  bill_books: {
    baseRate: 95.0,
    finishes: {
      duplicate: { name: 'Duplicate (1+1) Carbonless NCR 100 sets', multiplier: 1.0 },
      triplicate: { name: 'Triplicate (1+2) Multi-colour 150 sets', multiplier: 1.50 },
      hardbound: { name: 'Triplicate Hardbound with Numbering', multiplier: 1.85 }
    },
    minQty: 5,
    unit: 'books',
    note: 'Perforated, sequentially numbered business invoice books'
  },
  colour_xerox: {
    baseRate: 4.0,
    finishes: {
      a4_normal: { name: 'A4 75 GSM High Speed Digital Laser', multiplier: 1.0 },
      a4_bond: { name: 'A4 100 GSM Executive Bond Paper', multiplier: 1.60 },
      a3_colour: { name: 'A3 High Resolution Glossy Photo Print', multiplier: 3.20 }
    },
    minQty: 20,
    unit: 'pages',
    note: 'Vibrant true-to-life CMYK xerox & digital laser printouts'
  },
  id_cards: {
    baseRate: 45.0,
    finishes: {
      standard: { name: 'PVC Smart Card with Basic Clip', multiplier: 1.0 },
      satin_lanyard: { name: 'PVC Card + Multi-colour Custom Satin Lanyard', multiplier: 1.65 },
      metallic: { name: 'Chip/Proximity Card + Custom Lanyard', multiplier: 2.40 }
    },
    minQty: 10,
    unit: 'cards',
    note: 'Corporate, school, and event identification cards'
  },
  book_binding: {
    baseRate: 35.0,
    finishes: {
      spiral: { name: 'Spiral / Coil Binding with Clear OHP Cover', multiplier: 1.0 },
      wiro: { name: 'Metal Wiro Twin-Ring Calendar/Report Binding', multiplier: 1.70 },
      hardbound: { name: 'Thesis Hardbound with Golden Foil Lettering', multiplier: 4.80 }
    },
    minQty: 1,
    unit: 'books',
    note: 'Project reports, university thesis, and corporate manuals'
  },
  stickers: {
    baseRate: 2.2,
    finishes: {
      paper_gloss: { name: 'Gloss Paper Die-Cut Labels', multiplier: 1.0 },
      vinyl_waterproof: { name: 'Waterproof Vinyl Matt/Gloss Stickers', multiplier: 1.85 },
      transparent: { name: 'Transparent Clear Poly Vinyl Custom Cut', multiplier: 2.40 }
    },
    minQty: 100,
    unit: 'stickers',
    note: 'Packaging labels, product branding, jar labels & QR code stickers'
  }
};

function initPriceCalculator() {
  const serviceSelect = document.getElementById('calc-service');
  const finishSelect = document.getElementById('calc-finish');
  const qtyInput = document.getElementById('calc-qty');
  const qtyDisplay = document.getElementById('calc-qty-display');
  const unitDisplay = document.getElementById('calc-unit-display');
  const priceDisplay = document.getElementById('calc-price-result');
  const ratePerUnit = document.getElementById('calc-rate-unit');
  const calcWhatsappBtn = document.getElementById('calc-whatsapp-btn');

  if (!serviceSelect || !finishSelect || !qtyInput) return;

  function updateFinishes() {
    const serviceKey = serviceSelect.value;
    const serviceData = pricingMatrix[serviceKey];
    if (!serviceData) return;

    finishSelect.innerHTML = '';
    Object.keys(serviceData.finishes).forEach(key => {
      const opt = document.createElement('option');
      opt.value = key;
      opt.textContent = serviceData.finishes[key].name;
      finishSelect.appendChild(opt);
    });

    qtyInput.min = serviceData.minQty;
    if (parseInt(qtyInput.value) < serviceData.minQty) {
      qtyInput.value = serviceData.minQty;
    }
    unitDisplay.textContent = serviceData.unit;
    calculate();
  }

  function calculate() {
    const serviceKey = serviceSelect.value;
    const finishKey = finishSelect.value;
    const qty = parseInt(qtyInput.value) || 10;
    const serviceData = pricingMatrix[serviceKey];

    if (!serviceData || !serviceData.finishes[finishKey]) return;

    qtyDisplay.textContent = qty.toLocaleString();
    const finishData = serviceData.finishes[finishKey];
    
    // Volume discounts: 500+ = 5% off, 1000+ = 10% off, 2500+ = 15% off
    let volumeDiscount = 1.0;
    if (qty >= 2500) volumeDiscount = 0.85;
    else if (qty >= 1000) volumeDiscount = 0.90;
    else if (qty >= 500) volumeDiscount = 0.95;

    const unitPrice = serviceData.baseRate * finishData.multiplier * volumeDiscount;
    const totalPrice = Math.round(unitPrice * qty);
    const lowEstimate = Math.max(50, Math.round(totalPrice * 0.92));
    const highEstimate = Math.max(60, Math.round(totalPrice * 1.08));

    priceDisplay.textContent = `₹ ${lowEstimate.toLocaleString()} - ₹ ${highEstimate.toLocaleString()}`;
    ratePerUnit.textContent = `Approx. ₹ ${(unitPrice).toFixed(2)} / ${serviceData.unit.slice(0, -1) || 'item'}`;

    // Update WhatsApp link
    const serviceTitle = serviceSelect.options[serviceSelect.selectedIndex].text;
    const finishTitle = finishData.name;
    const message = `Hello Muppalla Rama Mohan garu,\nI am inquiring about printing from Creative Graphics website:\n\n*Service:* ${serviceTitle}\n*Specifications:* ${finishTitle}\n*Quantity:* ${qty} ${serviceData.unit}\n*Estimated Quote:* ₹ ${lowEstimate} - ₹ ${highEstimate}\n\nPlease confirm availability and give me your best final price!`;
    const waUrl = `https://wa.me/919989961474?text=${encodeURIComponent(message)}`;
    calcWhatsappBtn.href = waUrl;
  }

  serviceSelect.addEventListener('change', updateFinishes);
  finishSelect.addEventListener('change', calculate);
  qtyInput.addEventListener('input', calculate);

  // Initialize
  updateFinishes();
}

// 3. Service Filtering & Category Tabs
function initServiceFilters() {
  const filterBtns = document.querySelectorAll('.service-filter-btn');
  const serviceCards = document.querySelectorAll('.service-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('bg-blue-600', 'text-white', 'shadow-md');
        b.classList.add('bg-white', 'text-slate-700', 'border', 'border-slate-200', 'hover:bg-slate-100');
      });
      btn.classList.remove('bg-white', 'text-slate-700', 'border', 'border-slate-200', 'hover:bg-slate-100');
      btn.classList.add('bg-blue-600', 'text-white', 'shadow-md');

      const category = btn.getAttribute('data-filter');

      serviceCards.forEach(card => {
        const itemCategory = card.getAttribute('data-category');
        if (category === 'all' || itemCategory === category) {
          card.classList.remove('hidden');
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.classList.add('hidden');
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
        }
      });
    });
  });
}

// 4. Live Search in Services
function initSearch() {
  const searchInput = document.getElementById('service-search');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase().trim();
    const serviceCards = document.querySelectorAll('.service-item');

    serviceCards.forEach(card => {
      const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
      const text = card.textContent.toLowerCase();
      if (title.includes(term) || text.includes(term)) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
}

// 5. Contact / Inquiry Form with direct WhatsApp & Email dispatch
function initContactForm() {
  const form = document.getElementById('inquiry-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('form-name').value.trim();
    const phone = document.getElementById('form-phone').value.trim();
    const service = document.getElementById('form-service').value;
    const qty = document.getElementById('form-qty').value.trim();
    const message = document.getElementById('form-message').value.trim();

    if (!name || !phone) {
      alert('Please enter your name and phone number.');
      return;
    }

    const waText = `*New Order Inquiry - Creative Graphics*\n` +
      `👤 *Name:* ${name}\n` +
      `📞 *Phone:* ${phone}\n` +
      `📄 *Service:* ${service}\n` +
      `🔢 *Quantity:* ${qty || 'To be discussed'}\n` +
      `📝 *Requirements:* ${message || 'Please contact me regarding this order.'}\n\n` +
      `_Sent from Creative Graphics website (Nacharam, Hyderabad)_`;

    const waUrl = `https://wa.me/919989961474?text=${encodeURIComponent(waText)}`;
    
    // Open WhatsApp in new tab
    window.open(waUrl, '_blank');
    showToast('Redirecting to WhatsApp with your order details!');
    form.reset();
  });
}

// 6. Mobile Menu Drawer
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const closeBtn = document.getElementById('mobile-menu-close');
  const menuDrawer = document.getElementById('mobile-menu');
  const navLinks = document.querySelectorAll('.mobile-nav-link');

  if (menuBtn && menuDrawer) {
    menuBtn.addEventListener('click', () => {
      menuDrawer.classList.remove('translate-x-full');
    });
  }

  if (closeBtn && menuDrawer) {
    closeBtn.addEventListener('click', () => {
      menuDrawer.classList.add('translate-x-full');
    });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (menuDrawer) menuDrawer.classList.add('translate-x-full');
    });
  });
}

// 7. FAQ Accordion
function initFaqAccordion() {
  const faqToggles = document.querySelectorAll('.faq-toggle');
  faqToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const content = toggle.nextElementSibling;
      const icon = toggle.querySelector('.faq-icon');
      
      const isOpen = !content.classList.contains('hidden');

      // Close all others
      document.querySelectorAll('.faq-content').forEach(c => c.classList.add('hidden'));
      document.querySelectorAll('.faq-icon').forEach(i => i.classList.remove('rotate-180'));

      if (!isOpen) {
        content.classList.remove('hidden');
        if (icon) icon.classList.add('rotate-180');
      }
    });
  });
}
