'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { useReducedMotion } from 'framer-motion'
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi'
import type { CommercialExperienceItem } from '@/domain/models'
import FeatureCard from './FeatureCard'

interface ExperienceCarouselProps {
  items: CommercialExperienceItem[]
}

const ExperienceCarousel: React.FC<ExperienceCarouselProps> = ({ items }) => {
  const reduceMotion = useReducedMotion()
  const autoplayPlugin = useMemo(
    () =>
      reduceMotion
        ? undefined
        : Autoplay({
            delay: 5000,
            stopOnInteraction: false,
            stopOnMouseEnter: true,
            stopOnFocusIn: true,
          }),
    [reduceMotion]
  )

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: 'start',
      loop: items.length > 4,
      dragFree: false,
    },
    autoplayPlugin ? [autoplayPlugin] : []
  )

  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const updateScrollState = useCallback(() => {
    if (!emblaApi) return
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return

    updateScrollState()
    emblaApi.on('select', updateScrollState)
    emblaApi.on('reInit', updateScrollState)

    return () => {
      emblaApi.off('select', updateScrollState)
      emblaApi.off('reInit', updateScrollState)
    }
  }, [emblaApi, updateScrollState])

  const handlePrev = () => {
    if (!emblaApi) return
    emblaApi.scrollPrev()
  }

  const handleNext = () => {
    if (!emblaApi) return
    emblaApi.scrollNext()
  }

  return (
    <div>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex -ml-5">
          {items.map((item, index) => (
            <div
              key={`${item.title}-${item.order}`}
              className="pl-5 min-w-0 flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] xl:flex-[0_0_25%]"
            >
              <FeatureCard
                title={item.title}
                description={item.description}
                index={index}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={handlePrev}
          disabled={!canScrollPrev}
          aria-label="Ver tarjeta anterior"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white transition-all duration-200 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
        >
          <FiArrowLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={!canScrollNext}
          aria-label="Ver siguiente tarjeta"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white transition-all duration-200 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
        >
          <FiArrowRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

export default ExperienceCarousel