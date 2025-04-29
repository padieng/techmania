document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('product-detail');
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');

  fetch('/api/products/' + productId)
    .then(res => res.json())
    .then(product => {
      container.innerHTML = `
        <img src="${product.image_url}" alt="${product.name}" />
        <h2>${product.name}</h2>
        <p>${product.description}</p>
        <p class="price">$${product.price.toFixed(2)}</p>
        <p><strong>Category:</strong> ${product.category}</p>
      `;
    })
    .catch(err => {
      container.innerHTML = "<p>Product not found.</p>";
    });
});
