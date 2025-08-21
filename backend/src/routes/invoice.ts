import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import puppeteer from 'puppeteer';
import Invoice from '../models/Invoice';
import { auth, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Generate PDF Invoice
router.post('/generate', auth, [
  body('products')
    .isArray({ min: 1 })
    .withMessage('At least one product is required'),
  body('products.*.name')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Product name is required'),
  body('products.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Product quantity must be at least 1'),
  body('products.*.rate')
    .isFloat({ min: 0 })
    .withMessage('Product rate must be a positive number')
], async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
      return;
    }

    const { products } = req.body;
    const user = req.user!;

    // Calculate totals
    const processedProducts = products.map((product: any) => {
      const total = product.quantity * product.rate;
      const gst = total * 0.18; // 18% GST
      return {
        name: product.name,
        quantity: product.quantity,
        rate: product.rate,
        total,
        gst
      };
    });

    const totalCharges = processedProducts.reduce((sum: number, product: any) => sum + product.total, 0);
    const gstTotal = processedProducts.reduce((sum: number, product: any) => sum + product.gst, 0);
    const totalAmount = totalCharges + gstTotal;

    // Save invoice to database
    const invoice = new Invoice({
      userId: user._id,
      userName: user.name,
      userEmail: user.email,
      products: processedProducts,
      totalCharges,
      gstTotal,
      totalAmount
    });

    await invoice.save();

    // Generate PDF using Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    
    const htmlContent = generateInvoiceHTML(invoice, user);
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });

    await browser.close();

    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="invoice-${invoice._id}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);

    res.send(pdfBuffer);
  } catch (error: any) {
    console.error('PDF generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating PDF',
      error: error.message
    });
  }
});

// Get user invoices
router.get('/history', auth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const invoices = await Invoice.find({ userId: req.user!._id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      data: { invoices }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching invoices',
      error: error.message
    });
  }
});

// Generate HTML for PDF
function generateInvoiceHTML(invoice: any, user: any): string {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invoice</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Arial', sans-serif;
          background-color: #f8f9fa;
          padding: 20px;
        }
        
        .invoice-container {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        
        .header {
          background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
          color: white;
          padding: 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .logo-section {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        
        .logo {
          width: 50px;
          height: 50px;
          background: #9ae6b4;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: #2d3748;
          font-size: 20px;
        }
        
        .company-name {
          font-size: 24px;
          font-weight: bold;
        }
        
        .invoice-title {
          font-size: 28px;
          font-weight: bold;
        }
        
        .user-info {
          background: #2d3748;
          color: white;
          padding: 20px 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .user-details h3 {
          font-size: 18px;
          margin-bottom: 5px;
        }
        
        .user-details p {
          opacity: 0.9;
        }
        
        .invoice-date {
          text-align: right;
        }
        
        .invoice-date p {
          margin: 2px 0;
        }
        
        .products-section {
          padding: 30px;
        }
        
        .products-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }
        
        .products-table th {
          background: #edf2f7;
          padding: 15px;
          text-align: left;
          font-weight: 600;
          border-bottom: 2px solid #e2e8f0;
        }
        
        .products-table td {
          padding: 15px;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .products-table tr:hover {
          background: #f7fafc;
        }
        
        .text-right {
          text-align: right;
        }
        
        .totals-section {
          background: #f7fafc;
          padding: 20px;
          border-radius: 8px;
          margin-top: 20px;
        }
        
        .total-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .total-row:last-child {
          border-bottom: none;
          font-weight: bold;
          font-size: 18px;
          color: #2d3748;
          padding-top: 15px;
          border-top: 2px solid #2d3748;
        }
        
        .footer {
          background: #2d3748;
          color: white;
          padding: 20px 30px;
          text-align: center;
        }
        
        .footer p {
          margin: 5px 0;
          opacity: 0.9;
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <div class="header">
          <div class="logo-section">
            <div class="logo">L</div>
            <div class="company-name">Levitation</div>
          </div>
          <div class="invoice-title">INVOICE GENERATOR</div>
        </div>
        
        <div class="user-info">
          <div class="user-details">
            <h3>Name: ${user.name}</h3>
            <p>Email: ${user.email}</p>
          </div>
          <div class="invoice-date">
            <p><strong>Date:</strong> ${formatDate(invoice.invoiceDate)}</p>
            <p><strong>Invoice ID:</strong> ${invoice._id.toString().slice(-8).toUpperCase()}</p>
          </div>
        </div>
        
        <div class="products-section">
          <table class="products-table">
            <thead>
              <tr>
                <th>Product</th>
                <th class="text-right">Qty</th>
                <th class="text-right">Rate</th>
                <th class="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              ${invoice.products.map((product: any, index: number) => `
                <tr>
                  <td>Product ${index + 1}</td>
                  <td class="text-right">${product.quantity}</td>
                  <td class="text-right">${formatCurrency(product.rate)}</td>
                  <td class="text-right">${formatCurrency(product.total)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="totals-section">
            <div class="total-row">
              <span>Total Charges:</span>
              <span>${formatCurrency(invoice.totalCharges)}</span>
            </div>
            <div class="total-row">
              <span>GST (18%):</span>
              <span>${formatCurrency(invoice.gstTotal)}</span>
            </div>
            <div class="total-row">
              <span>Total Amount:</span>
              <span>${formatCurrency(invoice.totalAmount)}</span>
            </div>
          </div>
        </div>
        
        <div class="footer">
          <p>We are pleased to provide any further information you may require and look forward to assisting with your next order.</p>
          <p>Rest assured, it will be provided with the same level of service and satisfaction.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export default router;
