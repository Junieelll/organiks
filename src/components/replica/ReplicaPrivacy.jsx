import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { SITE_INFO } from "../../constants/config";
import { usePageEnterDelay } from "./PageTransition";

const LAST_UPDATED = "October 7, 2026";
const ADDRESS =
  "2nd Floor and 3rd Floor Organiks Salon and Wellness Spa Friendship Highway Cutcut Angeles City, Pampanga";

/* Motion: deliberately minimal for a legal page. The title rises word by word, the text fades in. */
const EASE = [0.22, 1, 0.36, 1];
const groupVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};
const headingVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
const wordVariants = {
  hidden: { y: "105%" },
  visible: { y: "0%", transition: { duration: 0.85, ease: EASE } },
};
const fadeVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.7, ease: "easeOut" } },
};

function Section({ title, children }) {
  return (
    <section className="mt-10">
      <h2
        className="text-[22px] text-[#2C3820] font-medium tracking-tight m-0 mb-3"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {title}
      </h2>
      <div className="text-[14.5px] text-[#333] leading-[1.75] space-y-3">
        {children}
      </div>
    </section>
  );
}

function List({ items }) {
  return (
    <ul className="list-disc pl-5 space-y-1.5 m-0">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

const linkClass =
  "text-[#566B3F] underline underline-offset-2 hover:text-[#14291F] transition-colors";

export default function ReplicaPrivacy() {
  const reduceMotion = useReducedMotion();
  const enterDelay = usePageEnterDelay(); // wait for the page curtain when arriving via nav

  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), (enterDelay || 0) * 1000);
    return () => clearTimeout(t);
  }, [enterDelay]);

  return (
    <div className="font-['Poppins',sans-serif] bg-[#FEFBF7] text-[#222] selection:bg-[#566B3F]/20 selection:text-[#14291F]">
      <motion.article
        className="max-w-[720px] mx-auto px-6 pt-28 pb-16 sm:pt-36 sm:pb-24"
        variants={groupVariants}
        initial={reduceMotion ? false : "hidden"}
        animate={ready ? "visible" : "hidden"}
      >
        <motion.h1
          variants={headingVariants}
          aria-label="Privacy Policy"
          className="text-[clamp(34px,5vw,48px)] leading-[1.1] text-[#2C3820] font-medium tracking-tight m-0"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {["Privacy", "Policy"].map((word) => (
            <span
              key={word}
              aria-hidden="true"
              className="inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em] mr-[0.26em] last:mr-0"
            >
              <motion.span className="inline-block" variants={wordVariants}>
                {word}
              </motion.span>
            </span>
          ))}
        </motion.h1>

        <motion.div variants={fadeVariants}>
          <p className="mt-3 mb-0 text-[12.5px] text-[#777]">
            Last updated: {LAST_UPDATED}
          </p>

          <p className="mt-8 mb-0 text-[15px] text-[#2C3820] leading-[1.75]">
            Organiks Salon and Wellness Spa (&ldquo;Organiks&rdquo;,
            &ldquo;we&rdquo;, &ldquo;us&rdquo;) respects your privacy. This
            policy explains what personal information we collect through this
            website and our online booking form, how we use it, and the choices
            you have. We handle personal information in accordance with the
            Data Privacy Act of 2012 (Republic Act No. 10173) of the
            Philippines.
          </p>

          <Section title="Information we collect">
            <p className="m-0">
              When you book an appointment through our online booking form, we
              collect:
            </p>
            <List
              items={[
                "Your full name, contact number, and email address",
                "Your preferred booking date and time",
                "The services you select",
              ]}
            />
            <p className="m-0">
              If you contact us by phone or email, we also receive your contact
              details and anything else you choose to tell us. This website
              does not have its own contact form or user accounts, and it does
              not process payments.
            </p>
          </Section>

          <Section title="How we use your information">
            <List
              items={[
                "To schedule, confirm, and manage your appointment",
                "To contact you about your booking, such as confirmations, changes, or reminders",
                "To provide the services you requested",
                "To respond to your questions",
                "To comply with legal obligations",
              ]}
            />
            <p className="m-0">
              We use your information only for these purposes unless you agree
              to something else. We do not sell your personal information.
            </p>
          </Section>

          <Section title="Who we share it with">
            <p className="m-0">
              Our online booking form is hosted on Google&rsquo;s platform, so
              the details you submit are processed and stored using Google
              services. Access is limited to the staff who manage bookings. We
              may also disclose information when the law requires it.
            </p>
          </Section>

          <Section title="Cookies and tracking">
            <p className="m-0">
              We do not use analytics, advertising, or tracking tools on this
              website. Some content on the site is provided by Google: the map
              on our Location page, the online booking form, and website fonts.
              When that content loads, Google may collect technical information
              such as your IP address, under{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                Google&rsquo;s Privacy Policy
              </a>
              .
            </p>
          </Section>

          <Section title="How long we keep it">
            <p className="m-0">
              We keep booking information only for as long as we need it to
              provide your service, follow up on your appointment, and meet
              legal and record-keeping requirements. After that, we delete or
              anonymize it.
            </p>
          </Section>

          <Section title="How we protect it">
            <p className="m-0">
              We use reasonable organizational and technical measures to
              protect your information, and we limit access to the people who
              need it to manage bookings. No online service is completely
              secure, so we cannot guarantee absolute security.
            </p>
          </Section>

          <Section title="Your rights">
            <p className="m-0">Under the Data Privacy Act, you have the right to:</p>
            <List
              items={[
                "Be informed about how your information is used",
                "Access the personal information we hold about you",
                "Object to the processing of your information",
                "Correct inaccurate or outdated information",
                "Request that your information be erased or blocked",
                "Receive a copy of your information in a usable format",
                "Claim compensation for damages caused by misuse of your information",
              ]}
            />
            <p className="m-0">
              To exercise any of these rights, contact us using the details
              below. If you are unhappy with how we handle your information,
              you may also file a complaint with the{" "}
              <a
                href="https://privacy.gov.ph"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                National Privacy Commission
              </a>
              .
            </p>
          </Section>

          <Section title="Changes to this policy">
            <p className="m-0">
              We may update this policy from time to time. The &ldquo;Last
              updated&rdquo; date at the top shows when it was last changed.
            </p>
          </Section>

          <Section title="Contact us">
            <p className="m-0">
              For any privacy questions or requests, contact Organiks Salon and
              Wellness Spa:
            </p>
            <ul className="list-none p-0 m-0 space-y-1.5">
              <li>{ADDRESS}</li>
              <li>
                <a href={`tel:${SITE_INFO.phone}`} className={linkClass}>
                  0969 248 7007
                </a>
              </li>
              <li>
                <a href={`mailto:${SITE_INFO.email}`} className={linkClass}>
                  {SITE_INFO.email}
                </a>
              </li>
            </ul>
          </Section>
        </motion.div>
      </motion.article>
    </div>
  );
}