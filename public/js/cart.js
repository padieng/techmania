document.addEventListener('DOMContentLoaded', () => {
    console.log("✅ cart.js loaded");
  
    const container = document.getElementById('cart-items');
  
    Promise.all([
      fetch('/api/cart').then(res => res.json()),
      fetch('/api/products').then(res => res.json())
    ])
      .then(([cart, products]) => {
        if (cart.length === 0) {
          container.innerHTML = '<p>Your cart is empty.</p>';
          return;
        }
  
        container.innerHTML = '';
  
        cart.forEach(item => {
          const product = products.find(p => p.id === item.productId);
  
          const div = document.createElement('div');
          div.classList.add('cart-item');
          div.innerHTML = `
            <img src="${product.image_url}" alt="${product.name}" />
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p><strong>Quantity:</strong> ${item.quantity}</p>
            <button data-id="${item.productId}">Remove</button>
          `;
          container.appendChild(div);
        });
  
        container.querySelectorAll('button').forEach(button => {
          button.addEventListener('click', () => {
            const productId = button.getAttribute('data-id');
            fetch('/api/cart/' + productId, {
              method: 'DELETE'
            })
              .then(res => res.json())
              .then(data => {
                alert(data.message);
                location.reload();
              });
          });
        });
      })
      .catch(err => {
        console.error("❌ Error loading cart:", err);
        container.innerHTML = '<p>Failed to load cart.</p>';
      });
  
    // ✅ Checkout button logic
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        fetch('/api/cart/checkout', { method: 'POST' })
          .then(res => res.json())
          .then(data => {
            alert(data.message);
            location.reload();
          });
      });
    }
  });
  