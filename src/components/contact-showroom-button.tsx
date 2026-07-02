"use client";

import { Button } from "@/components/ui/button";

interface ContactShowroomButtonProps {
  showroomId: string;
  phone: string;
  className?: string;
}

export function ContactShowroomButton({
  showroomId,
  phone,
  className,
}: ContactShowroomButtonProps) {
  const handleClick = async () => {
    try {
      await fetch("/api/track/click", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "showroom_contact",
          targetId: showroomId,
          metadata: {
            itemName: "المعرض نفسه",
            itemType: "showroom"
          }
        }),
      });
    } catch (error) {
      console.error("Failed to track contact click:", error);
    }
  };

  return (
    <Button
      asChild
      variant="outline"
      className={className || "h-12 rounded-xl font-black bg-white"}
      onClick={handleClick}
    >
      <a href={`tel:${phone}`} dir="ltr">
        اتصال
      </a>
    </Button>
  );
}
