import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Calendar, Settings } from 'lucide-react';
import { useState } from 'react';
import { format } from 'date-fns';

const Profile = () => {
  const { user, logout, updateProfile, loading, error, clearError } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [success, setSuccess] = useState('');
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
  });
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) clearError();
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    if (error) clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({
        ...formData,
        currentPassword: passwordData.currentPassword || undefined,
        newPassword: passwordData.newPassword || undefined,
      });
      setSuccess('Profile updated successfully!');
      setShowModal(false);
      setPasswordData({ currentPassword: '', newPassword: '' });
    } catch (err) {
      // error handled by context
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-dark-gray">Profile</h1>
          <p className="text-slate-gray mt-1">Manage your account settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-light-gray">
              <div className="p-6 border-b border-light-gray">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 bg-hero-gradient rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-dark-gray">{user?.name}</h2>
                    <p className="text-slate-gray">{user?.email}</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-semibold text-dark-gray mb-4">Account Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-finura-blue/10 rounded-lg flex items-center justify-center">
                      <User className="h-5 w-5 text-finura-blue" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-gray">Full Name</p>
                      <p className="font-medium text-dark-gray">{user?.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-mint-green/10 rounded-lg flex items-center justify-center">
                      <Mail className="h-5 w-5 text-mint-green" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-gray">Email Address</p>
                      <p className="font-medium text-dark-gray">{user?.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-gold-accent/10 rounded-lg flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-gold-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-gray">Member Since</p>
                      <p className="font-medium text-dark-gray">{user?.createdAt ? format(new Date(user.createdAt), 'MMMM yyyy') : ''}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions Card */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-light-gray">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-dark-gray mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center space-x-3 px-4 py-3 text-left border border-light-gray rounded-lg hover:bg-soft-white transition-colors" onClick={() => setShowModal(true)}>
                    <Settings className="h-5 w-5 text-slate-gray" />
                    <span className="text-dark-gray">Account Settings</span>
                  </button>
                  
                  <button 
                    onClick={logout}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-left border border-coral-pink/20 rounded-lg hover:bg-coral-pink/10 transition-colors text-coral-pink"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-hero-gradient rounded-xl shadow-sm p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Welcome to Finura!</h3>
              <p className="text-white/90 text-sm">
                You're on your way to better financial management. Create budgets, track expenses, and reach your financial goals.
              </p>
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold text-dark-gray mb-6">Edit Account Settings</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark-gray mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-finura-blue"
                    required
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-gray mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-finura-blue"
                    required
                    placeholder="Enter your email address"
                  />
                </div>
                <button
                  type="button"
                  className="text-finura-blue text-sm underline"
                  onClick={() => setShowPasswordFields((v) => !v)}
                >
                  {showPasswordFields ? 'Cancel password change' : 'Change password?'}
                </button>
                {showPasswordFields && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-dark-gray mb-2">Current Password</label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-3 py-2 border border-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-finura-blue"
                        placeholder="Enter your current password"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-dark-gray mb-2">New Password</label>
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-3 py-2 border border-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-finura-blue"
                        placeholder="Enter your new password"
                      />
                    </div>
                  </>
                )}
                {error && <div className="bg-coral-pink/10 border border-coral-pink/20 rounded-lg p-4 text-coral-pink text-sm">{error}</div>}
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 border border-light-gray text-slate-gray rounded-lg hover:bg-light-gray/50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-button-gradient text-white rounded-lg hover:opacity-90 transition-opacity"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {success && <div className="mt-4 bg-mint-green/10 border border-mint-green/20 rounded-lg p-4 text-mint-green text-sm">{success}</div>}
    </div>
  );
};

export default Profile;