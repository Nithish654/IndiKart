import React from 'react';

const PageLayout = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{title}</h1>
        <div className="prose prose-brand max-w-none bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            {children}
        </div>
    </div>
);

export const About = () => (
    <PageLayout title="About Us">
        <p className="text-lg text-gray-600 mb-6">
            IndiKart is India's fastest-growing e-commerce platform designed specifically for freelancers, creators, and small businesses.
        </p>
        <p className="text-gray-600 mb-4">
            Founded in 2024, our mission is to democratize online selling by providing a simple, powerful, and affordable platform that handles everything from product listings to invoicing.
        </p>
        <p className="text-gray-600">
            We believe that every creator deserves a professional storefront without the complexity of traditional enterprise software.
        </p>
    </PageLayout>
);

export const Terms = () => (
    <PageLayout title="Terms of Service">
        <h3 className="text-xl font-bold mb-4">1. Acceptance of Terms</h3>
        <p className="mb-6">By accessing and using IndiKart, you accept and agree to be bound by the terms and provision of this agreement.</p>
        
        <h3 className="text-xl font-bold mb-4">2. Use License</h3>
        <p className="mb-6">Permission is granted to temporarily download one copy of the materials (information or software) on IndiKart's website for personal, non-commercial transitory viewing only.</p>
        
        <h3 className="text-xl font-bold mb-4">3. Disclaimer</h3>
        <p>The materials on IndiKart's website are provided "as is". IndiKart makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties.</p>
    </PageLayout>
);

export const Privacy = () => (
    <PageLayout title="Privacy Policy">
        <p className="mb-6">Your privacy is important to us. It is IndiKart's policy to respect your privacy regarding any information we may collect from you across our website.</p>
        
        <h3 className="text-xl font-bold mb-4">Information We Collect</h3>
        <p className="mb-6">We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent.</p>
        
        <h3 className="text-xl font-bold mb-4">How We Store Data</h3>
        <p>We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we’ll protect within commercially acceptable means to prevent loss and theft.</p>
    </PageLayout>
);

export const Contact = () => (
    <PageLayout title="Contact Us">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <h3 className="text-xl font-bold mb-4">Get in Touch</h3>
                <p className="text-gray-600 mb-6">Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
                
                <div className="space-y-4">
                    <p><strong>Email:</strong> support@indikart.in</p>
                    <p><strong>Phone:</strong> +91 98765 43210</p>
                    <p><strong>Address:</strong> 123 Tech Park, Indiranagar, Bangalore, KA 560038</p>
                </div>
            </div>
            
            <form className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input type="text" className="w-full p-2 border border-gray-300 rounded-lg" placeholder="Your Name" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" className="w-full p-2 border border-gray-300 rounded-lg" placeholder="your@email.com" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea className="w-full p-2 border border-gray-300 rounded-lg h-32" placeholder="How can we help?"></textarea>
                </div>
                <button className="bg-brand-600 text-white px-6 py-2 rounded-lg hover:bg-brand-700 transition">Send Message</button>
            </form>
        </div>
    </PageLayout>
);
