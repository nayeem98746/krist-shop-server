
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
    const {
      product_name,
      product_detail,
      category,
      quantity,
      selling_type,
      height,
      compare_price,
      SKU,
      weightValue,
      discount,
      product_weight,
      length,
      width,
      main_price
    } = req.body;

    // Validate required fields
    if (!product_name || !main_price) {
      return res.status(400).json({
        success: false,
        message: 'Product name and main price are required'
      });
    }

    // Handle multiple images
    let imageUrls = [];
    
    if (req.files && req.files.length > 0) {
      // Upload each image to Cloudinary
      const uploadPromises = req.files.map(file => 
        cloudinary.uploader.upload(file.path)
      );
      
      const uploadResults = await Promise.all(uploadPromises);
      imageUrls = uploadResults.map(result => result.secure_url);
    }

    // Calculate discount price if discount is provided
    let discount_price = null;
    if (discount && main_price) {
      const discountAmount = (parseFloat(main_price) * parseFloat(discount)) / 100;
      discount_price = parseFloat(main_price) - discountAmount;
    }

    // Create product object
    const productData = {
      product_name,
      product_detail: product_detail || '',
      category: category || '',
      quantity: quantity || '0',
      selling_type: selling_type || 'both',
      height: height || '',
      compare_price: compare_price || '',
      SKU: SKU || '',
      weightValue: weightValue || 'gm',
      discount: discount || '0',
      discount_price: discount_price || parseFloat(main_price),
      product_weight: product_weight || '',
      length: length || '',
      width: width || '',
      main_price: parseFloat(main_price),
      images: imageUrls
    };

    // Remove empty fields (optional)
    Object.keys(productData).forEach(key => {
      if (productData[key] === '' || productData[key] === null) {
        delete productData[key];
      }
    });

    const product = new Product(productData);
    await product.save();

    res.status(201).json({
      success: true,
      data: product
    });

  } catch (err) {
    console.error('Create Product Error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
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

module.exports = { createProduct, updateProduct, deleteProduct, getAllProducts, getSingleProduct  };