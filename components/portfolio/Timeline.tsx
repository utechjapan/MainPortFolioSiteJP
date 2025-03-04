// components/portfolio/Timeline.tsx
import { useRef } from 'react';
import { motion, useScroll } from 'framer-motion';
import TimelineItem from './TimelineItem';

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  images?: string[];
  tags?: string[];
  side: 'left' | 'right';
  icon?: string;
  iconBg?: string;
}

interface TimelineProps {
  events: TimelineEvent[];
}

export default function Timeline({ events }: TimelineProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  return (
    <div ref={ref} className="relative mx-auto max-w-7xl py-10">
      {/* Timeline center line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700 transform -translate-x-1/2"></div>
      
      {/* Progress indicator */}
      <motion.div 
        className="absolute left-1/2 top-0 bottom-0 w-1 bg-primary transform -translate-x-1/2 origin-top"
        style={{ scaleY: scrollYProgress }}
      />
      
      {/* Timeline events */}
      <div className="relative">
        {events.map((event, index) => (
          <TimelineItem key={event.id} event={event} index={index} />
        ))}
      </div>
    </div>
  );
}

// components/portfolio/TimelineItem.tsx
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import Tag from '../ui/Tag';
import { TimelineEvent } from './Timeline';

interface TimelineItemProps {
  event: TimelineEvent;
  index: number;
}

export default function TimelineItem({ event, index }: TimelineItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
        delay: index * 0.2 
      }
    }
  };

  return (
    <motion.div 
      className={`flex items-center justify-center mb-16 ${event.side === 'left' ? 'md:flex-row-reverse' : 'md:flex-row'}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
    >
      {/* Date */}
      <div className="hidden md:block w-5/12 px-6">
        <h3 className={`text-xl font-bold ${event.side === 'left' ? 'text-left' : 'text-right'}`}>
          {event.date}
        </h3>
      </div>
      
      {/* Center dot */}
      <div className="relative flex-shrink-0 w-10 h-10 rounded-full border-4 border-white dark:border-gray-800 bg-primary z-10 flex items-center justify-center">
        {event.icon ? (
          <i className={`text-white ${event.icon}`}></i>
        ) : (
          <span className="text-white font-bold">{index + 1}</span>
        )}
      </div>
      
      {/* Content card */}
      <div className="w-full md:w-5/12 px-6">
        <div className="mb-2 md:hidden">
          <h3 className="text-xl font-bold">{event.date}</h3>
        </div>
        
        <div className="bg-light-card dark:bg-dark-card p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-3">{event.title}</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            {isExpanded ? event.description : `${event.description.slice(0, 150)}${event.description.length > 150 ? '...' : ''}`}
          </p>
          
          {event.description.length > 150 && (
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-primary hover:text-primary-dark mb-4"
            >
              {isExpanded ? 'Show less' : 'Read more'}
            </button>
          )}
          
          {/* Image gallery */}
          {event.images && event.images.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mb-4">
              {event.images.map((img, i) => (
                <div key={i} className="relative h-20 rounded overflow-hidden">
                  <Image 
                    src={img} 
                    alt={`${event.title} image ${i+1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
          
          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {event.tags.map(tag => (
                <Tag key={tag} text={tag} />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}