import React from "react";
// Components (Path eka '../' walin patan ganna ona)
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import LenisScroll from "../components/lenis-scroll";

// Sections
import HeroSection from "../sections/hero-section";
import OurLatestCreation from "../sections/our-latest-creation";
import AboutOurApps from "../sections/about-our-apps";
import OurTestimonials from "../sections/our-testimonials";
import TrustedCompanies from "../sections/trusted-companies";
import GetInTouch from "../sections/get-in-touch";
import SubscribeNewsletter from "../sections/subscribe-newsletter";

export default function Home() {
    return (
        <>
            <LenisScroll />
            <Navbar />
            <main className="px-6 md:px-16 lg:px-24 xl:px-32">
                <HeroSection />
                <OurLatestCreation />
                <AboutOurApps />
                <OurTestimonials />
                <TrustedCompanies />
                <GetInTouch />
                <SubscribeNewsletter />
            </main>
            <Footer />
        </>
    );
}