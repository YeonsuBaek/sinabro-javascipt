import test from './test.json?raw';

export function getProductsHTML(product, count = 0) {
  return `
    <div class='product' data-product-id="${product.id}">
      <img src="${product.images[0]}" alt="Image of ${product.name}" />
      <p>${product.name}</p>
      <div class='flex items-center justify-between'>
        <span>Price: ${product.regularPrice}</span>
        <div>
          <button type='button' class='disabled:cursor-not-allowed disabled:opacity-50 btn-decrease bg-green-200 hover:bg-green-300 text-green-800 py-1 px-3 rounded-full'>-</button>
          <span class='cart-count text-green-800'>${
            count === 0 ? '' : count
          }</span>
          <button type='button' class='btn-increase bg-green-200 hover:bg-green-300 text-green-800 py-1 px-3 rounded-full'>+</button>
        </div>
      </div>
    </div>
  `;
}

async function getProducts() {
  if (process.env.NODE_ENV === 'development') {
    return JSON.parse(test);
  } else {
    const response = await fetch(
      'https://learnwitheunjae.dev/api/sinabro-js/ecommerce'
    );
    return await response.json();
  }
}

export async function setupProducts({ container }) {
  const products = await getProducts();
  const productMap = {};
  products.forEach((product) => {
    productMap[product.id] = product;
  });

  document.querySelector('#products').innerHTML = products
    .map((product) => getProductsHTML(product))
    .join('');

  const updateCount = ({ productId, count }) => {
    const productElement = container.querySelector(
      `.product[data-product-id='${productId}']`
    );
    const cartCountElement = productElement.querySelector('.cart-count');
    cartCountElement.innerHTML = count;
    if (count === 0) {
      cartCountElement.innerHTML = '';
    }
  };

  return { updateCount };
}
