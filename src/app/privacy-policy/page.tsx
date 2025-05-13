// src/app/privacy-policy/page.tsx
import React from 'react';

const PrivacyPolicyPage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <div className="prose max-w-none">
        <p>
          This Privacy Policy describes how SLATE & CHALK MINDCARE collects, uses, and discloses your personal information when you visit or use our website and services.
        </p>
        <h2>Information We Collect</h2>
        <p>
          We collect personal information you provide directly to us, such as when you contact us, book a session, or sign up for our services. This may include your name, email address, phone number, and any other information you choose to provide.
        </p>
        <p>
          We may also collect non-personal information automatically as you use our site, such as your IP address, browser type, operating system, and website usage data. This helps us understand how visitors use our site and improve our services.
        </p>
        <h2>How We Use Your Information</h2>
        <p>
          We use the information we collect to:
        </p>
        <ul>
          <li>Provide and maintain our services.</li>
          <li>Respond to your inquiries and provide customer support.</li>
          <li>Process your bookings and appointments.</li>
          <li>Improve our website and services.</li>
          <li>Communicate with you about updates, offers, and news (if you have opted in).</li>
          <li>Comply with legal obligations.</li>
        </ul>
        <h2>Sharing Your Information</h2>
        <p>
          We do not share your personal information with third parties except as necessary to provide our services, comply with legal requirements, or with your explicit consent.
        </p>
        <h2>Data Security</h2>
        <p>
          We take reasonable measures to protect your personal information from unauthorized access, use, or disclosure. However, no internet transmission is completely secure, and we cannot guarantee absolute security.
        </p>
        <h2>Your Choices</h2>
        <p>
          You can choose not to provide certain information, but this may limit your ability to use some features of our website or services. You may also have rights regarding your personal information under applicable laws.
        </p>
        <h2>Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page.
        </p>
        <h2>Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us through our website.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
