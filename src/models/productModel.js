const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  product_name: {
    type: String,
    required: true,
    trim: true
  },
  product_detail: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    default: '',
    trim: true
  },
  quantity: {
    type: String,
    default: '0'
  },
  selling_type: {
    type: String,
    enum: ['both', 'online', 'store'],
    default: 'both'
  },
  height: {
    type: String,
    default: ''
  },
  compare_price: {
    type: String,
    default: ''
  },
  SKU: {
    type: String,
    default: '',
    trim: true
  },
  weightValue: {
    type: String,
    enum: ['gm', 'kg', 'lb', 'oz'],
    default: 'gm'
  },
  discount: {
    type: String,
    default: '0'
  },
  discount_price: {
    type: Number,
    default: 0
  },
  product_weight: {
    type: String,
    default: ''
  },
  length: {
    type: String,
    default: ''
  },
  width: {
    type: String,
    default: ''
  },
  main_price: {
    type: Number,
    required: true,
    min: 0
  },
  images: {
    type: [String],
    default: []
  }
}, { 
  timestamps: true 
});

 productSchema.pre('save', function(next) {
  if (this.discount && this.main_price) {
    const discountAmount = (parseFloat(this.main_price) * parseFloat(this.discount)) / 100;
    this.discount_price = parseFloat(this.main_price) - discountAmount;
  } else {
    this.discount_price = this.main_price || 0;
  }
  next();
});

 productSchema.index({ product_name: 'text', category: 1 });

module.exports = mongoose.model('Product', productSchema);



// const mongoose = require('mongoose')
// const productSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true
//   },
//   price: {
//     type: Number,
//     required: true
//   },
//   description: {
//     type: String
//   },
//   image: {
//     type: String
//   },
  
// }, { timestamps: true })



// module.exports = mongoose.model('Product' , productSchema )