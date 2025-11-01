 
   // KHỞI TẠO CHUNG
 
document.addEventListener('DOMContentLoaded', () => {
  initMenuToggle();
  initLoginToggle();
  initializeHeroSlider();
  initRecommendationsSlider();
  initCartFeature();
  initLocationSelector();
});
 
// DANH MỤC 
 
function initMenuToggle() {
  const headerList = document.querySelector('.header_list');
  const headerListMenu = document.getElementById('header_list_menu');

  document.addEventListener('click', (e) => {
    if (headerListMenu && headerList) {
      if (!headerList.contains(e.target) && !headerListMenu.contains(e.target)) {
        headerListMenu.style.display = 'none';
      }
    }
  });

  if (headerList && headerListMenu) {
    headerList.addEventListener('click', (e) => {
      e.stopPropagation();
      headerListMenu.style.display =
        headerListMenu.style.display === 'block' ? 'none' : 'block';
    });
  }
}

 
//  ĐĂNG NHẬP
 
function initLoginToggle() {
  const headerlogin = document.querySelector('.header_login');
  const categoryLoginRe = document.getElementById('header_login_register');

  document.addEventListener('click', (e) => {
    if (categoryLoginRe && headerlogin) {
      if (!headerlogin.contains(e.target) && !categoryLoginRe.contains(e.target)) {
        categoryLoginRe.style.display = 'none';
      }
    }
  });

  if (headerlogin && categoryLoginRe) {
    headerlogin.addEventListener('click', (e) => {
      e.stopPropagation();
      categoryLoginRe.style.display =
        categoryLoginRe.style.display === 'block' ? 'none' : 'block';
    });
  }
}

 
//  BANNER SLIDER
function initializeHeroSlider() {
  let currentSlide = 0;
  const slides = document.querySelectorAll('.slide');
  if (slides.length === 0) return;

  function updateSlide() {
    slides.forEach((slide, index) => {
      slide.classList.toggle('active', index === currentSlide);
    });
  }

  updateSlide();
  setInterval(() => {
    currentSlide = (currentSlide + 1) % slides.length;
    updateSlide();
  }, 4000);
}

 
// RECOMMENDATION SLIDER
function initRecommendationsSlider() {
    const list = document.querySelector('.recommendations__list');
    if (!list) return;

    // Chỉ lấy card bên trong slider này
    const cards = list.querySelectorAll('.card');
    if (cards.length === 0) return;

    const originalCardCount = cards.length;
    let currentIndex = 0;

    // 1. Nhân bản tất cả các thẻ để tạo hiệu ứng lặp vô tận
    cards.forEach(card => {
        const clone = card.cloneNode(true);
        list.appendChild(clone);
    });

    // 2. Tính toán chiều rộng di chuyển
    // Lấy chiều rộng của thẻ đầu tiên
    const cardWidth = cards[0].offsetWidth; 
    // Lấy khoảng cách 'gap' từ CSS
    const listStyle = window.getComputedStyle(list);
    const gap = parseFloat(listStyle.gap) || 20; // Giả sử gap là 20px nếu không tìm thấy
    
    // Tổng chiều rộng cần di chuyển cho mỗi thẻ (thẻ + khoảng cách)
    const cardMoveWidth = cardWidth + gap;

    // Thời gian chuyển động (phải khớp với CSS, ví dụ 0.5s)
    const transitionTime = 500; // 500ms
    list.style.transition = `transform ${transitionTime}ms ease-in-out`;

    function slideCards() {
        // 3. Di chuyển đến thẻ tiếp theo
        currentIndex++;
        
        const offset = currentIndex * cardMoveWidth;
        list.style.transform = `translateX(-${offset}px)`;

        // 4. Kiểm tra nếu đã đến bản sao đầu tiên
        if (currentIndex === originalCardCount) {
            
            // 5. Chờ cho transition (0.5s) hoàn thành
            setTimeout(() => {
                // 6. Tắt transition và nhảy về vị trí 0
                list.style.transition = 'none'; 
                list.style.transform = `translateX(0px)`;
                currentIndex = 0;

                // 7. Bật lại transition cho lần chạy tiếp theo
                // Dùng một timeout nhỏ để trình duyệt kịp nhận 'none'
                setTimeout(() => {
                    list.style.transition = `transform ${transitionTime}ms ease-in-out`;
                }, 50); 

            }, transitionTime);
        }
    }

    setInterval(slideCards, 3000); // Giữ nguyên thời gian lặp 2 giây của bạn
}

