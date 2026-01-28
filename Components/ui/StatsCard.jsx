import { motion } from "framer-motion";

export default function StatsCard({ title, value, subtitle, icon: Icon, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 tracking-tight">{title}</p>
          <p className="text-3xl font-semibold text-[#1D1D1F] mt-2 tracking-tight">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className="p-3 bg-[#F5F5F7] rounded-xl">
            <Icon className="w-5 h-5 text-[#86868B]" />
          </div>
        )}
      </div>
    </motion.div>
  );
}