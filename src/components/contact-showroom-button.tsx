"use client";

import { ContactCallLink } from "@/components/contact-actions";

interface ContactShowroomButtonProps {
  showroomId: string;
  phone: string;
  className?: string;
  label?: string;
  showNumber?: boolean;
}

export function ContactShowroomButton({
  showroomId,
  phone,
  className,
  label = "اتصال",
  showNumber = false,
}: ContactShowroomButtonProps) {
  const handleClick = async () => {
    try {
      await fetch("/api/track/click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "showroom_contact",
          targetId: showroomId,
          metadata: {
            itemName: "المعرض نفسه",
            itemType: "showroom",
          },
        }),
      });
    } catch (error) {
      console.error("Failed to track contact click:", error);
    }
  };

  return (
    <ContactCallLink
      phone={phone}
      label={label}
      showNumber={showNumber}
      onClick={() => void handleClick()}
      className={className}
    />
  );
}
