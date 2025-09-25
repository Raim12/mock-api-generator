const express = require('express');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());

// Load mock routes from JSON file
const mockRoutes = JSON.parse(fs.readFileSync('mockRoutes.json', 'utf8'));

// Register routes dynamically
Object.entries(mockRoutes).forEach(([route, methods]) => {
  Object.entries(methods).forEach(([method, response]) => {
    app[method.toLowerCase()](route, (req, res) => {
      const finalResponse = JSON.parse(JSON.stringify(response));
      if (finalResponse.timestamp === "now") {
        finalResponse.timestamp = new Date().toISOString();
      }
      res.json(finalResponse);
    });
  });
});

// Root health check
app.get('/', (req, res) => {
  res.send('Mock API Generator is running!');
});

// Dynamic POST + GET Endpoint to store user JSON
let savedJson = {}; // This will hold the last POSTed JSON

app.route('/user-defined')
  .post((req, res) => {
    savedJson = req.body;
    res.json({ message: 'Data received successfully', data: savedJson });
  })
  .get((req, res) => {
    if (Object.keys(savedJson).length === 0) {
      return res.status(404).json({ message: 'No data available yet. Please POST first.' });
    }
    res.json(savedJson);
  });

// Dynamic order details route
app.get('/cloudjunction/child-record-deletion/orders-details/:orderId', (req, res) => {
  const { orderId } = req.params;

  const mockResponse = {
    orderDetail: [
      {
        id: "order-01-line-01",
        qty: 22,
        name: "Product B",
        price: 78,
        orderId,
        product: { productId: "102" }
      },
      {
        id: "order-01-line-02",
        qty: 22,
        name: "Product B",
        price: 78,
        orderId,
        product: { productId: "102" }
      },
      {
        id: "order-01-line-03",
        qty: 22,
        name: "Product B",
        price: 78,
        orderId,
        product: { productId: "102" }
      },
      {
        id: "order-01-line-04",
        qty: 22,
        name: "Product B",
        price: 78,
        orderId,
        product: { productId: "102" }
      },
      {
        id: "order-01-line-05",
        qty: 22,
        name: "Product B",
        price: 78,
        orderId,
        product: { productId: "102" }
      },
      {
        id: "order-01-line-06",
        qty: 22,
        name: "Product B",
        price: 78,
        orderId,
        product: { productId: "102" }
      },
      {
        id: "order-01-line-07",
        qty: 22,
        name: "Product B",
        price: 78,
        orderId,
        product: { productId: "102" }
      },
      {
        id: "order-01-line-08",
        qty: 22,
        name: "Product B",
        price: 78,
        orderId,
        product: { productId: "102" }
      },
      {
        id: "order-01-line-09",
        qty: 22,
        name: "Product B",
        price: 78,
        orderId,
        product: { productId: "102" }
      },
      {
        id: "order-01-line-10",
        qty: 22,
        name: "Product B",
        price: 78,
        orderId,
        product: { productId: "102" }
      }
    ]
  };

  res.json(mockResponse);
});


// Only one listen call here
app.listen(port, () => {
  console.log(`Mock API Generator running on http://localhost:${port}`);
});
