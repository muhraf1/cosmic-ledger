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
    <div className="w-full flex justify-between p-4">
        {/* selec walet */}
        <div className="w-full">
        <Select>
  <SelectTrigger className="w-[400px] bg-white text-[#B470D8]">
    <SelectValue placeholder="Select a Wallet " />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel className="text-[#B470D8]">Wallets</SelectLabel>
      <SelectItem value="0x08c03cf4edbb9a8ec2f5629bd0e1549b636d0080" className="text-[#B470D8]">0x08c03cf4edbb9a8ec2f5629bd0e1549b636d0080</SelectItem>
      <SelectItem value="banana" className="text-[#B470D8]">Banana</SelectItem>
      <SelectItem value="blueberry" className="text-[#B470D8]">Blueberry</SelectItem>
      <SelectItem value="grapes" className="text-[#B470D8]">Grapes</SelectItem>
      <SelectItem value="pineapple" className="text-[#B470D8]">Pineapple</SelectItem>
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