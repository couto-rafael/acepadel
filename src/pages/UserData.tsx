import React, { useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import { Camera } from 'lucide-react';

const UserData: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    nickname: '',
    cpf: '',
    phone: '',
    birthDate: ''
  });
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .slice(0, 14);
  };

  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d)(\d{4})/, '$1 $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .slice(0, 17);
  };

  const formatDate = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1-$2')
      .replace(/(\d{2})(\d)/, '$1-$2')
      .slice(0, 10);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cpf') {
      formattedValue = formatCPF(value);
    } else if (name === 'phone') {
      formattedValue = formatPhone(value);
    } else if (name === 'birthDate') {
      formattedValue = formatDate(value);
    }

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', { ...formData, profileImage });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Meus Dados</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex justify-center mb-6">
                <div 
                  className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-100 cursor-pointer"
                  onClick={handleImageClick}
                >
                  {profileImage ? (
                    <img 
                      src={profileImage} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full">
                      <Camera size={40} className="text-gray-400" />
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <span className="text-white text-sm">Alterar foto</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sobrenome
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Apelido
                </label>
                <input
                  type="text"
                  name="nickname"
                  value={formData.nickname}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CPF
                </label>
                <input
                  type="text"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleInputChange}
                  placeholder="000.000.000-00"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="(00) 0 0000-0000"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Nascimento
                </label>
                <input
                  type="text"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  placeholder="DD-MM-AAAA"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition duration-300"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserData;