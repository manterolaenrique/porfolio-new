import React from 'react'
import { FaEnvelope, FaGithub, FaHeart, FaLinkedin } from 'react-icons/fa'
import { getContactInfo } from '@/services/cms'

const Footer = async () => {
  const currentYear = new Date().getFullYear()
  const contactInfo = await getContactInfo()

  const socialLinks = [
    contactInfo?.githubUsername
      ? {
          icon: FaGithub,
          href: `https://github.com/${contactInfo.githubUsername}`,
          label: 'GitHub',
        }
      : null,
    contactInfo?.linkedinUrl
      ? { icon: FaLinkedin, href: contactInfo.linkedinUrl, label: 'LinkedIn' }
      : null,
    contactInfo?.primaryEmail
      ? {
          icon: FaEnvelope,
          href: `mailto:${contactInfo.primaryEmail}`,
          label: 'Email',
        }
      : null,
  ].filter((link): link is NonNullable<typeof link> => Boolean(link))

  return (
    <footer className="bg-brand-surfaceDark text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold mb-4">
              <span className="text-white">Enrique</span>
              <span className="text-brand-primary"> Manterola</span>
            </h3>
            <p className="text-gray-400">
              Preventa técnica y soluciones Full Stack orientadas a resultados de negocio.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <a href="#hero" className="hover:text-brand-primary transition-colors">
                  Inicio
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-brand-primary transition-colors">
                  Sobre Mí
                </a>
              </li>
              <li>
                <a href="#projects" className="hover:text-brand-primary transition-colors">
                  Proyectos
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-brand-primary transition-colors">
                  Contacto
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Sígueme</h4>
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-800 hover:bg-brand-primary flex items-center justify-center transition-colors"
                  aria-label={link.label}
                >
                  <link.icon size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p className="flex items-center justify-center gap-2">
            © {currentYear} Enrique Manterola. Hecho con <FaHeart className="text-brand-accent" /> y React
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
