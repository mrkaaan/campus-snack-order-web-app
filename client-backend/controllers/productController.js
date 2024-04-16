// Mock data
const products = [
  { id: 1, name: 'Product A', price: 100 },
  { id: 2, name: 'Product B', price: 200 },
  // Add more products as needed
];

exports.getProducts = (req, res) => {
  res.json(products);
};
