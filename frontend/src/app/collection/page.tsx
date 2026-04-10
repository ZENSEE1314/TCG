import React, { useState, useEffect } from 'react';
import api from '@/services/api';
import { useRouter } from 'next/navigation';
import { Loader2, Package, Plus, Trash2, TrendingUp, LogOut, Tag } from 'lucide-react';

export default function CollectionPage() {
  const [collection, setCollection] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [addCardId, setAddCardId] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchCollection();
  }, []);

  const fetchCollection = async () => {
    try {
      const response = await api.get('/collection');
      setCollection(response.data.collection);
    } catch (err: any) {
      setError('Failed to load collection');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    setError('');

    try {
      await api.post('/collection/add', { cardId: addCardId });
      setAddCardId('');
      await fetchCollection();
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to add card');
    } finally {
      setIsAdding(false);
    }
  };

  const removeCard = async (cardId: string) => {
    if (!confirm('Remove this card from your collection?')) return;
    try {
      await api.delete(`/collection/${cardId}`);
      await fetchCollection();
    } catch (err) {
      alert('Failed to remove card');
    }
  };

  const toggleListing = async (cardId: string) => {
    try {
      // If we're listing it, we might want to ask for a price.
      // For now, we'll use a prompt for simplicity.
      let price = null;
      const currentItem = collection.find((c: any) => c.card_id === cardId);

      if (!currentItem?.is_listed) {
        const inputPrice = prompt('Enter the listing price for this card:');
        if (!inputPrice) return;
        price = parseFloat(inputPrice);
        if (isNaN(price)) {
          alert('Please enter a valid number for the price.');
          return;
        }
      }

      await api.patch(`/marketplace/list/${cardId}`, { price });
      await fetchCollection();
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Failed to update listing status');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Pokémon Dex</h1>
            <p className="text-gray-500">Manage your card collection and values</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Card Section */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-600" /> Add New Card
              </h2>
              <form onSubmit={handleAddCard} className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">Card ID</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Enter Card ID (e.g. 1)"
                    value={addCardId}
                    onChange={(e) => setAddCardId(e.target.value)}
                    required
                  />
                </div>
                {error && <p className="text-xs text-red-500">{error}</p>}
                <button
                  type="submit"
                  disabled={isAdding}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add to Dex'}
                </button>
              </form>
            </div>
          </div>

          {/* Collection Grid */}
          <div className="lg:col-span-2">
            {collection.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-200">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Your collection is empty. Start adding cards!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {collection.map((item: any) => (
                  <div key={item.card_id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 group">
                    <div className="w-24 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.card_name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-gray-900">{item.card_name}</h3>
                          <p className="text-xs text-gray-500">{item.set_name} • #{item.card_number}</p>
                        </div>
                        <button
                          onClick={() => removeCard(item.card_id)}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <span className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded uppercase">
                          {item.condition}
                        </span>
                        <div className="flex items-center gap-1 text-green-600 font-semibold text-sm">
                          <TrendingUp className="w-3 h-3" />
                          Qty: {item.quantity}
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-gray-50">
                        <button
                          onClick={() => toggleListing(item.card_id)}
                          className={`w-full py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                            item.is_listed
                              ? 'bg-orange-50 text-orange-600 hover:bg-orange-100'
                              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          <Tag className="w-3 h-3" />
                          {item.is_listed ? `Listed for $${item.listed_price}` : 'List for Sale'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
