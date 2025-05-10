import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-blue-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center mb-4">
              <Trophy className="h-8 w-8 mr-2" />
              <span className="font-bold text-xl">SportEvents India</span>
            </div>
            <p className="text-blue-100 mb-4">
              Your one-stop platform for sports event registration, team management, and event organization across India.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-blue-100 hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-blue-100 hover:text-white transition">
                  Events
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-blue-100 hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-blue-100 hover:text-white transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-span-1">
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-blue-300" />
                <a href="mailto:info@sportevents.in" className="text-blue-100 hover:text-white transition">
                  info@sportevents.in
                </a>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-blue-300" />
                <a href="tel:+919876543210" className="text-blue-100 hover:text-white transition">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 text-blue-300 mt-1" />
                <span className="text-blue-100">
                  123 Sports Complex, M.G. Road, Bangalore, Karnataka 560001
                </span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-1">
            <h3 className="font-semibold text-lg mb-4">Stay Updated</h3>
            <p className="text-blue-100 mb-2">Subscribe to our newsletter</p>
            <form className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 rounded-md bg-blue-700 text-white placeholder-blue-300 border border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white font-medium rounded-md hover:bg-green-600 transition"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-blue-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-blue-200 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} SportEvents India. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-blue-200 hover:text-white transition">
              Terms
            </a>
            <a href="#" className="text-blue-200 hover:text-white transition">
              Privacy
            </a>
            <a href="#" className="text-blue-200 hover:text-white transition">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;