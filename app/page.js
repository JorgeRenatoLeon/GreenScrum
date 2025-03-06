import React from "react";
import Link from "next/link";
import {
  ChevronRight,
  Layout,
  Calendar,
  BarChart,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import CompanyCarousel from "@/components/company-carousel";
import Image from "next/image";

const faqs = [
  {
    question: "What is SCRUM?",
    answer:
      "SCRUM is an agile framework that helps teams manage complex projects through short, iterative cycles called sprints.",
  },
  {
    question: "How can I get started with GreenScrum?",
    answer:
      "Simply visit our website and sign up for an account. Once you're signed up, you can start setting sustainability goals, tracking carbon emissions, and optimizing your team's agile workflows for a greener future."},
  {
    question: "Can GreenScrum be used by organizations of any size?",
    answer:
      "Absolutely! It is designed to be scalable and flexible. It works great for small teams and can easily grow with your organization as it expands. Our user-friendly interface ensures that teams of any size can quickly adapt and start benefiting from ZCRUM's features.",
  },
  {
    question: "Is SUSAF important to do ?",
    answer:
      "No, it is not compulsory but it is a key practice for teams looking to align their agile workflows with sustainable development principles."},
  {
    question: "Can GreenScrum handle multiple projects simultaneously?",
    answer:
      "Yes, It is built to manage multiple projects concurrently. You can easily switch between projects, and get a bird's-eye view of all your ongoing work.",
  },
  {
    question: "Is there a learning curve for new users?",
    answer:
      "While GreenScrum is packed with features, we've designed it with user-friendliness in mind. New users can quickly get up to speed thanks to our intuitive interface, helpful onboarding process, and comprehensive documentation.",
  },
];


export default function Home() {
  return (
    <div className="min-h-screen">
      <section className="container mx-auto py-20 text-center">
        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-extrabold gradient-title pb-6 flex flex-col">
        Empowering Agile Teams for a Sustainable Future <br />
         
        </h1>
     
      </section>


      {/* Companies Carousel */}
      <section className="pt-20">
        <div className="container mx-auto">
          <CompanyCarousel />
          <h2 className="text-2xl font-bold mb-12 text-center text-gray-900">
            Sustainable Development Goals
          </h2>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-900 py-20 px-5">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold mb-12 text-center">
            Frequently Asked Questions
          </h3>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

    </div>
  );
}
