/* Import class Product from rootDir/models/product.js
to access Product.fetchAll() public static void method
without instantiation */
const Product = require('../models/product');

/* Temp Cart items database .json file */
const Cart = require('../models/cart');

/* 
Export a callback function to be used by 
router.get('/products', shopController.getProducts); in routes/shop.js 
for rendering rootDir/views/shop/product-list.ejs
*/
exports.getProducts = (req, res, next) => {
  /* This allows us to hook into this Funnel 
  through which the HTTP request to send */
  console.log(`Hosting of views/shop/product-list.ejs\nthrough router.get is in progress\nfor http://localhost:3005/products\n`);

  /* 
  using 'public static void method' Product.fetchAll(cb): void
  to retrieve products[{}] stored in data/products.json file 
  */
  Product.fetchAll(products => {
    /* Calling back products stored in ./routes/shop.js
    router.get('/products', shopController.getProducts); */
    console.log(`routes/shop.js\nshopController.getProducts:`);
    console.log(products);
    console.log(`\n`);

    /*
    Main Node rootDir/app.js implements EJS Templating Engine
    app.set('view engine', 'ejs');
    within this module => res.render() EJS templates
    rendering rootDir/views/shop/product-list.ejs template
    */
    res.render('shop/product-list', {
      path: req.url ? req.url : '/products',
      pageTitle: 'All Products',
      prods: products,
      /* These attributes are ONLY necessary when using Handlebars
      hasProducts: products.length > 0,
      activeShop: true,
      productCSS: true
      */
    });
  });
};

/* 
Export a callback function to be used by 
router.get('/products/:productId', shopController.getProductDetail); in routes/shop.js 
for rendering rootDir/views/product-detail.ejs template via
http://localhost:3005/products/productUniqueId
*/
exports.getProductDetail = (req, res, next) => {
  /* Extracting product Id using Server-side V8 Engine built-in req.params method 
  We can access productId here cuz we use productId as a param inside rootDir/routes/shop.js
  */
  const productId = req.params.productId;
  console.log(`http://localhost:3005/products/productUniqueId\nreq.params.productId Express Route is up`);
  console.log(`req.params.productId from rootDir/routes/shop.js is being console logged:`);
  console.log(productId);
  console.log(`\n`);
  
  /* Instead of just logging productId, wanna also log product{}
  Using public static void method Product.findById() without instantiation 
  Product.findById(productId, callbackToGetProduct)
  */
  Product.findById(productId, product => {
    console.log(`product found using public static void method without class instantiation\nProduct.findById(productId, product => {...})`);
    console.log(product);
    console.log(`\n`);
    /* Rendering rootDir/views/shop/product-detail.ejs view */
    res.render('shop/product-detail', {
      /* product = the product retrieved via public static void method Product.findById() defined in rootDir/models/product.js */
      path: req.url ? req.url : '/products',
      product: product,
      pageTitle: product.title
    });
  });
};

/* 
Export a callback function to be used by 
router.get('/', shopController.getIndex); in routes/shop.js 
for rendering rootDir/views/shop/index.ejs
*/
exports.getIndex = (req, res, next) => {
  console.log(`Hosting of views/shop/index.ejs\nthrough router.get is in progress\nfor http://localhost:3005/\n`);
  /* 
  using 'public static void method' Product.fetchAll(cb): void
  to retrieve products[{}] stored in data/products.json file 
  */
  Product.fetchAll(products => {
    /* Calling back products stored in ./routes/shop.js
    router.get('/', shopController.getIndex); */
    console.log(`routes/shop.js\nshopController.getIndex:`);
    console.log(products);
    console.log(`\n`);

    /*
    Main Node rootDir/app.js implements EJS Templating Engine
    app.set('view engine', 'ejs');
    within this module => res.render() EJS templates
    rendering rootDir/views/shop/index.ejs template
    */
    res.render('shop/index', {
      path: req.url ? req.url : '/',
      pageTitle: 'Shop',
      prods: products,
      /* These attributes are ONLY necessary when using Handlebars
      hasProducts: products.length > 0,
      activeShop: true,
      productCSS: true
      */
    });
  });
};

