import { useLocation } from "react-router-dom";
import { SITE_INFO } from "../../constants/config";
import { usePageTransition } from "./PageTransition";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  PhoneIcon,
  Mail01Icon,
  Home09Icon,
  Facebook01Icon,
  InstagramIcon,
  TiktokIcon,
} from "@hugeicons/core-free-icons";

// Needs its own route: /privacy-policy
const LEGAL_LINKS = [{ label: "Privacy Policy", href: "/privacy-policy" }];

export default function ReplicaFooter() {
  const { go } = usePageTransition();
  const location = useLocation();

  // Same behavior as the header: the page curtain handles the route change
  const handleNav = (e, href) => {
    e.preventDefault();
    if (location.pathname === href) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      go(href);
    }
  };

  return (
    <>
      <footer id="location" className="pt-14 pb-10 bg-white text-[#222]">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Contact Info (Left) */}
          <div className="text-left">
            <h3
              className="text-2xl font-medium text-[#222] m-0"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Contact Us
            </h3>
            <span className="mt-3.5 mb-2 text-[12.5px] leading-relaxed flex gap-2.5 items-start">
              <HugeiconsIcon
                icon={Home09Icon}
                size={20}
                color="currentColor"
                strokeWidth={2}
                className="shrink-0 mt-0.5"
              />
              <span>
                2nd Floor and 3rd Floor Organiks Salon and Wellness Spa Friendship
                Highway Cutcut Angeles City, Pampanga
              </span>
            </span>
            <p className="my-2 text-[12.5px]">
              <a
                href={`tel:${SITE_INFO.phone}`}
                className="text-[#222] hover:text-[#566B3F] transition-colors flex gap-2.5 items-center"
              >
                <HugeiconsIcon
                  icon={PhoneIcon}
                  size={20}
                  color="currentColor"
                  strokeWidth={2}
                  className="shrink-0"
                />
                <span>0969 248 7007</span>
              </a>
            </p>
            <p className="my-2 text-[12.5px]">
              <a
                href={`mailto:${SITE_INFO.email}`}
                className="text-[#222] hover:text-[#566B3F] transition-colors flex gap-2.5 items-center"
              >
                <HugeiconsIcon
                  icon={Mail01Icon}
                  size={20}
                  color="currentColor"
                  strokeWidth={2}
                  className="shrink-0"
                />
                <span>{SITE_INFO.email}</span>
              </a>
            </p>
          </div>

          {/* Brand Center */}
          <div className="text-center flex flex-col items-center">
            <div className="mb-4">
              <img
                src="/images/logo.webp"
                alt="Organiks Salon and Wellness Spa"
                className="h-25 w-auto object-contain mx-auto"
              />
            </div>
            <p
              className="text-xl block mt-2 text-[#222]"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              Reveal. Renew. Radiate.
            </p>
            <p
              className="text-[12.5px] text-[#555] mt-1 mb-4"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              Natural ingredients. Premium care. Exceptional results.
            </p>
            {/* Social Icons matching original styling */}
            <div className="flex justify-center gap-4">
              <a
                href="https://www.facebook.com/organiksaesthetic"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="group w-7 h-7 flex items-center justify-center text-[#222] hover:text-[#566B3F] transition-colors"
              >
                <HugeiconsIcon
                  icon={Facebook01Icon}
                  size={24}
                  color="currentColor"
                  strokeWidth={2}
                  className="w-full h-full object-contain transition-transform duration-200 group-hover:scale-110 shrink-0"
                />
              </a>
              <a
                href="https://www.instagram.com/organikswellness"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="group w-7 h-7 flex items-center justify-center text-[#222] hover:text-[#566B3F] transition-colors"
              >
                <HugeiconsIcon
                  icon={InstagramIcon}
                  size={24}
                  color="currentColor"
                  strokeWidth={2}
                  className="w-full h-full object-contain transition-transform duration-200 group-hover:scale-110 shrink-0"
                />
              </a>
              <a
                href="https://www.tiktok.com/@organiks.aesthetic"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="group w-7 h-7 flex items-center justify-center text-[#222] hover:text-[#566B3F] transition-colors"
              >
                <HugeiconsIcon
                  icon={TiktokIcon}
                  size={24}
                  color="currentColor"
                  strokeWidth={2}
                  className="w-full h-full object-contain transition-transform duration-200 group-hover:scale-110 shrink-0"
                />
              </a>
            </div>
          </div>

          {/* Opening Hours (Right) */}
          <div className="text-left md:text-right">
            <h3
              className="text-2xl font-medium text-[#222] m-0"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Opening hours
            </h3>
            <p className="mt-3.5 text-[12.5px] text-[#555]">
              Sunday - Monday: 9AM - 12AM
            </p>
          </div>
        </div>
      </footer>

      {/* Olive bottom bar */}
      <div
        className="bg-[#4F5F3A] text-white py-3.5 px-6 text-xs"
        style={{ fontFamily: "var(--font-poppins)" }}
      >
        <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center">
          <p className="m-0 text-white">
            © Organiks Salon and Wellness Spa {new Date().getFullYear()} All
            Rights Reserved.
          </p>
          <ul className="flex items-center gap-x-5 list-none m-0 p-0">
            {LEGAL_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => handleNav(e, link.href)}
                  className="text-white/80 hover:text-white underline underline-offset-2 decoration-white/30 hover:decoration-white transition-colors"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}