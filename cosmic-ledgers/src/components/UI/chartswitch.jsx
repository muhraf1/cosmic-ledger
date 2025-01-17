import { useState } from "react"
import { motion } from "framer-motion"
import { BarChart3, PieChart } from 'lucide-react'

export default function ChartSwitch({ onSwitch, defaultType = 'bar' }) {
  const [chartType, setChartType] = useState(defaultType)

  const handleSwitch = (type) => {
    setChartType(type)
    onSwitch?.(type)
  }

  const getBorderRadius = (type) => {
    switch(type) {
      case 'bar':
        return '5px 0 0 5px'; // Top-left and bottom-left corners rounded, others flat for 'bar'
      case 'pie':
        return '0 5px 5px 0'; // Top-right and bottom-right corners rounded, others flat for 'pie'
      default:
        return '0'; // Default to no border radius if type is unknown
    }
  }

  return (
    <div className="inline-flex items-center rounded-lg bg-transparent p-1">
      <motion.button
        style={{ borderRadius: getBorderRadius('bar') }}
        className={`relative flex h-8 items-center gap-2 px-3 text-sm ${
          chartType === 'bar' 
            ? 'bg-[#4B2D68] text-[#DCCAE6]' 
            : 'bg-white/5 text-[#DCCAE6] hover:bg-white/10'
        }`}
        onClick={() => handleSwitch('bar')}
      >
        <BarChart3 className="h-4 w-4" />
     
      </motion.button>

      <motion.button
        style={{ borderRadius: getBorderRadius('pie') }}
        className={`relative flex h-8 items-center gap-2 px-3 text-sm ${
          chartType === 'pie' 
            ? 'bg-[#4B2D68] text-[#DCCAE6]' 
            : 'bg-white/5 text-[#DCCAE6] hover:bg-white/10'
        }`}
        onClick={() => handleSwitch('pie')}
      >
        <PieChart className="h-4 w-4" />
     
      </motion.button>
    </div>
  )
}