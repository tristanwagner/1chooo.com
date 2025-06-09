import { getIcon } from "@/components/icons";
import { Swords } from "lucide-react";

import "@/styles/icon-box.css";

interface IconBoxProps {
  iconName: string;
}

function IconBox({ iconName }: IconBoxProps) {
  const Icon = getIcon(iconName) || Swords;

  return (
    <div className="icon-box bg-border-gradient-onyx text-primary flex items-center justify-center text-lg shadow-shadow-1 relative rounded-xl w-[40px] h-[40px] md:w-[48px] md:h-[48px] md:text-xl z-1 before:bg-eerie-black-1 before:rounded-xl before:absolute before:content-[''] before:inset-[1px]">
      <Icon />
    </div>
  );
}

export default IconBox;
