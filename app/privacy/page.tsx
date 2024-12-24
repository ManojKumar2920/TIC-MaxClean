import Footer from '@/components/Footer'
import MobileNavbar from '@/components/MobileNavbar'
import Navbar from '@/components/NavBar'
import React from 'react'

const page = () => {
  return (
    <div className="w-full bg-[#ECEFF3] overflow-hidden flex flex-col items-center justify-center">
      <Navbar />
      <MobileNavbar />
      <div className="w-full mt-10 bg-[#ECEFF3] px-4 md:px-20 py-20">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-6xl text-center font-bold text-[#D70006] mb-8">Privacy Policy</h1>
          <div className="bg-white rounded-lg shadow-lg p-8">
            <p className="text-gray-700 mb-6 text-lg">
              This privacy policy sets out how MAXCLEAN SERVICES PRIVATE LIMITED uses and protects any information that you give MAXCLEAN SERVICES PRIVATE LIMITED when you use this website.
            </p>

            <h2 className="text-2xl font-semibold text-[#D70006] mb-4">What We Collect</h2>
            <p className="text-gray-700 mb-4 text-lg">We may collect the following information:</p>
            <ul className="list-disc pl-6 space-y-3 text-gray-700 mb-8">
              <li className="text-lg">Name</li>
              <li className="text-lg">Contact information including email address</li>
              <li className="text-lg">Demographic information such as postcode, preferences and interests</li>
              <li className="text-lg">Other information relevant to customer surveys and/or offers</li>
            </ul>

            <h2 className="text-2xl font-semibold text-[#D70006] mb-4">What We Do with the Information We Gather</h2>
            <p className="text-gray-700 mb-4 text-lg">
              We require this information to understand your needs and provide you with better service, and in particular for the following reasons:
            </p>
            <ul className="list-disc pl-6 space-y-3 text-gray-700 mb-8">
              <li className="text-lg">Internal record keeping.</li>
              <li className="text-lg">We may use the information to improve our products and services.</li>
              <li className="text-lg">We may periodically send promotional emails about new products, special offers or other information which we think you may find interesting.</li>
              <li className="text-lg">We may use your information to contact you for market research purposes.</li>
              <li className="text-lg">We may contact you by email, phone, fax, or mail.</li>
              <li className="text-lg">We may use the information to customize the website according to your interests.</li>
            </ul>

            <h2 className="text-2xl font-semibold text-[#D70006] mb-4">Security</h2>
            <p className="text-gray-700 mb-8 text-lg">
              We are committed to ensuring that your information is secure. In order to prevent unauthorized access or disclosure, we have put in place suitable physical, electronic and managerial procedures to safeguard and secure the information we collect online.
            </p>

            <h2 className="text-2xl font-semibold text-[#D70006] mb-4">How We Use Cookies</h2>
            <p className="text-gray-700 mb-4 text-lg">
              A cookie is a small file which asks permission to be placed on your computer's hard drive. Once you agree, the file is added and the cookie helps analyze web traffic or lets you know when you visit a particular site. Cookies are used to respond to you as an individual. The web application can tailor its operations to your needs, likes, and dislikes by gathering and remembering information about your preferences.
            </p>
            <p className="text-gray-700 mb-8 text-lg">
              We use traffic log cookies to identify which pages are being used. This helps us to improve our website in order to tailor it to customer needs. We only use this information for statistical analysis purposes and then the data is removed from the system.
            </p>

            <h2 className="text-2xl font-semibold text-[#D70006] mb-4">Controlling Your Personal Information</h2>
            <p className="text-gray-700 mb-4 text-lg">You may choose to restrict the collection or use of your personal information in the following ways:</p>
            <ul className="list-disc pl-6 space-y-3 text-gray-700 mb-8">
              <li className="text-lg">Whenever you are asked to fill in a form on the website, look for the box that you can click to indicate that you do not want the information to be used for direct marketing purposes.</li>
              <li className="text-lg">If you have previously agreed to us using your personal information for direct marketing purposes, you may change your mind at any time by writing to or emailing us at maxcleanbusiness@gmail.com</li>
            </ul>
            <p className="text-gray-700 mb-4 text-lg">
              We will not sell, distribute or lease your personal information to third parties unless we have your permission or are required by law to do so. We may use your personal information to send you promotional information about third parties which we think you may find interesting if you tell us that you wish this to happen.
            </p>
            <p className="text-gray-700 text-lg">
              If you believe that any information we are holding on you is incorrect or incomplete, please write to or contact us as soon as possible at the above address. We will promptly correct any information found to be incorrect.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default page