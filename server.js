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

app.listen(port, () => {
  console.log(`Mock API Generator running at http://localhost:${port}`);
});

let savedJson = {}; // This will hold the last POSTed JSON

// POST and GET /user-defined
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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.get('/cloudjunction/child-record-deletion/orders-details/:orderId', (req, res) => {
  const { orderId } = req.params;

  const mockResponse = {
    orderDetail: [
      {
        id: "a3c7yue6-3456-7890-1234-567111123986",
        qty: 34,
        name: "Product B",
        price: 23,
        orderId,
        product: {
          productId: "102"
        }
      },
      {
        id: "b3c7yue6-3456-7890-1234-567111123986",
        qty: 5,
        name: "Product C",
        price: 243,
        orderId,
        product: {
          productId: "103"
        }
      },
      {
        id: "c3c4due6-3456-7890-1234-567111123904",
        qty: 6,
        name: "Product E",
        price: 33,
        orderId,
        product: {
          productId: "104"
        }
      }
    ],
    id: orderId
  };

  res.json(mockResponse);
});

