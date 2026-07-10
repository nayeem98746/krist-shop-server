
const Product = require('../models/productModel')
const cloudinary = require('cloudinary').v2;

    cloudinary.config({ 
        cloud_name: 'dea3u3plr', 
        api_key: '915639424628459', 
        api_secret: 'pACRwoOSFU_6awkt8b1hlt3r2Pw' 
    });

      // -------------------------- create product ---------------------

const createProduct = async (req, res) => {
  try {
    const { name, price, description } = req.body;

    if (!name || !price) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name and price are required' 
      });
    }

    let imageUrl = null;

    if (req.file) {
      const upload = await cloudinary.uploader.upload(req.file.path);
      imageUrl = upload.secure_url;
    }

    const product = new Product({
      name,
      price,
      description,
      image: imageUrl
    });

    await product.save();
    
    res.status(201).json({
      success: true,
      data: product
    });
  } catch (err) {
    console.error('Create Product Error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// ----------------------- get all product ---------------------
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
};


// --------------------------get single product -------------------

const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }
    
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
};


// --------------------------- update product ----------------------------

const updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  )

  if (!product) return res.status(404).send('Product not found')
  res.send(product)
}

// ----------------------------  delete product  ----------------------------
const deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id)
  if (!product) return res.status(404).send('Product not found')
  res.send('Product deleted')
}

module.exports = { createProduct, updateProduct, deleteProduct, getAllProducts, getSingleProduct };