/* 
Export a callback function to be used by 
router.get('/cart', shopController.getCart); in routes/shop.js 
for rendering rootDir/views/shop/cart.ejs 
*/
exports.getCart = (req, res, next) => {
  console.log(`Hosting of views/shop/cart.ejs through router.get is in progress\nfor http://localhost:3005/cart\n`);
  
  /* i. Invoke Cart.getCart(cb) that accepts a pass-in callback function, we can then declare cart() => {} arrow function here */
  Cart.getCart((cart) => {
    /* ii. Needing more product info too */
    Product.fetchAll((fetchedProducts) => {
      /* iii. Prepare to store each matched product{} into empty cartProducts[]
      Thus, after cartProducts.push(eachProduct) below 
      We'll have a cartProducts[{}] for rendering on Frontend */
      const cartProducts = [];
      /* iv. for loop of each product */
      for (eachProduct of fetchedProducts) {
        /* v. Matching eachProduct.id */
        const cartProductData = cart.products.find(retrievedProduct => retrievedProduct.id === eachProduct.id);

        /* vi. Check whether this product is in cart */
        if (cartProductData) {
          /* vii. push for-looped single product{} into cartProducts[] above */
          cartProducts.push({
            productData: eachProduct, 
            qty: cartProductData.qty
          });
        }
      }
      /* viii. Sending cartProducts[{},{}] as a key-pair to our view */
      res.render('shop/cart', {
        path: req.url ? req.url : '/cart',
        pageTitle: 'Your Cart',
        products: cartProducts
      })
    });
  });
};

/* 
Export a callback function to be used by 
router.post('/cart', ); in routes/shop.js
for Accepting product attributes as req.body.fields via POST request 
*/
exports.postCart = (req, res, next) => {
  /* req.body.productId because rootDir/views/shop/product-detail.ejs <input type="hidden" name="productId" value="<%= product.id %>"> */
  console.log(`Hosting of POST request handler for http://localhost:3005/cart\nreq.body.productId:`);
  const prodId = req.body.productId;
  /* Retrieve a product from products database */
  Product.findById(prodId, (retrievedProduct) => {
    /* rootDir/models/cart.js 
    public static void method Cart.addProduct(id, productPrice) */
    Cart.addProduct(prodId, retrievedProduct.price);
  });
  // console.log(prodId);
  // console.log(`\n`);
  /* After POST prodId (req.body.productId) to Backend */
  res.status(301).redirect('/cart');
};

/*
Export a callback function to be used by routes/shop.js for deleting
a specific product inside Cart */
exports.postCartDeleteProduct = (req, res, next) => {
  /* Need id & productPrice as pass-in params 
  when invoking Cart.deleteProduct(id, productPrice) */
  const prodId = req.body.productId;
  /* Before finding out the specific product's price
  Let's first find out the exact product using prodId by
  Invoking Product.findById(id, cb) 
  using this cb callback function to extend logic for finding out
  product.price */
  Product.findById(prodId, (retrievedProduct) => {
    Cart.deleteProduct(prodId, retrievedProduct.price);
    /* After deleting the specific product inside cart */
    res.status(301).redirect('/cart');
  });
};

/* 
Export a callback function to be used by routes/shop.js for 
rendering rootDir/views/shop/orders.ejs
*/
exports.getOrders = (req, res, next) => {
  console.log(`Hosting of views/shop/orders.ejs through router.get is in progress\nfor http://localhost:3005/orders\n`);
  /*
    Main Node rootDir/app.js implements EJS Templating Engine
    app.set('view engine', 'ejs');
    within this module => res.render() EJS templates
    rendering rootDir/views/shop/orders.ejs template
  */
  res.render('shop/orders', {
    path: req.url ? req.url : '/orders',
    pageTitle: 'Your Orders',
  })
};

/* 
Export a callback function to be used by routes/shop.js for 
rendering rootDir/views/shop/checkout.ejs
*/
exports.getCheckout = (req, res, next) => {
  console.log(`Hosting of views/shop/checkout.ejs through router.get is in progress\nfor http://localhost:3005/checkout\n`);
  /*
    Main Node rootDir/app.js implements EJS Templating Engine
    app.set('view engine', 'ejs');
    within this module => res.render() EJS templates
    rendering rootDir/views/shop/checkout.ejs template
  */
  res.render('shop/cart', {
    path: req.url ? req.url : '/checkout',
    pageTitle: 'Checkout',
  })
};
