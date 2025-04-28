"use client";

import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Bot, Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  const footerLinks = [
    {
      title: "Product",
      links: [
        { name: "Features", href: "#features" },
        { name: "Pricing", href: "#pricing" },
        { name: "Testimonials", href: "#testimonials" },
        { name: "Case Studies", href: "#" },
        { name: "API", href: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Documentation", href: "#" },
        { name: "Blog", href: "#" },
        { name: "Guides", href: "#" },
        { name: "Support Center", href: "#" },
        { name: "Partners", href: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "#" },
        { name: "Careers", href: "#" },
        { name: "Press", href: "#" },
        { name: "Contact", href: "#" },
        { name: "Privacy Policy", href: "#" },
      ],
    },
  ];

  const socialLinks = [
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12">
          <motion.div
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="flex items-center mb-6">
              <Bot className="h-8 w-8 text-recruit-primary mr-2" />
              <span className="text-xl font-bold bg-gradient-to-r from-recruit-primary to-recruit-secondary bg-clip-text text-transparent">
                TalentSpark
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
              TalentSpark is an AI-powered recruitment platform that helps companies find the perfect candidates faster and optimize their recruitment budget.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="text-gray-500 hover:text-recruit-primary transition-colors duration-200"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-8"
          >
            {footerLinks.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <motion.h3
                  variants={itemVariants}
                  className="font-semibold text-gray-900 dark:text-white mb-4"
                >
                  {category.title}
                </motion.h3>
                <ul className="space-y-3">
                  {category.links.map((link, linkIndex) => (
                    <motion.li key={linkIndex} variants={itemVariants}>
                      <a
                        href={link.href}
                        className="text-gray-600 dark:text-gray-400 hover:text-recruit-primary dark:hover:text-recruit-primary transition-colors duration-200"
                      >
                        {link.name}
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800"
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} TalentSpark. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a
                href="#"
                className="text-gray-600 dark:text-gray-400 hover:text-recruit-primary dark:hover:text-recruit-primary text-sm transition-colors duration-200"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-gray-600 dark:text-gray-400 hover:text-recruit-primary dark:hover:text-recruit-primary text-sm transition-colors duration-200"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-600 dark:text-gray-400 hover:text-recruit-primary dark:hover:text-recruit-primary text-sm transition-colors duration-200"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-8 bg-gray-100 dark:bg-gray-800 rounded-xl p-6 flex flex-col md:flex-row justify-between items-center"
        >
          <div className="mb-4 md:mb-0">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              Stay updated with our newsletter
            </h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Get the latest news and updates from TalentSpark
            </p>
          </div>
          <div className="flex w-full md:w-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-2 rounded-l-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-recruit-primary w-full md:w-64"
            />
            <Button className="rounded-l-none bg-gradient-to-r from-recruit-primary to-recruit-secondary text-white hover:opacity-90">
              Subscribe
            </Button>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
