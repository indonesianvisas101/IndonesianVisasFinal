"use client";

import React from "react";

const DiscountCard = ({ dict }: { dict?: any }) => {
  const t = dict?.discount_card || {};

  return (
    <div
      className="
        rounded-3xl
        bg-gradient-to-br from-primary/10 to-accent/10
        dark:from-white/5 dark:to-white/5
        backdrop-blur-xl
        border border-black/5 dark:border-white/10
        p-8
        shadow-[0_20px_50px_-20px_rgba(75,0,130,0.4)]
      "
    >
      <h3 className="text-2xl font-bold mode-aware-text mb-4">
        {t.title || "Special Visa Discounts"}
      </h3>

      <ul className="space-y-3 mode-aware-subtext">
        <li>• {t.feature1 || "20% OFF for Group Applications (2+ people)"}</li>
        <li>• {t.feature2 || "5% OFF for Regular Visa Applications"}</li>
        <li>• {t.feature3 || "Limited-time KITAS Promotions Available"}</li>
      </ul>
    </div>
  );
};

export default DiscountCard;