// GIO HANG
function initCartFeature() {
  const cartCount = document.getElementById('cartCount');
  const headerCart = document.querySelector('.header_cart');
  const cartModal = document.getElementById('cartModal');
  const closeCartModal = document.getElementById('closeCartModal');
  const cartItemsContainer = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');
  const closeButtonFooter = document.getElementById('modal-close-btn');
  const btnPrimary = document.querySelector('.btn-primary');

  const newAddressFields = document.getElementById('newAddressFields');
  const addressRadios = document.querySelectorAll('input[name="addressOption"]');
  const recipientName = document.getElementById('recipientName');
  const recipientPhone = document.getElementById('recipientPhone');
  const recipientAddress = document.getElementById('recipientAddress');

  let cart = [];

  // Nút "Thêm vào giỏ"
  // Nút "Thêm vào giỏ" - SỬ DỤNG EVENT DELEGATION
  // Gắn sự kiện cho các container cha chứa các nút
const containers = document.querySelectorAll('.card_container, .recommendations__list');

containers.forEach(container => {
    if (!container) return;

    container.addEventListener('click', (e) => {
        // Kiểm tra xem thứ được click có phải là nút "Thêm vào giỏ" không
        if (e.target.tagName === 'BUTTON' && e.target.closest('.cart_btn')) {
            
            const card = e.target.closest('.card');
            if (!card) return; // Không tìm thấy thẻ cha

            // Lấy thông tin từ thẻ card
            const name = card.querySelector('.card_name').innerText;
            const priceText = card.querySelector('.crad_price').innerText;
            const imgSrc = card.querySelector('.card_img img').src;
            const price = Number(priceText.replace(/\D/g, ''));

            // Thêm vào mảng cart
            cart.push({ name, price, imgSrc });
            updateCartUI();
        }
    });
});

  // Cập nhật giao diện giỏ hàng
  function updateCartUI() {
    if (!cartCount || !cartItemsContainer || !cartTotal) return;
    cartCount.innerText = cart.length;

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `<p class="empty-cart">Giỏ hàng của bạn đang trống</p>`;
      cartTotal.innerText = "0₫";
      return;
    }

    cartItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach((item, idx) => {
      total += item.price;
      const div = document.createElement('div');
      div.classList.add('cart-item');
      div.style.display = 'flex';
      div.style.justifyContent = 'space-between';
      div.style.alignItems = 'center';
      div.style.marginBottom = '10px';

      div.innerHTML = `
        <div style="display:flex; gap:10px; align-items:center;">
          <img src="${item.imgSrc}" style="width:50px; height:50px; object-fit:cover; border-radius:5px;">
          <span>${item.name}</span>
        </div>
        <div>
          <span>${item.price.toLocaleString()}₫</span>
          <button data-index="${idx}" 
            style="margin-left:10px; padding:2px 5px; border:none; 
                   background:black; color:#fff; border-radius:4px; cursor:pointer;">
            Xóa
          </button>
        </div>
      `;
      cartItemsContainer.appendChild(div);
    });

    cartTotal.innerText = total.toLocaleString() + "₫";

    // Xử lý nút xóa
    const deleteButtons = cartItemsContainer.querySelectorAll('button');
    deleteButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const index = btn.getAttribute('data-index');
        cart.splice(index, 1);
        updateCartUI();
      });
    });
  }

  // Hiển thị / ẩn modal giỏ hàng
  if (headerCart && cartModal) {
    headerCart.addEventListener('click', () => {
      cartModal.classList.add('show');
    });

    cartModal.addEventListener('click', (e) => {
      if (e.target === cartModal) {
        cartModal.classList.remove('show');
      }
    });

    if (closeCartModal) {
      closeCartModal.addEventListener('click', () => {
        cartModal.classList.remove('show');
      });
    }

    if (closeButtonFooter) {
      closeButtonFooter.addEventListener('click', () => {
        cartModal.classList.remove('show');
      });
    }
  }

  // Hiển thị form nhập địa chỉ khi chọn "new"
  addressRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.value === 'new' && radio.checked) {
        newAddressFields.style.display = 'flex';
      } else {
        newAddressFields.style.display = 'none';
      }
    });
  });

  // Nút THANH TOÁN
  if (btnPrimary) {
    btnPrimary.addEventListener('click', () => {
      if (cart.length === 0) {
        alert("Giỏ hàng đang trống!");
        return;
      }

      let selectedOption = document.querySelector('input[name="addressOption"]:checked').value;

      if (selectedOption === 'account') {
        alert("Bạn đã chọn địa chỉ từ tài khoản. Tiến hành thanh toán...");
      } else {
        if (!recipientName.value.trim() || !recipientPhone.value.trim() || !recipientAddress.value.trim()) {
          alert("Vui lòng điền đầy đủ thông tin địa chỉ mới!");
          return;
        }
        alert(`Thanh toán thành công!\nHọ tên: ${recipientName.value}\nSĐT: ${recipientPhone.value}\nĐịa chỉ: ${recipientAddress.value}`);
      }

      // Xóa giỏ hàng sau khi thanh toán
      cart = [];
      updateCartUI();
      cartModal.classList.remove('show');
    });
  }
}
 
