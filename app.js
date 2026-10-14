document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");

  if (!app) {
    console.error('Missing element: id="app"');
    return;
  }

  app.innerHTML = `
    <h2>RabTech Product Dashboard</h2>

    <input
      type="text"
      id="searchInput"
      placeholder="Search products..."
    />

    <select id="categorySelect">
      <option value="all">All Categories</option>
    </select>

    <select id="sortSelect">
      <option value="default">Default Order</option>
      <option value="low">Price: Low to High</option>
      <option value="high">Price: High to Low</option>
      <option value="az">Name: A to Z</option>
    </select>

    <p id="status">Loading products...</p>
    <div id="products"></div>
  `;

  const searchInput = document.getElementById("searchInput");
  const categorySelect = document.getElementById("categorySelect");
  const sortSelect = document.getElementById("sortSelect");
  const status = document.getElementById("status");
  const productsContainer = document.getElementById("products");

  let allProducts = [];

  function displayProducts() {
    const searchText = searchInput.value.toLowerCase();
    const selectedCategory = categorySelect.value;
    const sortValue = sortSelect.value;
    let filteredProducts = allProducts.filter(product => {
      const matchesSearch =
        product.title.toLowerCase().includes(searchText);

      const matchesCategory =
        selectedCategory === "all" ||
        product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    if (sortValue === "low") {
      filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortValue === "high") {
      filteredProducts.sort((a, b) => b.price - a.price);
    } else if (sortValue === "az") {
      filteredProducts.sort((a, b) =>
        a.title.localeCompare(b.title)
      );
    }

    productsContainer.innerHTML = "";

    if (filteredProducts.length === 0) {
      productsContainer.textContent = "No products found.";
      return;
    }

    filteredProducts.forEach(product => {
      const card = document.createElement("article");
      card.style.border = "1px solid #ccc";
      card.style.padding = "12px";
      card.style.margin = "10px";
      card.style.borderRadius = "8px";

      const image = document.createElement("img");
      image.src = product.image;
      image.alt = product.title;
      image.style.width = "100px";
      image.style.height = "100px";
      image.style.objectFit = "contain";

      const title = document.createElement("h3");
      title.textContent = product.title;

      const price = document.createElement("p");
      price.textContent = 'Price: $$ {product.price};'

      const category = document.createElement("p");
      category.textContent = 'Category: ${product.category};'

      card.append(image, title, price, category);
      productsContainer.appendChild(card);
    });
  }

  async function loadProducts() {
    try {
      status.textContent = "Loading products...";

      allProducts = await fetchProducts();

      const categories = [
        ...new Set(allProducts.map(product => product.category))
      ];

      categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
      });

      status.textContent = '${allProducts.length} products loaded.;'
      displayProducts();

    } catch (error) {
      console.error("Loading error:", error);
      status.textContent =
        "Unable to load products. Please check your internet connection.";
    }
  }

  searchInput.addEventListener("input", displayProducts);
  categorySelect.addEventListener("change", displayProducts);
  sortSelect.addEventListener("change", displayProducts);

  loadProducts();
});