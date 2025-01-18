import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react"; // Assuming you're using Lucide React for icons

function SearchDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-white/10 text-white/10">
          <Search /> Search
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#39215B] border-white/10">
        <Input className="border-white/10 text-white" placeholder="Search..." />
      </DialogContent>
    </Dialog>
  );
}

export default SearchDialog;