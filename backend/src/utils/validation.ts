import { body, param, query, ValidationChain } from 'express-validator';

export class ValidationUtils {
  /**
   * User validation rules
   */
  public static userRegistration(): ValidationChain[] {
    return [
      body('firstName')
        .notEmpty()
        .withMessage('First name is required')
        .isLength({ max: 50 })
        .withMessage('First name cannot exceed 50 characters')
        .trim(),
      
      body('lastName')
        .notEmpty()
        .withMessage('Last name is required')
        .isLength({ max: 50 })
        .withMessage('Last name cannot exceed 50 characters')
        .trim(),
      
      body('email')
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail()
        .toLowerCase(),
      
      body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
      
      body('phone')
        .matches(/^254[17]\d{8}$/)
        .withMessage('Please provide a valid Kenyan phone number (254xxxxxxxxx)')
    ];
  }

  public static userLogin(): ValidationChain[] {
    return [
      body('email')
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail()
        .toLowerCase(),
      
      body('password')
        .notEmpty()
        .withMessage('Password is required')
    ];
  }

  /**
   * Product validation rules
   */
  public static productCreation(): ValidationChain[] {
    return [
      body('name')
        .notEmpty()
        .withMessage('Product name is required')
        .isLength({ max: 200 })
        .withMessage('Product name cannot exceed 200 characters')
        .trim(),
      
      body('description')
        .notEmpty()
        .withMessage('Product description is required')
        .isLength({ max: 2000 })
        .withMessage('Description cannot exceed 2000 characters'),
      
      body('price')
        .isFloat({ min: 0 })
        .withMessage('Price must be a positive number'),
      
      body('category')
        .isMongoId()
        .withMessage('Please provide a valid category ID'),
      
      body('subcategory')
        .notEmpty()
        .withMessage('Subcategory is required')
        .trim(),
      
      body('brand')
        .notEmpty()
        .withMessage('Brand is required')
        .trim(),
      
      body('stock')
        .isInt({ min: 0 })
        .withMessage('Stock must be a non-negative integer'),
      
      body('images')
        .isArray({ min: 1 })
        .withMessage('At least one product image is required')
    ];
  }

  /**
   * Order validation rules
   */
  public static orderCreation(): ValidationChain[] {
    return [
      body('items')
        .isArray({ min: 1 })
        .withMessage('Order must contain at least one item'),
      
      body('items.*.product')
        .isMongoId()
        .withMessage('Please provide valid product IDs'),
      
      body('items.*.quantity')
        .isInt({ min: 1 })
        .withMessage('Quantity must be at least 1'),
      
      body('shippingAddress.street')
        .notEmpty()
        .withMessage('Street address is required'),
      
      body('shippingAddress.city')
        .notEmpty()
        .withMessage('City is required'),
      
      body('shippingAddress.county')
        .notEmpty()
        .withMessage('County is required'),
      
      body('shippingAddress.postalCode')
        .notEmpty()
        .withMessage('Postal code is required'),
      
      body('paymentMethod')
        .isIn(['mpesa', 'card', 'cash'])
        .withMessage('Invalid payment method')
    ];
  }

  /**
   * Review validation rules
   */
  public static reviewCreation(): ValidationChain[] {
    return [
      body('rating')
        .isInt({ min: 1, max: 5 })
        .withMessage('Rating must be between 1 and 5'),
      
      body('comment')
        .notEmpty()
        .withMessage('Review comment is required')
        .isLength({ max: 1000 })
        .withMessage('Comment cannot exceed 1000 characters')
    ];
  }

  /**
   * Common validation rules
   */
  public static mongoId(field: string = 'id'): ValidationChain {
    return param(field)
      .isMongoId()
      .withMessage(`Please provide a valid ${field}`);
  }

  public static pagination(): ValidationChain[] {
    return [
      query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
      
      query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100')
    ];
  }

  public static searchQuery(): ValidationChain[] {
    return [
      query('q')
        .optional()
        .isLength({ min: 1, max: 100 })
        .withMessage('Search query must be between 1 and 100 characters')
        .trim(),
      
      query('category')
        .optional()
        .isMongoId()
        .withMessage('Please provide a valid category ID'),
      
      query('minPrice')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Minimum price must be a positive number'),
      
      query('maxPrice')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Maximum price must be a positive number'),
      
      query('sortBy')
        .optional()
        .isIn(['price', 'rating', 'createdAt', 'sold'])
        .withMessage('Invalid sort field'),
      
      query('sortOrder')
        .optional()
        .isIn(['asc', 'desc'])
        .withMessage('Sort order must be asc or desc')
    ];
  }
}