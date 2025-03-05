import Head from "next/head";
import Layout from "../components/layout/Layout";
import { motion } from "framer-motion";
import Timeline from "../components/portfolio/Timeline";
import { siteConfig } from "../lib/siteConfig";
import { TimelineEvent } from "../types";

// Timeline events extracted from your work experience content
const timelineEvents: TimelineEvent[] = [
  {
    id: "1",
    date: "2023 – Present",
    title: "NTT West | Digital Government",
    description:
      "Role: Infrastructure & System Engineer\n\nResponsibilities:\n- Building and maintaining IT systems for municipalities\n- Configuring networks with Cisco Catalyst and FortiGate\n- Operating monitoring systems (Hinemos, Zabbix)\n\nAchievements: Improved system reliability and operational efficiency.",
    side: "right",
    iconBg: "#00bcd4",
  },
  {
    id: "2",
    date: "2020 – 2021",
    title: "Polaris Export",
    description:
      "Role: Sales & Marketing\n\nResponsibilities:\n- Overseeing sales and customer service\n- Managing SNS campaigns and YouTube content creation\n\nAchievements: Increased online follower count by 30%.",
    side: "left",
    iconBg: "#4caf50",
  },
  {
    id: "3",
    date: "2017 – 2020",
    title: "Bagus Bar (芝浦アイランド店)",
    description:
      "Role: Hall Staff, later Deputy Manager\n\nResponsibilities:\n- Providing high-quality customer service and operational support\n- Training staff, managing shifts, and controlling costs\n- Handling SNS operations and promotional activities\n\nAchievements: Reduced employee turnover by 15% and enhanced service quality.",
    side: "right",
    iconBg: "#ff9800",
  },
];

