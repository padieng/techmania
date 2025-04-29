document.addEventListener('DOMContentLoaded', () => {
  const cartCountEl = document.getElementById('cart-count');
  const container = document.getElementById('product-container');
  const searchBox = document.getElementById('search-box');
  const categoryFilter = document.getElementById('category-filter');

  let allProducts = [];

  function updateCartCount() {
    fetch('/api/cart')
      .then(res => res.json())
      .then(cart => {
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountEl.textContent = count;
      });
  }

  function renderProducts(products) {
    container.innerHTML = ''; // clear out old product cards

    products.forEach(product => {
      const div = document.createElement('div');
      div.classList.add('product');
      div.innerHTML = `
        <img src="${product.image_url}" alt="${product.name}" />
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <p class="price">$${product.price.toFixed(2)}</p>
        <a href="product.html?id=${product.id}">View Details</a><br>
        <button data-id="${product.id}">Add to Cart</button>
      `;
      container.appendChild(div);
    });

    container.querySelectorAll('button').forEach(button => {
      button.addEventListener('click', () => {
        fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: button.dataset.id })
        }).then(() => updateCartCount());
      });
    });
  }

  function filterProducts() {
    const search = searchBox.value.toLowerCase();
    const category = categoryFilter.value;

    const filtered = allProducts.filter(p =>
      p.name.toLowerCase().includes(search) &&
      (category === "" || p.category === category)
    );

    renderProducts(filtered);
  }

  updateCartCount();

  fetch('/api/products')
    .then(res => res.json())
    .then(products => {
      allProducts = products;
      renderProducts(products);
    });

  // ✅ Attach listeners ONLY ONCE
  searchBox.addEventListener('input', filterProducts);
  categoryFilter.addEventListener('change', filterProducts);
});
