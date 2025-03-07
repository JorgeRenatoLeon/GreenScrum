"use client";  // Add this at the very top


import { useState } from "react";
import { Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for reaching out! We'll get back to you soon.");
    // Here you can handle the form submission, such as sending data to an API
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
        <h2 className="text-3xl font-bold mb-6 text-center">Contact Us</h2>
        
        {/* Contact Info */}
        <div className="mb-6 text-center text-gray-700">
          <p className="flex justify-center items-center gap-2">
            <Mail size={18} /> support@greenscrum.com
          </p>
          <p className="flex justify-center items-center gap-2 mt-2">
            <Phone size={18} /> +1 (234) 567-890
          </p>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium text-gray-700">Your Name</label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700">Your Email</label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700">Your Message</label>
            <Textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              required
            />
          </div>
          <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800">
            Send Message
          </Button>
        </form>
      </div>
    </div>
  );
}
