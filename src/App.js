import React, { useState } from 'react';
import { CheckCircle, AlertCircle, Calendar, User, Mail, Phone } from 'lucide-react';

export default function CPL7CaptainForm() {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    agreed: false
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const deadline = new Date('2025-10-19T23:59:00+05:30');
  const now = new Date();
  const isDeadlinePassed = now > deadline;

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Captain name is required';
    }
    
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!mobileRegex.test(formData.mobile)) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.agreed) {
      newErrors.agreed = 'You must agree to the terms before submitting';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isDeadlinePassed) {
      setSubmitStatus({ type: 'error', message: 'Registration deadline has passed!' });
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwE-EK_HkIuIT7oAFbEnCyDiyhWarekl5Jl7c5LipRU0mqqu2M5pzfZJk0Z7EoobWNyYA/exec';
      
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          mobile: formData.mobile,
          email: formData.email,
          timestamp: new Date().toISOString()
        })
      });
      
      setSubmitStatus({ 
        type: 'success', 
        message: 'Registration submitted successfully! You will be notified about the captain selection via E-mail.' 
      });
      
      setFormData({ name: '', mobile: '', email: '', agreed: false });
      
    } catch (error) {
      setSubmitStatus({ 
        type: 'error', 
        message: 'Failed to submit registration. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">CPL7</h1>
            <h2 className="text-xl font-semibold text-blue-600 mb-4">Captain Registration</h2>
            
            <div className="bg-blue-50 rounded-lg p-3 flex items-center justify-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span className="text-gray-700">
                Deadline: <span className="font-semibold text-blue-600">Oct 19, 2025 - 11:59 PM IST</span>
              </span>
            </div>
          </div>

          {isDeadlinePassed && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-800 text-sm">
                Registration deadline has passed. Submissions are no longer being accepted.
              </p>
            </div>
          )}

          {submitStatus?.type === 'success' ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Registration Successful!</h3>
              <p className="text-gray-600 mb-6">
                You will be notified about the captain selection via Email.
              </p>
              <button
                onClick={() => setSubmitStatus(null)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
              >
                Submit Another Registration
              </button>
            </div>
          ) : (
            <div>
              {submitStatus?.type === 'error' && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{submitStatus.message}</p>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Captain Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={isDeadlinePassed}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      } ${isDeadlinePassed ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                      placeholder="Enter your full name"
                    />
                  </div>
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      id="mobile"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      disabled={isDeadlinePassed}
                      maxLength="10"
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                        errors.mobile ? 'border-red-500' : 'border-gray-300'
                      } ${isDeadlinePassed ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                      placeholder="10-digit mobile number"
                    />
                  </div>
                  {errors.mobile && <p className="mt-1 text-sm text-red-600">{errors.mobile}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isDeadlinePassed}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      } ${isDeadlinePassed ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                      placeholder="youremailid@gmail.com"
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="agreed"
                      checked={formData.agreed}
                      onChange={handleChange}
                      disabled={isDeadlinePassed}
                      className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer disabled:cursor-not-allowed"
                    />
                    <span className="text-sm text-gray-700 leading-relaxed">
                      I understand that submitting this form does not guarantee my selection as captain.
The committee will make the final decision on captaincy based on the number of available positions and by evaluating additional qualities and qualifications.
I agree to respect and abide by all decisions made by the committee regarding selection, leadership, and team matters, understanding that such decisions are made in the best interest of the tournament and all participants.
I further commit to upholding discipline, sportsmanship, and team spirit at all times, whether selected as captain or not.
                    </span>
                  </label>
                  {errors.agreed && <p className="mt-2 text-sm text-red-600 ml-8">{errors.agreed}</p>}
                </div>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting || isDeadlinePassed}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                >
                  {isSubmitting ? 'Submitting...' : isDeadlinePassed ? 'Registration Closed' : 'Submit Registration'}
                </button>
              </div>

              <div className="mt-6 text-center text-xs text-gray-500">
                <p>🏏 Where Passion Meets Cricket! <br />
                 📩 For further queries: 📧 sulampradeep0456@gmail.com , ramalakshmanreddy2001@gmail.com <br />
                 📱 Follow tournament updates and announcements via the official CPL7 group or through the organizing committee. </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}