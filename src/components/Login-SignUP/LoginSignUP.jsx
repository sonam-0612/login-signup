import React, { useState, useEffect } from 'react';
import './LoginSignUP.css';

import user_icon from '../Assets/person.png';
import email_icon from '../Assets/email.png';
import password_icon from '../Assets/password.png';

const LoginSignUP = () => {
    const [action, setAction] = useState("Login");
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [capsLockOn, setCapsLockOn] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState("");
    const [captcha, setCaptcha] = useState('');
    const [userCaptchaInput, setUserCaptchaInput] = useState('');

    // Generate a simple CAPTCHA
    const generateCaptcha = () => {
        const randomCaptcha = Math.random().toString(36).substring(2, 7).toUpperCase();
        setCaptcha(randomCaptcha);
    };

    useEffect(() => {
        generateCaptcha();

        const savedFormData = JSON.parse(localStorage.getItem('formData'));
        const savedDarkMode = JSON.parse(localStorage.getItem('darkMode'));

        if (savedFormData && savedFormData.rememberMe) {
            setFormData(savedFormData);
            setRememberMe(true);
        }

        if (savedDarkMode !== null) {
            setDarkMode(savedDarkMode);
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === 'password') {
            evaluatePasswordStrength(value);
        }
    };

    const handleSubmit = () => {
        if (action === "Sign Up" && !formData.name) {
            alert("Please enter your name");
            return;
        }
        if (!formData.email || !formData.password) {
            alert("Please fill in all fields");
            return;
        }

        // CAPTCHA validation
        if (userCaptchaInput.toUpperCase() !== captcha) {
            alert("CAPTCHA verification failed! Please try again.");
            generateCaptcha();
            return;
        }

        if (rememberMe) {
            localStorage.setItem('formData', JSON.stringify({ ...formData, rememberMe: true }));
        } else {
            localStorage.removeItem('formData');
        }

        alert(`${action} successful!`);
    };

    const handleFormReset = () => {
        setFormData({ name: '', email: '', password: '' });
        setUserCaptchaInput('');
        generateCaptcha();
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        localStorage.setItem('darkMode', JSON.stringify(!darkMode));
    };

    const handleCapsLock = (e) => {
        if (e.getModifierState('CapsLock')) {
            setCapsLockOn(true);
            alert("Caps Lock is on!"); 
        } else {
            setCapsLockOn(false);
        }
    };

    const evaluatePasswordStrength = (password) => {
        let strength = '';
        if (password.length > 6 && /\d/.test(password) && /[A-Z]/.test(password)) {
            strength = 'strong';
        } else if (password.length > 4) {
            strength = 'medium';
        } else {
            strength = 'weak';
        }
        setPasswordStrength(strength);
    };

    return (
        <div className={`container ${darkMode ? 'dark-mode' : ''} ${action === 'Sign Up' ? 'signup-mode' : 'login-mode'}`}>
            <div className='header'>
                <div className='text'>{action}</div>
                <div className='underline'></div>
            </div>
            <div className='inputs'>
                {action === "Login" ? null : (
                    <div className='input'>
                        <img src={user_icon} alt="User Icon" />
                        <input
                            type="text"
                            name="name"
                            placeholder='Name'
                            value={formData.name}
                            onChange={handleInputChange}
                            onKeyUp={handleCapsLock} 
                        />
                    </div>
                )}
                <div className='input'>
                    <img src={email_icon} alt="Email Icon" />
                    <input
                        type="email"
                        name="email"
                        placeholder='Email ID'
                        value={formData.email}
                        onChange={handleInputChange}
                        onKeyUp={handleCapsLock} // 
                    />
                </div>
                <div className='input'>
                    <img src={password_icon} alt="Password Icon" />
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder='Password'
                        value={formData.password}
                        onChange={handleInputChange}
                        onKeyUp={handleCapsLock} // Add onKeyUp listener for Caps Lock
                    />
                    <span
                        className="toggle-password"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? 'Hide' : 'Show'}
                    </span>
                </div>
                <div className={`password-strength ${passwordStrength}`}></div>
                <div className='remember-me'>
                    <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={() => setRememberMe(!rememberMe)}
                    />
                    <label>Remember Me</label>
                </div>
            </div>
            <div className="captcha-container">
                <div className="captcha">{captcha}</div>
                <input
                    type="text"
                    placeholder="Enter CAPTCHA"
                    value={userCaptchaInput}
                    onChange={(e) => setUserCaptchaInput(e.target.value)}
                />
            </div>
            {action === "Sign Up" ? null : (
                <div className='forget-password'>Lost password? <span>Click Here</span></div>
            )}
            <div className='submit-container'>
                <div
                    className={action === "Login" ? "submit grey" : "submit"}
                    onClick={() => setAction("Sign Up")}
                >
                    Sign Up
                </div>
                <div
                    className={action === "Sign Up" ? "submit grey" : "submit"}
                    onClick={() => {
                        if (action === "Sign Up") handleSubmit();
                        setAction("Login");
                    }}
                >
                    Login
                </div>
                <div
                    className="submit"
                    onClick={handleFormReset}
                >
                    Reset
                </div>
            </div>
            <div className='toggle-dark-mode'>
                <input
                    type="checkbox"
                    checked={darkMode}
                    onChange={toggleDarkMode}
                />
                <label>Dark Mode</label>
            </div>
        </div>
    );
}

export default LoginSignUP;
