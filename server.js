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

  // Predefined line items for different orders
  const orderLineItems = {
    "order-01": [
      { id: "order-01-line-01", qty: 2, name: "Laptop", price: 1200, orderId, product: { productId: "P-001" } },
      { id: "order-01-line-02", qty: 1, name: "Mouse", price: 25, orderId, product: { productId: "P-002" } }
    ],
    "order-02": [
      { id: "order-02-line-01", qty: 3, name: "Monitor", price: 300, orderId, product: { productId: "P-003" } },
      { id: "order-02-line-02", qty: 2, name: "Keyboard", price: 50, orderId, product: { productId: "P-004" } }
    ],
    "order-03": [
      { id: "order-03-line-01", qty: 1, name: "Printer", price: 200, orderId, product: { productId: "P-005" } }
    ],
    "order-04": [
      { id: "order-04-line-01", qty: 5, name: "USB-C Cable", price: 10, orderId, product: { productId: "P-006" } }
    ],
    "order-05": [
      { id: "order-05-line-01", qty: 2, name: "Desk Chair", price: 150, orderId, product: { productId: "P-007" } },
      { id: "order-05-line-02", qty: 1, name: "Desk Lamp", price: 40, orderId, product: { productId: "P-008" } }
    ]
  };

  // Pick line items based on orderId, or fallback if not found
  const mockResponse = {
    orderDetail: orderLineItems[orderId] || [
      { id: `${orderId}-line-01`, qty: 1, name: "Default Item", price: 0, orderId, product: { productId: "P-000" } }
    ]
  };

  res.json(mockResponse);
});



// Only one listen call here
app.listen(port, () => {
  console.log(`Mock API Generator running on http://localhost:${port}`);
});
