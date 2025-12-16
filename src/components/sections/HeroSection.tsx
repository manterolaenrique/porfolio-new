'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Button from '@/components/ui/Button'
import { Hero as HeroType } from '@/domain/models'
import { urlFor } from '@/services/cms'
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from 'react-icons/fa'

interface HeroSectionProps {
  data: HeroType
}

const HeroSection: React.FC<HeroSectionProps> = ({ data }) => {
  const [typingIndex, setTypingIndex] = useState(0)
  const [currentText, setCurrentText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  // Typing effect
  useEffect(() => {
    if (!data?.stackSummary) return

    const currentStack = data.stackSummary[typingIndex % data.stackSummary.length]
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (currentText.length < currentStack.length) {
          setCurrentText(currentStack.slice(0, currentText.length + 1))
        } else {
          setTimeout(() => setIsDeleting(true), 2000)
        }
      } else {
        if (currentText.length > 0) {
          setCurrentText(currentStack.slice(0, currentText.length - 1))
        } else {
          setIsDeleting(false)
          setTypingIndex((prev) => (prev + 1) % data.stackSummary.length)
        }
      }
    }, isDeleting ? 50 : 100)

    return () => clearTimeout(timeout)
  }, [currentText, isDeleting, typingIndex, data?.stackSummary])

  const getSocialIcon = (type: string) => {
    const icons: Record<string, React.ElementType> = {
      github: FaGithub,
      linkedin: FaLinkedin,
      twitter: FaTwitter,
      email: FaEnvelope,
    }
    return icons[type] || FaEnvelope
  }

  const getInitials = (fullName: string) => {
    if (!fullName) return ''
    return fullName
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
  }

  if (!data) return null

  const avatarUrl = data?.avatar ? urlFor(data.avatar).width(400).height(400).url() : null

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-brand-bgSoft to-white dark:from-brand-bg dark:to-brand-surfaceDark">
      {/* Particles Background (opcional) */}
      {data.showParticles && (
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-brand-primary rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-brand-secondary rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-brand-accent rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.p
              className="text-brand-primary font-semibold mb-4 text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              ¡Hola! 👋 Soy
            </motion.p>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              {data.highlightSurname ? (
                <>
                  <span className="text-brand-text dark:text-white">
                    {data.name.split(' ').slice(0, -1).join(' ')}
                  </span>{' '}
                  <span className="text-brand-primary">
                    {data.name.split(' ').slice(-1)}
                  </span>
                </>
              ) : (
                <span className="text-brand-text dark:text-white">{data.name}</span>
              )}
            </h1>

            <h2 className="text-2xl md:text-3xl text-brand-muted dark:text-gray-300 mb-4">
              {data.role}
            </h2>

            {/* Typing Effect */}
            <div className="flex items-center mb-6 h-12">
              <span className="text-xl text-brand-primary font-mono">
                {currentText}
                <span className="animate-blink">|</span>
              </span>
            </div>

            <p className="text-lg text-brand-muted dark:text-gray-400 mb-8 max-w-xl">
              {data.shortPitch}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 mb-8">
              {data.ctaPrimary && (
                <Button
                  variant="primary"
                  size="lg"
                  href={data.ctaPrimary.href}
                  asLink
                >
                  {data.ctaPrimary.label}
                </Button>
              )}
              {data.ctaSecondary && (
                <Button
                  variant="outline"
                  size="lg"
                  href={data.ctaSecondary.href}
                  asLink
                >
                  {data.ctaSecondary.label}
                </Button>
              )}
            </div>

            {/* Social Links */}
            {data.socialLinks && data.socialLinks.length > 0 && (
              <div className="flex gap-4">
                {data.socialLinks.map((social) => {
                  const Icon = getSocialIcon(social.type)
                  return (
                    <motion.a
                      key={social._id}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-brand-primary hover:text-white flex items-center justify-center transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label={social.label}
                    >
                      <Icon size={20} />
                    </motion.a>
                  )
                })}
              </div>
            )}
          </motion.div>

          {/* Right Content - Avatar */}
          <motion.div
            className="flex justify-center lg:justify-end"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div
              className="relative w-80 h-80 lg:w-96 lg:h-96"
              animate={
                data.showParallax
                  ? {
                      y: [0, -20, 0],
                    }
                  : {}
              }
              transition={
                data.showParallax
                  ? {
                      duration: 5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }
                  : {}
              }
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-full blur-2xl opacity-30 animate-pulse"></div>
              <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-2xl">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={data.name}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                    <span className="text-4xl font-bold text-gray-600 dark:text-gray-200">
                      {getInitials(data.name)}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-brand-primary rounded-full flex justify-center">
          <div className="w-2 h-2 bg-brand-primary rounded-full mt-2"></div>
        </div>
      </motion.div>
    </section>
  )
}

export default HeroSection
