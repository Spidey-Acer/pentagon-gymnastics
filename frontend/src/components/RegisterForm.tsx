import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    dateOfBirth: string;
    phoneNumber: string;
}

interface FormErrors {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    dateOfBirth?: string;
    phoneNumber?: string;
}

const RegisterForm = () => {
    const [formData, setFormData] = useState<FormData>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        dateOfBirth: '',
        phoneNumber: '',
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        
        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }
        
        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }
        
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        
        if (!formData.dateOfBirth) {
            newErrors.dateOfBirth = 'Date of birth is required';
        }
        
        if (!formData.phoneNumber.trim()) {
            newErrors.phoneNumber = 'Phone number is required';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        if (validateForm()) {
            setIsSubmitting(true);
            try {
                const { data } = await api.post('/auth/register', formData);
                localStorage.setItem('token', data.token);
                navigate('/classes');
            } catch (error) {
                console.error('Registration failed', error);
                alert('Registration failed');
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    return (
        <div className="p-6 bg-white rounded shadow-md">
            <h2 className="text-xl font-bold mb-4">Register for ABC Gymnastics</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="firstName" className="block mb-1">First Name</label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={`p-2 border w-full ${errors.firstName ? 'border-red-500' : ''}`}
                    />
                    {errors.firstName && <span className="text-red-500 text-sm">{errors.firstName}</span>}
                </div>

                <div className="mb-4">
                    <label htmlFor="lastName" className="block mb-1">Last Name</label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={`p-2 border w-full ${errors.lastName ? 'border-red-500' : ''}`}
                    />
                    {errors.lastName && <span className="text-red-500 text-sm">{errors.lastName}</span>}
                </div>

                <div className="mb-4">
                    <label htmlFor="email" className="block mb-1">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`p-2 border w-full ${errors.email ? 'border-red-500' : ''}`}
                    />
                    {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
                </div>

                <div className="mb-4">
                    <label htmlFor="password" className="block mb-1">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`p-2 border w-full ${errors.password ? 'border-red-500' : ''}`}
                    />
                    {errors.password && <span className="text-red-500 text-sm">{errors.password}</span>}
                </div>

                <div className="mb-4">
                    <label htmlFor="confirmPassword" className="block mb-1">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`p-2 border w-full ${errors.confirmPassword ? 'border-red-500' : ''}`}
                    />
                    {errors.confirmPassword && <span className="text-red-500 text-sm">{errors.confirmPassword}</span>}
                </div>

                <div className="mb-4">
                    <label htmlFor="dateOfBirth" className="block mb-1">Date of Birth</label>
                    <input
                        type="date"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        className={`p-2 border w-full ${errors.dateOfBirth ? 'border-red-500' : ''}`}
                    />
                    {errors.dateOfBirth && <span className="text-red-500 text-sm">{errors.dateOfBirth}</span>}
                </div>

                <div className="mb-4">
                    <label htmlFor="phoneNumber" className="block mb-1">Phone Number</label>
                    <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className={`p-2 border w-full ${errors.phoneNumber ? 'border-red-500' : ''}`}
                    />
                    {errors.phoneNumber && <span className="text-red-500 text-sm">{errors.phoneNumber}</span>}
                </div>

                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-blue-500 text-white p-2 w-full"
                >
                    {isSubmitting ? 'Registering...' : 'Register'}
                </button>
            </form>
        </div>
    );
};

export default RegisterForm;