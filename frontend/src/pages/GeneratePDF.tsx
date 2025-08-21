import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { RootState } from '@/store/store';
import { invoiceApi } from '@/lib/api';
import { clearProducts } from '@/store/slices/productSlice';
import { Download, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

const GeneratePDF: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { products, totalCharges, gstTotal, totalAmount } = useSelector((state: RootState) => state.products);
  const { user } = useSelector((state: RootState) => state.auth);

  const generatePDFMutation = useMutation({
    mutationFn: invoiceApi.generatePDF,
    onSuccess: (response) => {
      // Create blob URL and trigger download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      // Download the file
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Also open in new tab for viewing
      window.open(url, '_blank');
      
      // Clean up
      setTimeout(() => window.URL.revokeObjectURL(url), 1000);
      
      toast.success('PDF generated and downloaded successfully!');
      dispatch(clearProducts());
      navigate('/products');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to generate PDF';
      toast.error(message);
    },
  });

  const handleGeneratePDF = () => {
    if (products.length === 0) {
      toast.error('No products to generate PDF');
      navigate('/products');
      return;
    }
    generatePDFMutation.mutate(products);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm max-w-md">
          <CardContent className="text-center py-8">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">No Products Found</h2>
            <p className="text-gray-400 mb-4">Please add products first to generate PDF.</p>
            <Button
              onClick={() => navigate('/products')}
              className="bg-green-400 hover:bg-green-500 text-gray-900 font-semibold"
            >
              Add Products
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-400 rounded-full flex items-center justify-center">
                <span className="text-gray-900 font-bold">L</span>
              </div>
              <span className="text-white text-lg font-semibold">levitation</span>
            </div>
            <div className="text-right">
              <p className="text-white font-semibold text-lg">INVOICE GENERATOR</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Invoice Preview */}
          <Card className="bg-white border-gray-300 mb-8">
            <CardHeader className="bg-gray-800 text-white">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center">
                    <span className="text-gray-900 font-bold text-xl">L</span>
                  </div>
                  <span className="text-xl font-semibold">Levitation</span>
                </div>
                <div className="text-right">
                  <h1 className="text-2xl font-bold">INVOICE GENERATOR</h1>
                </div>
              </div>
            </CardHeader>
            
            <div className="bg-gray-800 text-white px-6 py-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Name: {user?.name}</h3>
                  <p className="text-gray-300">Email: {user?.email}</p>
                </div>
                <div className="text-right">
                  <p><strong>Date:</strong> {formatDate(new Date())}</p>
                  <p><strong>Sample-name.com</strong></p>
                </div>
              </div>
            </div>

            <CardContent className="p-6">
              <table className="w-full mb-6">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="text-left py-3 px-4 font-semibold">Product</th>
                    <th className="text-right py-3 px-4 font-semibold">Qty</th>
                    <th className="text-right py-3 px-4 font-semibold">Rate</th>
                    <th className="text-right py-3 px-4 font-semibold">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => {
                    const total = product.quantity * product.rate;
                    return (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">Product {index + 1}</td>
                        <td className="py-3 px-4 text-right">{product.quantity}</td>
                        <td className="py-3 px-4 text-right">{formatCurrency(product.rate)}</td>
                        <td className="py-3 px-4 text-right">{formatCurrency(total)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Charges:</span>
                    <span className="font-semibold">{formatCurrency(totalCharges)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (18%):</span>
                    <span className="font-semibold">{formatCurrency(gstTotal)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t border-gray-300 pt-2">
                    <span>Total Amount:</span>
                    <span>₹ {totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">
                  We are pleased to provide any further information you may require and look forward to assisting with your next order.
                </p>
                <p className="text-sm text-gray-600">
                  Rest assured, it will be provided with the same level of service and satisfaction.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <Button
              onClick={() => navigate('/products')}
              variant="outline"
              className="border-gray-600 text-gray-400 hover:bg-gray-700 hover:text-white"
            >
              Back to Products
            </Button>
            <Button
              onClick={handleGeneratePDF}
              disabled={generatePDFMutation.isPending}
              className="bg-green-400 hover:bg-green-500 text-gray-900 font-semibold px-8"
            >
              <Download className="w-4 h-4 mr-2" />
              {generatePDFMutation.isPending ? 'Generating...' : 'Download PDF'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneratePDF;
