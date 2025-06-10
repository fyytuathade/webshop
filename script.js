const products = [
  {
    id: 1,
    name: "Kaos Hitam",
    price: 85000,
    image: "image/black-t-shirt.png"
  },
  {
    id: 2,
    name: "Jaket Hitam",
    price: 150000,
    image: "image/jacket-black.png"
  },
  {
    id: 3,
    name: "Jaket Abu",
    price: 220000,
    image: "image/jacket.png"
  },
  {
    id: 4,
    name: "Sweater Abu",
    price: 350000,
    image: "image/sweater-abu.png"
  },
  {
    id: 5,
    name: "Sweater Cream",
    price: 180000,
    image: "image/sweater-cream.png"
  },
  {
    id: 6,
    name: "Dress Casual Hijau",
    price: 270000,
    image: "image/sweater.png"
  },
  {
    id: 7,
    name: "Dress Casual Hijau",
    price: 270000,
    image: "image/Sweatjacke.png"
  },
  {
    id: 8,
    name: "Dress Casual Hijau",
    price: 270000,
    image: "image/t-shirt-white.png"
  }
];

const productsGrid = document.getElementById("products-grid");

function renderProducts() {
  productsGrid.innerHTML = products.map(product =>
    `<article class="product-card" aria-label="${product.name}">
          <img src="${product.image}" alt="Gambar ${product.name}" class="product-image" loading="lazy" />
          <div class="product-info">
            <div>
              <h3 class="product-name">${product.name}</h3>
              <div class="product-price">Rp ${product.price.toLocaleString('id-ID')}</div>
            </div>
            <button class="btn-add-cart" aria-label="Tambah ${product.name} ke keranjang" onclick="addToCart(${product.id})">Tambah ke Keranjang</button>
          </div>
        </article>`).join('');
}


// Cart logic
let cart = {};


const cartBtn = document.getElementById('cart-btn');
const cartSidebar = document.getElementById('cart-sidebar');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElem = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');


cartBtn.addEventListener('click', () => {
  cartSidebar.classList.toggle('active');
});

function updateCartUI() {
  const items = Object.values(cart);
  if (items.length === 0) {
    cartItemsContainer.innerHTML = '<p>Keranjang kosong.</p>';
    cartTotalElem.textContent = 'Total: Rp 0';
    checkoutBtn.disabled = true;
    return;
  }
  let total = 0;
  cartItemsContainer.innerHTML = items.map(item => {
    total += item.price * item.quantity;
    return `
          <div class="cart-item" aria-label="${item.name}, quantity ${item.quantity}">
            <img src="${item.image}" alt="Gambar ${item.name}" />
            <div class="cart-item-details">
              <div class="cart-item-name">${item.name}</div>
              <div class="cart-item-quantity">Jumlah: ${item.quantity}</div>
            </div>
            <div class="cart-item-price">Rp ${(item.price * item.quantity).toLocaleString('id-ID')}</div>
            <button class="btn-remove-item" aria-label="Hapus ${item.name} dari keranjang" onclick="removeFromCart(${item.id})">&times;</button>
          </div>
        `;
  }).join('');
  cartTotalElem.textContent = `Total: Rp ${total.toLocaleString('id-ID')}`;
  checkoutBtn.disabled = false;
}

function addToCart(productId) {
  const prod = products.find(p => p.id === productId);
  if (!prod) return;
  if (cart[productId]) {
    cart[productId].quantity += 1;
  } else {
    cart[productId] = { ...prod, quantity: 1 };
  }
  updateCartUI();
  cartSidebar.classList.add('active');
}

function removeFromCart(productId) {
  if (!cart[productId]) return;
  delete cart[productId];
  updateCartUI();
}


checkoutBtn.addEventListener('click', () => {
  document.getElementById('modal-overlay').classList.add('active');
  document.getElementById('checkout-form').reset();
  document.getElementById('checkout-form').focus();
});


const modalOverlay = document.getElementById('modal-overlay');
const modalCloseBtn = document.getElementById('modal-close');

modalCloseBtn.addEventListener('click', () => {
  modalOverlay.classList.remove('active');
});

modalOverlay.addEventListener('click', e => {
  if (e.target === modalOverlay) {
    modalOverlay.classList.remove('active');
  }
});


const checkoutForm = document.getElementById('checkout-form');
checkoutForm.addEventListener('submit', e => {
  e.preventDefault();
  // Ambil data inputan customer
  const name = checkoutForm.name.value.trim();
  const email = checkoutForm.email.value.trim();
  const address = checkoutForm.address.value.trim();


  if (!name || !email || !address) {
    alert('Mohon lengkapi semua kolom.');
    return;
  }


  // Siapkan ringkasan order
  let orderSummary = `Terima kasih, ${name}! Pesanan Anda telah diterima.\n\nDetail pesanan:\n`;
  Object.values(cart).forEach(item => {
    orderSummary += `- ${item.name} x${item.quantity} = Rp ${(item.price * item.quantity).toLocaleString('id-ID')}\n`;
  });
  const total = Object.values(cart).reduce((acc, item) => acc + item.price * item.quantity, 0);
  orderSummary += `\nTotal pembayaran: Rp ${total.toLocaleString('id-ID')}\n`;
  orderSummary += `\nPengiriman ke alamat:\n${address}\nEmail: ${email}`;


  // Buat pesan WA URL encoded
  const whatsappMessage = encodeURIComponent(orderSummary);
  // Nomor WA tujuan, ganti dengan nomor tujuan aslimu, contoh: 6281234567890 (Indonesia)
  const waNumber = '085162660106';
  const waURL = `https://wa.me/${waNumber}?text=${whatsappMessage}`;


  // Tampilkan alert ringkasan order
  alert(orderSummary);


  // Buka tab baru untuk mengirim pesan WA
  window.open(waURL, '_blank');


  // Reset keranjang dan UI
  cart = {};
  updateCartUI();
  modalOverlay.classList.remove('active');
  cartSidebar.classList.remove('active');
});

const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const backdrop = document.createElement('div');
backdrop.classList.add('backdrop');
document.body.appendChild(backdrop);
menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    backdrop.style.display = navLinks.classList.contains('active') ? 'block' : 'none';
});
// Close menu when clicking on backdrop
backdrop.addEventListener('click', () => {
    navLinks.classList.remove('active');
    backdrop.style.display = 'none';
});

// Initialize
renderProducts();
updateCartUI();