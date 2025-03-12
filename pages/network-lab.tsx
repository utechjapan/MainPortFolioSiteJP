// pages/network-lab.tsx
import React from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import { siteConfig } from '../lib/siteConfig';

// Dynamically import the main network topology designer (no SSR)
const NetworkTopologyDesigner = dynamic(
  () => import('../components/network-lab/NetworkTopologyDesigner'),
  { ssr: false, loading: () => <Loading /> }
);

// Loading component
const Loading = () => (
  <div className="w-full h-full min-h-[600px] flex flex-col items-center justify-center bg-white dark:bg-gray-900 rounded-lg p-6 shadow">
    <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mb-4"></div>
    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Loading Network Designer</h3>
    <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
      Initializing the network topology designer. This may take a moment...
    </p>
  </div>
);

const NetworkLab: React.FC = () => {
  return (
    <Layout rightSidebar={false}>
      <Head>
        <title>Network Lab | {siteConfig.title}</title>
        <meta
          name="description"
          content="Interactive network topology designer for creating and testing virtual network configurations."
        />
      </Head>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gray-100 dark:bg-gray-900 pt-4"
      >
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Network Topology Designer
              </h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Create, test, and visualize network topologies with this interactive tool.
                Design your network, configure devices, and test connectivity.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="h-[calc(100vh-200px)] min-h-[600px]">
                <NetworkTopologyDesigner />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                About the Network Lab
              </h2>
              <div className="prose dark:prose-invert max-w-none">
                <p>
                  The Network Topology Designer is a powerful tool for creating and testing virtual
                  network configurations. It allows network engineers, IT professionals, and students
                  to design network topologies, configure devices, and test connectivity between
                  network components.
                </p>
                <h3>Key Features:</h3>
                <ul>
                  <li>
                    <strong>Visual Network Design:</strong> Drag and drop devices, create connections,
                    and organize your network visually.
                  </li>
                  <li>
                    <strong>Device Configuration:</strong> Configure IP addresses, VLANs, routing
                    tables, and more for each device.
                  </li>
                  <li>
                    <strong>Network Simulation:</strong> Test connectivity between devices with ping
                    tests and view packet journeys.
                  </li>
                  <li>
                    <strong>VLAN Support:</strong> Create and manage VLANs, assign ports to VLANs,
                    and visualize VLAN segmentation.
                  </li>
                  <li>
                    <strong>Export Options:</strong> Export your network topology as JSON for later
                    import, or as PDF for documentation.
                  </li>
                </ul>
                <h3>Getting Started:</h3>
                <ol>
                  <li>Add devices from the left toolbar by dragging them onto the canvas.</li>
                  <li>Connect devices by clicking on a port and then clicking on another device's port.</li>
                  <li>Configure device properties like IP addresses using the right panel.</li>
                  <li>Manage VLANs using the VLAN management tool in the top toolbar.</li>
                  <li>Start the simulation to test your network configuration.</li>
                </ol>
                <p>
                  This tool is designed to provide a realistic network simulation experience while
                  remaining accessible and easy to use. Whether you're studying for networking
                  certifications, planning a network deployment, or just experimenting with network
                  concepts, the Network Topology Designer can help you visualize and test your ideas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default NetworkLab;