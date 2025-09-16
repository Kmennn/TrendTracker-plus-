import React from 'react';
import { motion } from 'framer-motion';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 },
};

const AudienceDemographics = () => {
  const ageData = {
    labels: ['18-24', '25-34', '35-44', '45-54', '55+'],
    datasets: [
      {
        label: 'Age Distribution',
        data: [30, 45, 15, 8, 2],
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const genderData = {
    labels: ['Male', 'Female', 'Non-binary'],
    datasets: [
      {
        label: 'Gender Breakdown',
        data: [48, 50, 2],
        backgroundColor: ['rgba(54, 162, 235, 0.7)', 'rgba(255, 99, 132, 0.7)', 'rgba(255, 206, 86, 0.7)'],
        borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)', 'rgba(255, 206, 86, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const languageData = {
    labels: ['English', 'Spanish', 'Mandarin', 'Hindi', 'Other'],
    datasets: [
      {
        label: 'Primary Language',
        data: [60, 15, 10, 5, 10],
        backgroundColor: [
            'rgba(75, 192, 192, 0.7)',
            'rgba(153, 102, 255, 0.7)',
            'rgba(255, 159, 64, 0.7)',
            'rgba(255, 99, 132, 0.7)',
            'rgba(54, 162, 235, 0.7)',
        ],
        borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const countryData = {
    labels: ['USA', 'India', 'UK', 'Canada', 'Australia'],
    datasets: [
      {
        label: 'Top Countries',
        data: [40, 25, 15, 10, 5],
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        labels: {
          color: 'white',
        },
      },
    },
    scales: {
      y: {
        ticks: {
          color: 'white',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        }
      },
      x: {
        ticks: {
          color: 'white',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        }
      },
    },
  };

  const pieChartOptions = {
    plugins: {
      legend: {
        labels: {
          color: 'white',
        },
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-gray-800/50 rounded-xl p-8 mb-8 border border-gray-700/50"
    >
      <motion.h2 variants={itemVariants} className="text-3xl font-bold text-white mb-6">
        Audience Demographics
      </motion.h2>
      <motion.p variants={itemVariants} className="text-gray-400 mb-8">
        An aggregated, anonymized breakdown of the audience discussing a trend.
      </motion.p>
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Age Distribution</h3>
          <Pie data={ageData} options={pieChartOptions} />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Gender Breakdown</h3>
          <Pie data={genderData} options={pieChartOptions} />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Primary Language</h3>
          <Bar data={languageData} options={chartOptions} />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Top Countries</h3>
          <Bar data={countryData} options={chartOptions} />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AudienceDemographics;
