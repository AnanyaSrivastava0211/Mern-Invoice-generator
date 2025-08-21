import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { addProduct, removeProduct, updateProduct } from '@/store/slices/productSlice';
import { RootState } from '@/store/store';
import { Product } from '@/lib/api';
import { Trash2, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  rate: z.number().min(0, 'Rate must be a positive number'),
});

type ProductFormData = z.infer<typeof productSchema>;

const AddProducts: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { products, totalCharges, gstTotal, totalAmount } = useSelector((state: RootState) => state.products);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  const onSubmit = (data: ProductFormData) => {
    if (editingIndex !== null) {
      dispatch(updateProduct({ index: editingIndex, product: data }));
      setEditingIndex(null);
      toast.success('Product updated successfully');
    } else {
      dispatch(addProduct(data));
      toast.success('Product added successfully');
    }
    reset();
  };

  const handleEdit = (index: number, product: Product) => {
    setEditingIndex(index);
    setValue('name', product.name);
    setValue('quantity', product.quantity);
    setValue('rate', product.rate);
  };

  const handleDelete = (index: number) => {
    dispatch(removeProduct(index));
    toast.success('Product removed successfully');
    if (editingIndex === index) {
      setEditingIndex(null);
      reset();
    }
  };

  const handleNext = () => {
    if (products.length === 0) {
      toast.error('Please add at least one product');
      return;
    }
    navigate('/generate-pdf');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

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
            <Button
              onClick={() => navigate('/login')}
              variant="outline"
              className="border-green-400 text-green-400 hover:bg-green-400 hover:text-gray-900"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm mb-8">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white">Add Products</CardTitle>
              <p className="text-gray-400">
                This is basic add products page which is used for levitation assignment purpose.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-white text-sm font-medium">Product Name</label>
                    <Input
                      {...register('name')}
                      placeholder="Enter product name"
                      className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
                    />
                    {errors.name && (
                      <p className="text-red-400 text-xs">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-white text-sm font-medium">Product Qty</label>
                    <Input
                      {...register('quantity', { valueAsNumber: true })}
                      type="number"
                      min="1"
                      placeholder="Enter quantity"
                      className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
                    />
                    {errors.quantity && (
                      <p className="text-red-400 text-xs">{errors.quantity.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-white text-sm font-medium">Product Rate</label>
                    <Input
                      {...register('rate', { valueAsNumber: true })}
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Enter rate"
                      className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
                    />
                    {errors.rate && (
                      <p className="text-red-400 text-xs">{errors.rate.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    className="bg-green-400 hover:bg-green-500 text-gray-900 font-semibold"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {editingIndex !== null ? 'Update Product' : 'Add Product'}
                  </Button>
                  {editingIndex !== null && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setEditingIndex(null);
                        reset();
                      }}
                      className="border-gray-600 text-gray-400 hover:bg-gray-700"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Products Table */}
          {products.length > 0 && (
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm mb-8">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white">Products List</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-3 px-4 text-white font-semibold">Product</th>
                        <th className="text-right py-3 px-4 text-white font-semibold">Qty</th>
                        <th className="text-right py-3 px-4 text-white font-semibold">Rate</th>
                        <th className="text-right py-3 px-4 text-white font-semibold">Total</th>
                        <th className="text-right py-3 px-4 text-white font-semibold">GST (18%)</th>
                        <th className="text-center py-3 px-4 text-white font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product, index) => {
                        const total = product.quantity * product.rate;
                        const gst = total * 0.18;
                        return (
                          <tr
                            key={index}
                            className={`border-b border-gray-700/50 ${
                              editingIndex === index ? 'bg-green-400/10' : 'hover:bg-gray-700/30'
                            }`}
                          >
                            <td className="py-3 px-4 text-white">{product.name}</td>
                            <td className="py-3 px-4 text-white text-right">{product.quantity}</td>
                            <td className="py-3 px-4 text-white text-right">{formatCurrency(product.rate)}</td>
                            <td className="py-3 px-4 text-white text-right">{formatCurrency(total)}</td>
                            <td className="py-3 px-4 text-white text-right">{formatCurrency(gst)}</td>
                            <td className="py-3 px-4">
                              <div className="flex justify-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEdit(index, product)}
                                  className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
                                >
                                  Edit
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDelete(index)}
                                  className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="mt-6 bg-gray-700/30 rounded-lg p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-white">
                      <span>Total Charges:</span>
                      <span className="font-semibold">{formatCurrency(totalCharges)}</span>
                    </div>
                    <div className="flex justify-between text-white">
                      <span>GST (18%):</span>
                      <span className="font-semibold">{formatCurrency(gstTotal)}</span>
                    </div>
                    <div className="flex justify-between text-white text-lg font-bold border-t border-gray-600 pt-2">
                      <span>Total Amount:</span>
                      <span>{formatCurrency(totalAmount)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-center">
                  <Button
                    onClick={handleNext}
                    className="bg-green-400 hover:bg-green-500 text-gray-900 font-semibold px-8 py-3 text-lg"
                  >
                    Generate PDF Invoice
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddProducts;
