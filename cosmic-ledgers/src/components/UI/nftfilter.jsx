import React, { useState, useEffect } from "react";
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import { Separator } from "./separator";
import { Input } from "@/components/UI/input";
import GridSwitch from "./GridSwitch";
import WalletProvider, { useWalletContext } from "./WalletContext";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/UI/dialog";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "./table";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/UI/select";
import { Search } from "lucide-react";


const NftFilter = () => {
return(

    <div className="flex flex-row justify-between items-center gap-2">
                                <div className="flex items-center gap-2">
                                    {/* Filters for price */}
                                    <div className="flex">
                                        <Select className="p-0">
                                            <SelectTrigger className="w-[150px] bg-white/5 text-white border-white/10 text-[8px] mt-2 font-medium">
                                                <SelectValue placeholder="Recently Received" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white/10 border-white/10 backdrop-blur-md font-semibold">
                                                <SelectGroup>
                                                    <SelectItem value="Recently Received" className="text-white">
                                                        Recently Received
                                                    </SelectItem>
                                                    <SelectItem value="Price: High to Low" className="text-white">
                                                        Price: High to Low
                                                    </SelectItem>
                                                    <SelectItem value="Price: Low to High" className="text-white">
                                                        Price: Low to High
                                                    </SelectItem>
                                                    <SelectItem value="Recently Listed" className="text-white">
                                                        Recently Listed
                                                    </SelectItem>
                                                    <SelectItem value="Common to Rare" className="text-white">
                                                        Common to Rare
                                                    </SelectItem>
                                                    <SelectItem value="Rare to Common" className="text-white">
                                                        Rare to Common
                                                    </SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Listed & Non-listed */}
                                    <div className="flex">
                                        <Select>
                                            <SelectTrigger className="w-[80px] bg-white/5 text-white border-white/10 text-[9px] mt-2 font-medium">
                                                <SelectValue placeholder="All" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white/10 border-white/10 backdrop-blur-md font-semibold">
                                                <SelectGroup>
                                                    <SelectItem value="All" className="text-white">
                                                        All
                                                    </SelectItem>
                                                    <SelectItem value="Listed" className="text-white">
                                                        Listed
                                                    </SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Button display grid and list */}
                                <div className="flex justify-center	 items-center">
                                    <GridSwitch
                                        onSwitch={(type) => {
                                            // Handle the chart type change
                                            console.log(`Switched to ${type} chart`);
                                        }}
                                        defaultType="bar"
                                    />
                                </div>
                            </div>
);

};

export default NftFilter;