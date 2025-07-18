import mongoose, { Schema } from 'mongoose';
import { IReview, ICart, IWishlist, IRecommendation, IMpesaTransaction } from '../types/interfaces';

// Review Model
const reviewSchema = new Schema<IReview>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  comment: {
    type: String,
    required: [true, 'Review comment is required'],
    maxlength: [1000, 'Comment cannot exceed 1000 characters']
  },
  helpful: {
    type: Number,
    default: 0,
    min: [0, 'Helpful count cannot be negative']
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    }
  }
});

reviewSchema.index({ product: 1, user: 1 }, { unique: true });
reviewSchema.index({ product: 1, rating: -1 });

// Cart Model
const cartSchema = new Schema<ICart>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [{
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1']
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative']
    }
  }],
  totalAmount: {
    type: Number,
    required: true,
    min: [0, 'Total amount cannot be negative'],
    default: 0
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    }
  }
});

cartSchema.index({ user: 1 });

// Wishlist Model
const wishlistSchema = new Schema<IWishlist>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  products: [{
    type: Schema.Types.ObjectId,
    ref: 'Product'
  }]
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    }
  }
});

wishlistSchema.index({ user: 1 });

// Recommendation Model
const recommendationSchema = new Schema<IRecommendation>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: [{
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    score: {
      type: Number,
      required: true,
      min: [0, 'Score cannot be negative'],
      max: [1, 'Score cannot exceed 1']
    },
    reason: {
      type: String,
      required: true
    }
  }],
  type: {
    type: String,
    enum: ['collaborative', 'content', 'hybrid'],
    required: true
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    }
  }
});

recommendationSchema.index({ user: 1, type: 1 });
recommendationSchema.index({ createdAt: -1 });

// M-Pesa Transaction Model
const mpesaTransactionSchema = new Schema<IMpesaTransaction>({
  order: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  phoneNumber: {
    type: String,
    required: true,
    match: [/^254[17]\d{8}$/, 'Please enter a valid Kenyan phone number']
  },
  amount: {
    type: Number,
    required: true,
    min: [1, 'Amount must be at least 1']
  },
  transactionId: {
    type: String,
    required: true,
    unique: true
  },
  checkoutRequestId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'success', 'failed'],
    default: 'pending'
  },
  mpesaReceiptNumber: {
    type: String,
    sparse: true
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    }
  }
});

mpesaTransactionSchema.index({ transactionId: 1 });
mpesaTransactionSchema.index({ checkoutRequestId: 1 });
mpesaTransactionSchema.index({ order: 1 });

export const Review = mongoose.model<IReview>('Review', reviewSchema);
export const Cart = mongoose.model<ICart>('Cart', cartSchema);
export const Wishlist = mongoose.model<IWishlist>('Wishlist', wishlistSchema);
export const Recommendation = mongoose.model<IRecommendation>('Recommendation', recommendationSchema);
export const MpesaTransaction = mongoose.model<IMpesaTransaction>('MpesaTransaction', mpesaTransactionSchema);

// Export all models
export { User } from './User';
export { Product } from './Product';
export { Category } from './Category';
export { Order } from './Order';
export { Review } from './Review';
export { Cart } from './Cart';
export { Wishlist } from './Wishlist';
export { Recommendation } from './Recommendation';
export { MpesaTransaction } from './MpesaTransaction';

export default mongoose;
