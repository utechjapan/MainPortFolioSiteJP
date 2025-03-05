// pages/portfolio.tsx
import Layout from "../components/layout/Layout";
import Timeline from "../components/portfolio/Timeline";
import Head from "next/head";
import { motion } from "framer-motion";
import { TimelineEvent } from "../types";

// Sample data - in a real implementation, this would come from your content files
const timelineEvents: TimelineEvent[] = [
  {
    id: "1",
    date: "25/07/1987",
    title: "Day of Birth",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fugiat, animi. Cras elementum odio a felis sollicitudin, quis vehicula erat luctus. Mauris egestas massa turpis, ac tempor enim rutrum in.",
    images: [
      "/images/placeholder1.jpg",
      "/images/placeholder2.jpg",
      "/images/placeholder3.jpg",
    ],
    side: "right",
    iconBg: "#00bcd4",
  },
  {
    id: "2",
    date: "25/07/2000",
    title: "Learning to Code",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fugiat, animi. Donec sed maximus risus. Nullam laoreet tincidunt fermentum. Sed maximus fringilla quam at facilisis.",
    side: "left",
    tags: ["programming", "education"],
    iconBg: "#4caf50",
  },
  {
    id: "3",
    date: "01/09/2002",
    title: "Markup and Little Wheels",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fugiat, animi. Praesent molestie fringilla sapien at fringilla. Nulla facilisi. Integer egestas augue felis, vel rhoncus dolor commodo non.",
    side: "right",
    iconBg: "#009688",
  },
  {
    id: "4",
    date: "15/06/2010",
    title: "First Developer Job",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fugiat, animi. Nulla facilisi. Integer egestas augue felis, vel rhoncus dolor commodo non. Praesent auctor, augue at rutrum imperdiet.",
    side: "left",
    tags: ["career", "development"],
    iconBg: "#ff9800",
  },
  {
    id: "5",
    date: "03/11/2015",
    title: "Started My Own Company",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fugiat, animi. Sed ultricies, magna eu convallis molestie, sem nulla egestas nunc, vel lobortis neque tellus vitae enim. Donec sed maximus risus.",
    side: "right",
    images: ["/images/placeholder4.jpg", "/images/placeholder5.jpg"],
    tags: ["business", "entrepreneurship"],
    iconBg: "#e91e63",
  },
];

export default function Portfolio() {
  return (
    <Layout rightSidebar={false} toc={null}>
      <Head>
        <title>Portfolio | My Timeline</title>
        <meta
          name="description"
          content="My professional journey and accomplishments"
        />
      </Head>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            My Journey
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            A timeline of my professional development, key life events, and
            major milestones.
          </p>
        </div>

        <Timeline events={timelineEvents} />
      </motion.div>
    </Layout>
  );
}
