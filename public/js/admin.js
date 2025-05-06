const UNSPLASH_ACCESS_KEY = '-RAfjBg9NllH_b-9gbRHMoUG1BS85RA7zmUrRSuR-SA';

// Fetch an Unsplash image based on product name
async function fetchUnsplashImage(query) {
  const res = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&client_id=${UNSPLASH_ACCESS_KEY}`);
  const data = await res.json();
  return data.results[0]?.urls?.small || '';
}

// Load and display all products
fetch('/api/products')
  .then(res => res.json())
  .then(products => {
    const tbody = document.querySelector('#admin-product-table tbody');
    tbody.innerHTML = '';
    products.forEach(p => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${p.id}</td>
        <td>${p.name}</td>
        <td>${p.category}</td>
        <td>$${p.price.toFixed(2)}</td>
        <td><a href="edit.html?id=${p.id}">Edit</a></td>
      `;
      tbody.appendChild(row);
    });
  });

// Add a single product
document.getElementById('add-product-form').addEventListener('submit', async e => {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const description = document.getElementById('description').value;
  const category = document.getElementById('category').value;
  const price = parseFloat(document.getElementById('price').value);

  let image_url = document.getElementById('image_url').value;
  if (!image_url) {
    image_url = await fetchUnsplashImage(name);
    if (!image_url) {
      alert('No image found for that product!');
      return;
    }
  }

  const res = await fetch('/api/admin/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, description, category, price, image_url })
  });

  const data = await res.json();
  alert(data.message || 'Product added!');
  location.reload();
});

// Bulk upload from JSON textarea
document.getElementById('upload-btn').addEventListener('click', async () => {
  const textarea = document.getElementById('json-upload');
  let products;

  try {
    products = JSON.parse(textarea.value);
  } catch (err) {
    return alert('Invalid JSON format. Please check your input.');
  }

  const res = await fetch('/api/admin/products/bulk', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(products)
  });

  const data = await res.json();
  alert(data.message || 'Bulk upload complete!');
  location.reload();
});
