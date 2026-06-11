import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'street-legal-v2-api' });
});

// Outfits & Social
app.use('/api/v1/outfits', (req, res) => {
  res.json({ message: 'Outfits API endpoint' });
});

app.use('/api/v1/feed', (req, res) => {
  res.json({ message: 'Social feed endpoint' });
});

// Inventory
app.get('/api/v1/suppliers/:supplierId/inventory', (req, res) => {
  res.json({
    status: 200,
    data: {
      products: [
        { id: '1', name: 'Vintage Y2K Denim', basePrice: 4500, status: 'AVAILABLE', imageUrl: '/mock.jpg' }
      ]
    }
  });
});

app.post('/api/v1/inventory', (req, res) => {
  const payload = req.body;
  // Mock upload logic
  res.json({
    status: 201,
    data: { message: 'Product uploaded successfully', productId: 'new-uuid-here' }
  });
});

app.patch('/api/v1/inventory/:id/status', (req, res) => {
  const { status } = req.body;
  res.json({
    status: 200,
    data: { message: `Product status updated to ${status}` }
  });
});

// Fulfillment Tasks
app.get('/api/v1/suppliers/:supplierId/tasks', (req, res) => {
  res.json({
    status: 200,
    data: {
      tasks: [
        { id: 't1', orderId: 'o1', status: 'PENDING', deliveryFee: 800 }
      ]
    }
  });
});

// Commerce
app.use('/api/v1/checkout', (req, res) => {
  res.json({ message: 'Checkout logic endpoint' });
});

app.listen(port, () => {
  console.log(`[API] Server running on port ${port}`);
});
