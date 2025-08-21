import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct {
  name: string;
  quantity: number;
  rate: number;
  total: number;
  gst: number;
}

export interface IInvoice extends Document {
  userId: mongoose.Types.ObjectId;
  userName: string;
  userEmail: string;
  products: IProduct[];
  totalCharges: number;
  gstTotal: number;
  totalAmount: number;
  invoiceDate: Date;
  createdAt: Date;
}

const ProductSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  quantity: {
    type: Number,
    required: [true, 'Product quantity is required'],
    min: [1, 'Quantity must be at least 1']
  },
  rate: {
    type: Number,
    required: [true, 'Product rate is required'],
    min: [0, 'Rate cannot be negative']
  },
  total: {
    type: Number,
    required: true
  },
  gst: {
    type: Number,
    required: true
  }
});

const InvoiceSchema: Schema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  products: [ProductSchema],
  totalCharges: {
    type: Number,
    required: true
  },
  gstTotal: {
    type: Number,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  invoiceDate: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<IInvoice>('Invoice', InvoiceSchema);
