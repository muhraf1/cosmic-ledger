import { React, useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"


const Content = () => {

    const [timeRange, setTimeRange] = React.useState("90d")
    const filteredData = chartData.filter((item) => {
        const date = new Date(item.date)
        const referenceDate = new Date("2024-06-30")
        let daysToSubtract = 90
        if (timeRange === "30d") {
            daysToSubtract = 30
        } else if (timeRange === "7d") {
            daysToSubtract = 7
        }
        const startDate = new Date(referenceDate)
        startDate.setDate(startDate.getDate() - daysToSubtract)
        return date >= startDate
    })
    return (

        <div className="flex items-center justify-between w-full">
            {/* title & date pick */}
            <div className="flex justify-between ">
                {/* title */}
                <div>
                    Net Worth Performance
                </div>
                {/* date piclk */}


            </div>
        </div>
    )

}


export default Content;