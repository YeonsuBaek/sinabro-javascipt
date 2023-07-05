import { getProductsHTML, setupProducts } from './products';

function findElement(statingElement, selector) {
  let currentElement = statingElement;

  while (currentElement) {
    if (currentElement.matches(selector)) {
      return currentElement;
    }
    currentElement = currentElement.parentElement;
  }

  return null;
}

function sumAllCounts(countMap) {
  return Object.values(countMap).reduce((total, current) => {
    return (total += current);
  }, 0);
}

async function main() {
  const { updateCount } = await setupProducts({
    container: document.querySelector('#products'),
  });

  const countMap = {};

  const updateCart = () => {
    const productIds = Object.keys(countMap);

    document.querySelector('.cart_items').innerHTML = productIds
      .map((productId) => {
        const productInCart = productMap[productId];
        if (countMap[productId] === 0) return '';
        return getProductsHTML(productInCart, countMap[productId]);
      })
      .join('');

    document.querySelector('.total_count').innerHTML = `(${sumAllCounts(
      countMap
    )})`;
  };

  const increaseCount = (productId) => {
    if (countMap[productId] === undefined) {
      countMap[productId] = 0;
    }
    countMap[productId] += 1;
    updateCount({ productId, count: countMap[productId] });
    updateCart();
  };
  const decreaseCount = (productId) => {
    if (countMap[productId] === undefined) {
      countMap[productId] = 0;
    }
    countMap[productId] -= 1;
    updateCount({ productId, count: countMap[productId] });
    updateCart();
  };

  document.querySelector('#products').addEventListener('click', (event) => {
    const targetElement = event.target;
    const productElement = findElement(targetElement, '.product');
    const productId = productElement.getAttribute('data-product-id');

    if (
      targetElement.matches('.btn-decrease') ||
      targetElement.matches('.btn-increase')
    ) {
      if (targetElement.matches('.btn-decrease')) {
        decreaseCount(productId);
      } else if (targetElement.matches('.btn-increase')) {
        increaseCount(productId);
      }
    }
  });

  document.querySelector('.cart_items').addEventListener('click', () => {
    const targetElement = event.target;
    const productElement = findElement(targetElement, '.product');
    const productId = productElement.getAttribute('data-product-id');

    if (
      targetElement.matches('.btn-decrease') ||
      targetElement.matches('.btn-increase')
    ) {
      if (targetElement.matches('.btn-decrease')) {
        decreaseCount(productId);
      } else if (targetElement.matches('.btn-increase')) {
        increaseCount(productId);
      }
    }
  });

  document.querySelector('.btn-cart').addEventListener('click', () => {
    document.body.classList.add('displaying-cart');
  });

  document.querySelector('.btn-close-cart').addEventListener('click', () => {
    document.body.classList.remove('displaying-cart');
  });

  document.querySelector('.cart-dimmed-bg').addEventListener('click', () => {
    document.body.classList.remove('displaying-cart');
  });
}

main();
