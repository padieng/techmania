// Add a new single product
document.getElementById('add-product-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const product = {
    name: document.getElementById('name').value,
    description: document.getElementById('description').value,
    category: document.getElementById('category').value,
    price: parseFloat(document.getElementById('price').value),
    image_url: document.getElementById('image_url').value
  };

  fetch('/api/admin/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product)
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      loadAdminTable(); // Reload product table after adding
      document.getElementById('add-product-form').reset(); // Clear form
    });
});

// Bulk upload multiple products from JSON
document.getElementById('upload-btn').addEventListener('click', () => {
  try {
    const products = JSON.parse(document.getElementById('json-upload').value);

    fetch('/api/admin/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ products })
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message);
        loadAdminTable(); // Reload after upload
        document.getElementById('json-upload').value = ''; // Clear textarea
      });
  } catch (error) {
    alert('❌ Invalid JSON format. Please fix and try again.');
  }
});

// Load all products into Admin Table
function loadAdminTable() {
  fetch('/api/products')
    .then(res => res.json())
    .then(products => {
      const tableBody = document.querySelector('#admin-product-table tbody');
      tableBody.innerHTML = '';

      products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${product.id}</td>
          <td>${product.name}</td>
          <td>${product.category}</td>
          <td>$${product.price.toFixed(2)}</td>
          <td><a href="edit.html?id=${product.id}">Edit</a></td>
        `;
        tableBody.appendChild(row);
      });
    });
}

// Initial load when page opens
loadAdminTable();
