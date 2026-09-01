import React, { useEffect } from 'react';
import { Mail, MapPin, Phone, Clock, ArrowRight } from 'lucide-react';

const Contact = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="bg-brand-ink py-20 px-4 md:px-6">
        <div className="max-w-[1280px] mx-auto text-center">
          <h1 className="font-display font-bold text-4xl md:text-5xl text-[#1a1f36] mb-4">Contact Us</h1>
          <p className="text-gray-500 text-sm md:text-base max-w-2xl mx-auto">
            Have a question or need assistance? Our team is here to help. Reach out to us using the form below or through our contact information.
          </p>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 mb-20">
          {/* Contact Info */}
          <div>
            <h2 className="font-display font-bold text-3xl text-[#1a1f36] mb-8">Get in Touch</h2>
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-brand" />
                </div>
                <div>
                  <h3 className="font-bold text-[#1a1f36] text-lg mb-1">Our Location</h3>
                  <p className="text-gray-500 leading-relaxed">
                    123 Bookworm Lane, Suite 400<br />
                    New York, NY 10012<br />
                    United States
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6 text-brand" />
                </div>
                <div>
                  <h3 className="font-bold text-[#1a1f36] text-lg mb-1">Phone Number</h3>
                  <p className="text-gray-500 leading-relaxed">
                    +1 (555) 123-4567<br />
                    +1 (555) 987-6543
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6 text-brand" />
                </div>
                <div>
                  <h3 className="font-bold text-[#1a1f36] text-lg mb-1">Email Address</h3>
                  <p className="text-gray-500 leading-relaxed">
                    support@bibliodrop.com<br />
                    info@bibliodrop.com
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6 text-brand" />
                </div>
                <div>
                  <h3 className="font-bold text-[#1a1f36] text-lg mb-1">Working Hours</h3>
                  <p className="text-gray-500 leading-relaxed">
                    Mon - Fri: 9:00 AM - 6:00 PM<br />
                    Sat - Sun: 10:00 AM - 4:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-xl shadow-brand/5">
            <h2 className="font-display font-bold text-3xl text-[#1a1f36] mb-6">Send a Message</h2>
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-[#1a1f36] mb-2">First Name</label>
                  <input type="text" placeholder="John" className="w-full p-3.5 bg-gray-50 border border-gray-200 text-black placeholder:text-gray-400 rounded-xl focus:ring-2 focus:ring-brand focus:border-brand focus:outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#1a1f36] mb-2">Last Name</label>
                  <input type="text" placeholder="Doe" className="w-full p-3.5 bg-gray-50 border border-gray-200 text-black placeholder:text-gray-400 rounded-xl focus:ring-2 focus:ring-brand focus:border-brand focus:outline-none transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1a1f36] mb-2">Email Address</label>
                <input type="email" placeholder="john@example.com" className="w-full p-3.5 bg-gray-50 border border-gray-200 text-black placeholder:text-gray-400 rounded-xl focus:ring-2 focus:ring-brand focus:border-brand focus:outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1a1f36] mb-2">Subject</label>
                <input type="text" placeholder="How can we help?" className="w-full p-3.5 bg-gray-50 border border-gray-200 text-black placeholder:text-gray-400 rounded-xl focus:ring-2 focus:ring-brand focus:border-brand focus:outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1a1f36] mb-2">Your Message</label>
                <textarea rows="4" placeholder="Write your message here..." className="w-full p-3.5 bg-gray-50 border border-gray-200 text-black placeholder:text-gray-400 rounded-xl focus:ring-2 focus:ring-brand focus:border-brand focus:outline-none transition-all"></textarea>
              </div>
              <button className="w-full py-4 bg-brand text-white font-bold rounded-xl hover:bg-[#e85a4a] transition-all flex items-center justify-center gap-2 group">
                Send Message <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="w-full h-[500px] bg-gray-100 relative grayscale hover:grayscale-0 transition-all duration-700">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.1583091352!2d-74.11976373946229!3d40.69766374859258!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Google Maps"
        ></iframe>
      </div>
    </div>
  );
};

export default Contact;
