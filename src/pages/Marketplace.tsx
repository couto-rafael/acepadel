import React, { useState } from 'react';
import DashboardHeader from '../components/DashboardHeader';
import { Search, MapPin, Filter, Heart, MessageCircle, Share2, Plus, X } from 'lucide-react';

interface Product {
  id: string;
  title: string;
  price: number;
  location: string;
  image: string;
  description: string;
  seller: {
    name: string;
    avatar: string;
  };
}

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Omit<Product, 'id' | 'seller'>) => void;
}

const CreateProductModal: React.FC<CreateProductModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    category: '',
    location: '',
    condition: '',
    image: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title: formData.title,
      price: parseFloat(formData.price),
      description: formData.description,
      location: formData.location,
      image: formData.image || 'https://images.pexels.com/photos/6203795/pexels-photo-6203795.jpeg'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Criar Anúncio</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Produto
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preço (R$)
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={4}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoria
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Selecione...</option>
              <option value="rackets">Raquetes</option>
              <option value="accessories">Acessórios</option>
              <option value="clothes">Roupas</option>
              <option value="shoes">Calçados</option>
              <option value="balls">Bolas</option>
              <option value="bags">Bolsas</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Localização
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Condição
            </label>
            <select
              value={formData.condition}
              onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Selecione...</option>
              <option value="new">Novo</option>
              <option value="like-new">Seminovo</option>
              <option value="used">Usado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Imagem do Produto
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setFormData({ ...formData, image: reader.result as string });
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="w-full"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Criar Anúncio
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Marketplace: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const categories = [
    { id: 'all', name: 'Todas Categorias' },
    { id: 'rackets', name: 'Raquetes' },
    { id: 'accessories', name: 'Acessórios' },
    { id: 'clothes', name: 'Roupas' },
    { id: 'shoes', name: 'Calçados' },
    { id: 'balls', name: 'Bolas' },
    { id: 'bags', name: 'Bolsas' },
  ];

  const products: Product[] = [
    {
      id: '1',
      title: 'Raquete Nox AT10 Luxury Genius 18K',
      price: 1899.90,
      location: 'São Paulo, SP',
      image: 'https://images.pexels.com/photos/6203795/pexels-photo-6203795.jpeg',
      description: 'Raquete em excelente estado, usada apenas 3 vezes.',
      seller: {
        name: 'João Silva',
        avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg'
      }
    },
    {
      id: '2',
      title: 'Kit 3 Bolas de Padel Head Pro',
      price: 89.90,
      location: 'Rio de Janeiro, RJ',
      image: 'https://images.pexels.com/photos/3660204/pexels-photo-3660204.jpeg',
      description: 'Kit novo, lacrado.',
      seller: {
        name: 'Maria Santos',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg'
      }
    },
  ];

  const handleCreateProduct = (product: Omit<Product, 'id' | 'seller'>) => {
    // Handle product creation
    console.log('New product:', product);
    setShowCreateModal(false);
  };

  return (
    <div className="min-h-screen bg-light">
      <DashboardHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Sidebar - Filters */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-lg font-semibold mb-4">Filtros</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categorias
                  </label>
                  <div className="space-y-2">
                    {categories.map(category => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`block w-full text-left px-3 py-2 rounded-md ${
                          selectedCategory === category.id
                            ? 'bg-primary-50 text-primary-700'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preço
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Localização
                  </label>
                  <input
                    type="text"
                    placeholder="Digite sua cidade"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Condição
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      Novo
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      Usado
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search Bar */}
            <div className="bg-white rounded-xl shadow-lg p-4 mb-6 border border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-48 object-cover"
                    />
                    <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow hover:bg-gray-100">
                      <Heart size={20} className="text-gray-600" />
                    </button>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {product.title}
                    </h3>
                    <p className="text-2xl font-bold text-primary-600 mb-2">
                      R$ {product.price.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600 mb-4">
                      {product.description}
                    </p>
                    
                    <div className="flex items-center text-sm text-gray-600 mb-4">
                      <MapPin size={16} className="mr-1" />
                      {product.location}
                    </div>

                    <div className="flex items-center space-x-2 mb-4">
                      <img
                        src={product.seller.avatar}
                        alt={product.seller.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="text-sm text-gray-600">
                        {product.seller.name}
                      </span>
                    </div>

                    <div className="flex space-x-2">
                      <button className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 flex items-center justify-center">
                        <MessageCircle size={18} className="mr-2" />
                        Mensagem
                      </button>
                      <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                        <Share2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Sidebar - User Sales */}
          <div className="w-full md:w-80 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
              <h2 className="text-lg font-semibold mb-4">Minhas Vendas</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 bg-primary-50 rounded-lg">
                  <p className="text-2xl font-bold text-primary-600">12</p>
                  <p className="text-sm text-gray-600">Produtos</p>
                </div>
                <div className="text-center p-4 bg-primary-50 rounded-lg">
                  <p className="text-2xl font-bold text-primary-600">5</p>
                  <p className="text-sm text-gray-600">Vendas</p>
                </div>
                <div className="text-center p-4 bg-primary-50 rounded-lg">
                  <p className="text-2xl font-bold text-primary-600">8</p>
                  <p className="text-sm text-gray-600">Interessados</p>
                </div>
                <div className="text-center p-4 bg-primary-50 rounded-lg">
                  <p className="text-2xl font-bold text-primary-600">4.8</p>
                  <p className="text-sm text-gray-600">Avaliação</p>
                </div>
              </div>

              <button
                onClick={() => setShowCreateModal(true)}
                className="w-full bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 flex items-center justify-center"
              >
                <Plus size={20} className="mr-2" />
                Criar Anúncio
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold mb-4">Dicas de Venda</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-primary-600 rounded-full mt-2 mr-2"></span>
                  Tire fotos com boa iluminação
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-primary-600 rounded-full mt-2 mr-2"></span>
                  Descreva detalhes importantes
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-primary-600 rounded-full mt-2 mr-2"></span>
                  Seja honesto sobre a condição
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-primary-600 rounded-full mt-2 mr-2"></span>
                  Responda rapidamente
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <CreateProductModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleCreateProduct}
      />
    </div>
  );
};

export default Marketplace;