// LOCATION
function initLocationSelector() {
  const headerLocation = document.querySelector('.header_location');
  const citySelector = document.getElementById('citySelector');
  const closeBtn = document.getElementById('closeBtn');
  const cityItems = document.querySelectorAll('.city-item');
  const cityInput = document.getElementById('cityInput');

  if (!headerLocation || !citySelector) return;

  // Hiển thị dropdown khi click vào "Địa chỉ"
  headerLocation.addEventListener('click', (e) => {
    e.stopPropagation();
    citySelector.style.display =
      citySelector.style.display === 'block' ? 'none' : 'block';
  });

  // Click ra ngoài sẽ đóng dropdown
  document.addEventListener('click', (e) => {
    if (!citySelector.contains(e.target) && !headerLocation.contains(e.target)) {
      citySelector.style.display = 'none';
    }
  });

  // Nút đóng dropdown
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      citySelector.style.display = 'none';
    });
  }

  // Chọn thành phố
  cityItems.forEach((item) => {
    item.addEventListener('click', () => {
      cityItems.forEach((i) => i.classList.remove('selected'));
      item.classList.add('selected');
      headerLocation.innerHTML = `<i class='bxr bx-location-alt'></i> ${item.textContent} <i class='bxr bx-chevron-down'></i>`;
      citySelector.style.display = 'none';
    });
  });

  // Lọc thành phố theo input
  if (cityInput) {
    cityInput.addEventListener('input', () => {
      const filter = cityInput.value.toLowerCase();
      cityItems.forEach((item) => {
        item.style.display = item.textContent.toLowerCase().includes(filter)
          ? 'block'
          : 'none';
      });
    });
  }
}

 
// ===== MẢNG SẢN PHẨM =====
const products = [
  {
    id: 1,
    name: "Điện thoại iPhone 16 Pro Max 256GB",
    category: "phone",
    price: 30590000,
    image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:300:300/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max.png",
    new: "Hàng mới về",
    rating: 4.9
  },
  {
    id: 2,
    name: "iPhone Air 256GB | Chính hãng",
    category: "phone",
    price: 31990000,
    image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:300:300/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone_air-3_2.jpg",
    new: "Hàng mới về",
    rating: 5
  },
  {
    id: 3,
    name: "OPPO Reno14 F 5G 8GB 256GB",
    category: "phone",
    price: 10300000,
    image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:300:300/q:90/plain/https://cellphones.com.vn/media/catalog/product/o/p/oppo-reno14-f-w.jpg",
    new: "Hàng mới về",
    rating: 5
  },
  {
    id: 4,
    name: "Xiaomi 15T 5G 12GB 512GB",
    category: "phone",
    price: 14990000,
    image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:300:300/q:90/plain/https://cellphones.com.vn/media/catalog/product/x/i/xiaomi-15t-5g-22.jpg",
    new: "Hàng mới về",
    rating: 5
  },
  {
    id: 5,
    name: "Sạc Titan 1A CB02 dành cho iPhone kèm cáp Lightning Cũ JU.117.W-C",
    category: "accessory",
    price: 300000,
    image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/1/5/1547612953480_1.jpg",
    new: "Hàng mới về",
    rating: 4
  },
  {
    id: 6,
    name: "Ốp lưng iPhone 14 Pro Apple Silicone Case hỗ trợ sạc Magsafe",
    category: "accessory",
    price: 750000,
    image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/o/p/op-lung-iphone-14-pro-apple-silicone-case-with-magsafe.png",
    new: "Hàng mới về",
    rating: 4.5
  },
   {
    id: 7,
    name: "Ốp lưng iPhone 14 Pro Apple Silicone Case hỗ trợ sạc Magsafe",
    category: "accessory",
    price: 750000,
    image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/o/p/op-lung-iphone-14-pro-apple-silicone-case-with-magsafe.png",
    new: "Hàng mới về",
    rating: 4.5
  },
  {
    id: 8,
    name: "Ốp lưng iPhone 17 Pro Max Apple Techwoven With Magsafe",
    category: "accessory",
    price: 1670000,
    image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/o/p/op-lung-iphone-17-pro-max-apple-techwoven-with-magsafe.png",
    new: "Hàng mới về",
    rating: 5
  },
  {
    id: 9,
    name: "Ốp lưng iPhone 17 Pro Max Pitaka Ultra Slim",
    category: "accessory",
    price: 2000000,
    image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/e/text_ng_n_-_2025-09-10t140948.050_1.png",
    new: "Hàng mới về",
    rating: 5
  },
   {
    id: 10,
    name: "OPPO Find X9 Pro 16GB/512GB",
    category: "phone",
    price: 2000000,
    image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/o/p/oppo_find_x9_pro_16gb_512gb.jpg",
    new: "Hàng sắp về",
    rating: 5
  },
   {
    id: 11,
    name: "Xiaomi 15 Ultra 5G 16GB 1TB",
    category: "phone",
    price: 31990000,
    image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/p/h/photo_2025-04-16_11-45-37.jpg",
    new: "Hàng sắp về",
    rating: 5
  },
];