export default function Portfolio() {
  return (
    <Layout rightSidebar={false}>
      <Head>
        <title>Portfolio of Chikara Inohara | {siteConfig.title}</title>
        <meta
          name="description"
          content="Overview of my work experience, technical skills, and selected projects in IT infrastructure, networking, and innovative technology solutions."
        />
      </Head>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto px-4 py-8"
      >
        {/* Language Toggle */}
        <div className="text-right mb-4">
          <a href="/jp/portfolio/" className="text-primary hover:underline">
            日本語版を見る
          </a>
        </div>

        <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white transition-colors">
          Portfolio
        </h1>
        <p className="text-gray-700 dark:text-gray-300 mb-8 transition-colors">
          Welcome to my professional portfolio! Here you'll find an overview of
          my work experience, technical skills, and selected projects that
          showcase my passion for IT infrastructure, networking, and innovative
          technology solutions.
        </p>

        {/* Overview Section */}
        <section className="mb-12 bg-light-card dark:bg-dark-card p-6 rounded-lg shadow-md dark:shadow-none transition-colors">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white transition-colors">
            Overview
          </h2>
          <p className="text-gray-700 dark:text-gray-300 transition-colors">
            I am a dedicated system and network engineer with extensive
            experience designing, deploying, and maintaining IT systems for
            municipalities and enterprises. My career spans technical
            engineering, sales, and digital marketing—each role contributing to
            enhanced system reliability, operational efficiency, and digital
            presence.
          </p>
        </section>

        <hr className="my-8 border-gray-300 dark:border-gray-700 transition-colors" />

        {/* Work Experience Timeline using the Timeline component */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white transition-colors">
            Work Experience Timeline
          </h2>
          <Timeline events={timelineEvents} />
        </section>

        <hr className="my-8 border-gray-300 dark:border-gray-700 transition-colors" />

        {/* Technical Skills Section */}
        <section className="mb-12 bg-light-card dark:bg-dark-card p-6 rounded-lg shadow-md dark:shadow-none transition-colors">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white transition-colors">
            Technical Skills
          </h2>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 transition-colors">
            <li>
              <strong className="text-gray-900 dark:text-white transition-colors">
                Networking:
              </strong>{" "}
              Cisco Catalyst, FortiGate, VLAN configuration, network
              troubleshooting
            </li>
            <li>
              <strong className="text-gray-900 dark:text-white transition-colors">
                Server Administration:
              </strong>{" "}
              Windows Server, Linux (RHEL, CentOS), virtualization
            </li>
            <li>
              <strong className="text-gray-900 dark:text-white transition-colors">
                Monitoring &amp; Management:
              </strong>{" "}
              Hinemos, Zabbix, performance tuning
            </li>
            <li>
              <strong className="text-gray-900 dark:text-white transition-colors">
                Cloud &amp; Infrastructure:
              </strong>{" "}
              AWS Cloud Practitioner, Azure Fundamentals (AZ-900)
            </li>
            <li>
              <strong className="text-gray-900 dark:text-white transition-colors">
                Scripting &amp; Automation:
              </strong>{" "}
              Python, PowerShell
            </li>
            <li>
              <strong className="text-gray-900 dark:text-white transition-colors">
                Certifications:
              </strong>{" "}
              CCNA, IT Passport, LPIC Level 1, AWS Cloud Practitioner, AZ-900
            </li>
          </ul>
        </section>

        <hr className="my-8 border-gray-300 dark:border-gray-700 transition-colors" />

        {/* Selected Projects Section */}
        <section className="mb-12 bg-light-card dark:bg-dark-card p-6 rounded-lg shadow-md dark:shadow-none transition-colors">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white transition-colors">
            Selected Projects
          </h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">
                Proxmox Homelab &amp; Hugo Blog
              </h3>
              <p className="text-gray-700 dark:text-gray-300 transition-colors">
                <strong>Description:</strong> Designed and implemented a
                Proxmox-based homelab hosting a Hugo-powered blog. Automated
                content deployment from Obsidian using PowerShell and Python.
              </p>
              <p className="text-gray-700 dark:text-gray-300 transition-colors">
                <strong>Technologies:</strong> Proxmox VE, Hugo, Nginx, SCP,
                Python, PowerShell
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">
                Secure Network &amp; Monitoring System for Municipalities
              </h3>
              <p className="text-gray-700 dark:text-gray-300 transition-colors">
                <strong>Description:</strong> Led the design and deployment of a
                secure IT infrastructure for local governments, integrating
                advanced network devices and monitoring tools.
              </p>
              <p className="text-gray-700 dark:text-gray-300 transition-colors">
                <strong>Technologies:</strong> Cisco, FortiGate, Hinemos, Zabbix
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">
                Digital Marketing for Polaris Export
              </h3>
              <p className="text-gray-700 dark:text-gray-300 transition-colors">
                <strong>Description:</strong> Managed digital marketing
                campaigns and produced YouTube content to increase online brand
                presence.
              </p>
              <p className="text-gray-700 dark:text-gray-300 transition-colors">
                <strong>Achievements:</strong> Achieved a 30% increase in online
                followers.
              </p>
            </div>
          </div>
        </section>

        <hr className="my-8 border-gray-300 dark:border-gray-700 transition-colors" />

        {/* Resume Section */}
        <section className="mb-12 bg-light-card dark:bg-dark-card p-6 rounded-lg shadow-md dark:shadow-none transition-colors">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white transition-colors">
            Resume
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4 transition-colors">
            For a detailed view of my professional background, please download
            my resume:
          </p>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 transition-colors">
            <li>
              <a
                href="/resume/resume_jp.pdf"
                className="text-primary hover:underline"
              >
                Download Resume (Japanese)
              </a>
            </li>
            {/*
            Uncomment if an English resume is available:
            <li>
              <a href="/resume/resume_en.pdf" className="text-primary hover:underline">
                Download Resume (English)
              </a>
            </li>
            */}
          </ul>
        </section>

        <p className="text-gray-700 dark:text-gray-300 italic transition-colors">
          Thank you for visiting my portfolio. Feel free to contact me for
          collaborations or further information!
        </p>
      </motion.div>
    </Layout>
  );
}
