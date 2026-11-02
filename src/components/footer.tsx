"use client";
import { FaLinkedin, FaInstagram, FaDiscord } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="relative z-20 w-full bg-[#0000008e] py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-0">
          <div className="flex flex-col items-center flex-1 px-4 md:px-8">
            <h3 className="text-foreground font-bmono font-semibold text-lg mb-4">
              Follow our socials!
            </h3>
            <div className="flex space-x-6">
              <a
                href="https://www.linkedin.com/company/acm-ucf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:text-gray-300 transition-colors duration-300"
                aria-label="LinkedIn"
              >
                <FaLinkedin size={28} />
              </a>
              <a
                href="https://www.instagram.com/ucfacm/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:text-gray-300 transition-colors duration-300"
                aria-label="Instagram"
              >
                <FaInstagram size={28} />
              </a>
              <a
                href="https://discord.gg/gJCSxhR8RY"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:text-gray-300 transition-colors duration-300"
                aria-label="Discord"
              >
                <FaDiscord size={28} />
              </a>
            </div>
          </div>

          <div className="hidden md:block w-px h-24 bg-gray-600"></div>

          <div className="flex flex-col items-center flex-1 px-4 md:px-8">
            <h3 className="text-foreground font-bmono font-semibold text-lg mb-4">
              CONTACT US
            </h3>
            <div className="flex flex-col space-y-2 text-gray-300 font-bmono items-center text-center">
              <p>
                4000 Central Florida Blvd
                <br />
                Orlando, FL 32816
              </p>
              <a
                href="mailto:acm.cecs.ucf@gmail.com"
                className="text-foreground hover:text-gray-300 transition-colors duration-300"
              >
                acm.cecs.ucf@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
