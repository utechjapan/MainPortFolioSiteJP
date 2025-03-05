// components/portfolio/Timeline.tsx
import { useRef } from "react";
import { motion, useScroll } from "framer-motion";
import TimelineItem from "./TimelineItem";
import { TimelineEvent } from "../../types";

interface TimelineProps {
  events: TimelineEvent[];
}

export default function Timeline({ events }: TimelineProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  return (
    <div ref={ref} className="relative mx-auto max-w-7xl py-10">
      {/* Timeline center line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700 transform -translate-x-1/2 transition-colors"></div>

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
