const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

// Load product data into form
fetch(`/api/products/${productId}`)
  .then(res => res.json())
  .then(product => {
    document.getElementById('product-id').value = product.id;
    document.getElementById('name').value = product.name;
    document.getElementById('description').value = product.description;
    document.getElementById('category').value = product.category;
    document.getElementById('price').value = product.price;
    document.getElementById('image_url').value = product.image_url;
  });

document.getElementById('edit-product-form').addEventListener('submit', e => {
  e.preventDefault();

  const updatedProduct = {
    name: document.getElementById('name').value,
    description: document.getElementById('description').value,
    category: document.getElementById('category').value,
    price: parseFloat(document.getElementById('price').value),
    image_url: document.getElementById('image_url').value
  };

  fetch(`/api/admin/products/${productId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedProduct)
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message || 'Update successful');
      window.location.href = 'admin.html';
    });
});
