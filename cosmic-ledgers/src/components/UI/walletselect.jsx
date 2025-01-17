import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


const  WalletSelect = () => {
  return (
    <div className="w-full flex justify-between p-2 py-4 pt-6">
        {/* selec walet */}
        <div className="w-full">
        <Select>
  <SelectTrigger className="w-[300px] bg-white text-[#B470D8]">
    <SelectValue placeholder="Select a Wallet " />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel className="text-[#B470D8]">Wallets</SelectLabel>
      <SelectItem 
        value="All Wallet" 
        className="text-[#B470D8] hover:text-[#ffff] hover:bg-[#B470D8]"
      >
        All Wallet
      </SelectItem>
      <SelectItem 
        value="0x08c03cf4edbb9a8ec2f5629bd0e1549b636d0080" 
        className="text-[#B470D8] hover:text-[#ffff] hover:bg-[#B470D8]"
      >
        0x08c03cf4edbb9a8ec2f5629bd0e1549b636d0080
      </SelectItem>
      <SelectItem 
        value="EdL7bi7599Mwx9VDv8BVxdK7BD63Y1iVrgpZk7tZibuz" 
        className="text-[#B470D8] hover:text-[#ffff] hover:bg-[#B470D8]"
      >
        EdL7bi7599Mwx9VDv8BVxdK7BD63Y1iVrgpZk7tZibuz
      </SelectItem>
      <SelectItem 
        value="0x69D4226f66D90512c920bF594673bF2FC1141f91" 
        className="text-[#B470D8] hover:text-[#ffff] hover:bg-[#B470D8]"
      >
        0x69D4226f66D90512c920bF594673bF2FC1141f91
      </SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>
    </div>
    {/* age of wallet  */}
    <div>

    <Button className="bg-[#8C4FAD]"> 700 Days</Button>

    </div>
    </div>
  )
}

export default WalletSelect;