let currentPage = 1;
const itemsPerPage = 10; // tong so san pham tren 1 trang

// Mảng gốc giữ nguyên tất cả sản phẩm
let currentProducts = [...products];

// ===== HÀM HIỂN THỊ SẢN PHẨM =====
function displayProducts(page = 1, productList = products) {
  const container = document.querySelector(".card_container");
  container.innerHTML = "";

  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedItems = productList.slice(start, end);

  paginatedItems.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="card_img"><img src="${p.image}" alt="${p.name}"></div>
      <div class="card_info">
          <div class="card_name">${p.name}</div>
          <div class="card_new">${p.new}</div>
          <div class="crad_price">${p.price.toLocaleString()}đ</div>
          <div class="card_evaluate"><div class="crad_rating">⭐${p.rating}</div></div>
          <div class="cart_btn"><button>Thêm vào giỏ hàng</button></div>
      </div>`;
    container.appendChild(card);
  });

  document.getElementById("pageInfo").textContent = 
    `Trang ${page} / ${Math.ceil(productList.length / itemsPerPage)}`;
}

// ===== PHÂN TRANG =====
document.getElementById("prevPage").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    displayProducts(currentPage, currentProducts);
  }
});

document.getElementById("nextPage").addEventListener("click", () => {
  if (currentPage < Math.ceil(currentProducts.length / itemsPerPage)) {
    currentPage++;
    displayProducts(currentPage, currentProducts);
  }
});

// ===== NÚT TÌM KIẾM =====
document.getElementById("btnSearch").addEventListener("click", () => {
  const keyword = document.getElementById("searchName").value.toLowerCase();
  const category = document.getElementById("searchCategory").value;
  const minPrice = parseFloat(document.getElementById("minPrice").value) || 0;
  const maxPrice = parseFloat(document.getElementById("maxPrice").value) || Infinity;

  // Lọc sản phẩm theo nhiều điều kiện
  const filtered = products.filter(p => {
    const matchName = p.name.toLowerCase().includes(keyword);
    const matchCategory = category ? p.category === category : true;
    const matchPrice = p.price >= minPrice && p.price <= maxPrice;
    return matchName && matchCategory && matchPrice;
  });

  // Nếu có kết quả thì hiển thị
  if (filtered.length > 0) {
    currentProducts = filtered;
    currentPage = 1;
    displayProducts(currentPage, currentProducts);
  } else {
    document.querySelector(".card_container").innerHTML = "<p>Không tìm thấy sản phẩm phù hợp!</p>";
    document.getElementById("pageInfo").textContent = "";
  }
});

// ===== NÚT HIỂN THỊ LẠI TOÀN BỘ (XÓA TÌM KIẾM) =====
document.getElementById("btnReset").addEventListener("click", () => {
  currentProducts = [...products];
  currentPage = 1;
  document.getElementById("searchName").value = "";
  document.getElementById("searchCategory").value = "";
  document.getElementById("minPrice").value = "";
  document.getElementById("maxPrice").value = "";
  displayProducts(currentPage);
});

// ===== HIỂN THỊ LẦN ĐẦU =====
displayProducts(currentPage);


  