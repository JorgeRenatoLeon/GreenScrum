"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ICTSustainability() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Header Section */}
      <section className="bg-green-700 text-white text-center py-20 px-6">
        <h1 className="text-5xl font-extrabold">ICT & Sustainability</h1>
        <p className="text-lg mt-4 max-w-2xl mx-auto">
          Discover how Information and Communication Technology (ICT) contributes to a more
          sustainable world, and how Agile and Scrum methodologies can drive green innovation.
        </p>
      </section>

      {/* General Sustainability */}
      <section className="bg-white py-16 px-6">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center">What is Sustainability?</h2>
          <p className="text-lg text-gray-700 text-center mt-4 max-w-3xl mx-auto">
            Sustainability is about meeting present needs without compromising future generations&apos; ability to meet theirs.
          </p>
          <div className="flex justify-center mt-8">
            <Image
              src="/companies/SDG-playbook-purpose-1024x322.webp"
              width={900}
              height={350}
              alt="Sustainability Concept"
            />
          </div>
        </div>
      </section>

      {/* ICT in Sustainability */}
      <section className="container mx-auto py-16 px-6">
        <h2 className="text-3xl font-bold text-center">The Role of ICT in Sustainability</h2>
        <p className="text-lg text-gray-700 text-center mt-4 max-w-3xl mx-auto">
          ICT plays a vital role in reducing environmental impacts by enabling smart energy usage,
          digital collaboration, remote work, and efficient data management.
        </p>

        {/* Bullet Points for ICT in Sustainability (Centered) */}
        <div className="mt-8 text-center">
          <ul className="list-disc pl-6 inline-block text-left">
            <li>
              <strong>Smart Energy Usage:</strong> ICT optimizes energy use through smart grids and efficient devices, reducing waste.
            </li>
            <li>
              <strong>Digital Collaboration:</strong> Remote work tools reduce the need for travel, cutting down on transportation emissions.
            </li>
            <li>
              <strong>Remote Work:</strong> Cloud tools enable remote work, reducing commuting emissions and offering flexible hours.
            </li>
            <li>
              <strong>Efficient Data Management:</strong> ICT tools optimize supply chains, reduce waste, and track sustainability goals.
            </li>
          </ul>
        </div>

        <div className="flex justify-center mt-8">
          <Image
            src="/companies/Typology-of-the-effects-of-ICT-on-environmental-sustainability-adapted-from-Hilty.png"
            width={900}
            height={350}
            alt="ICT in Sustainability"
          />
        </div>
      </section>

      {/* Scrum in Sustainability */}
      <section className="container mx-auto py-16 px-6 bg-white">
        <h2 className="text-3xl font-bold text-center">Scrum Process & Sustainability</h2>
        <p className="text-lg text-gray-700 text-center mt-4 max-w-3xl mx-auto">
          Scrum helps teams develop sustainable products through feedback, iteration, and resource efficiency.
        </p>

        {/* Scrum Roles (Centered) */}
        <div className="mt-8 text-center">
          <ul className="list-disc pl-6 inline-block text-left">
            <li>
              <strong>Product Owner:</strong> Defines the product and ensures sustainability goals are met during development.
            </li>
            <li>
              <strong>Scrum Master:</strong> Facilitates the team, ensuring eco-friendly practices and removing obstacles to sustainability.
            </li>
            <li>
              <strong>Development Team:</strong> Develops energy-efficient, sustainable solutions, ensuring minimal environmental impact.
            </li>
          </ul>
        </div>

        <div className="flex justify-center mt-8">
          <Image
            src="/companies/Scrum-Process.jpg"
            width={900}
            height={850}
            alt="Scrum Process"
          />
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-green-700 text-white py-16 text-center">
        <h2 className="text-3xl font-bold">Join the Sustainable Future!</h2>
        <p className="text-lg mt-4 max-w-2xl mx-auto">
          Explore how GreenScrum integrates Agile principles with sustainability to create impact-driven teams.
        </p>
        <Link href="/onboarding">
          <Button className="bg-white text-green-700 font-bold mt-6 hover:bg-gray-200">
            Get Started with GreenScrum
          </Button>
        </Link>
      </section>
    </div>
  );
}
