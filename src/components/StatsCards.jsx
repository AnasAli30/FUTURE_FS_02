import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faEnvelopeOpenText,
  faComments,
  faCircleCheck,
  faChartLine,
} from "@fortawesome/free-solid-svg-icons";

export default function StatsCards({ stats }) {
  const cards = [
    {
      title: "Total Leads",
      value: stats.total || 0,
      sub: "All pipeline inquiries",
      icon: faUsers,
      color: "blue",
    },
    {
      title: "New Inbound",
      value: stats.new || 0,
      sub: "Needs initial review",
      icon: faEnvelopeOpenText,
      color: "sky",
    },
    {
      title: "In Discussion",
      value: (stats.contacted || 0) + (stats.inDiscussion || 0),
      sub: `${stats.contacted || 0} contacted · ${stats.inDiscussion || 0} quoting`,
      icon: faComments,
      color: "amber",
    },
    {
      title: "Converted Clients",
      value: stats.converted || 0,
      sub: "Deals won & onboarded",
      icon: faCircleCheck,
      color: "emerald",
    },
    {
      title: "Conversion Rate",
      value: `${stats.conversionRate || 0}%`,
      sub: `${stats.lost || 0} leads marked lost`,
      icon: faChartLine,
      color: "rose",
    },
  ];

  return (
    <div className="stats-grid">
      {cards.map((card, index) => (
        <div className="stat-card" key={index}>
          <div className="stat-info">
            <h3>{card.title}</h3>
            <div className="stat-number">{card.value}</div>
            <div className="stat-sub">{card.sub}</div>
          </div>
          <div className={`stat-icon-wrapper ${card.color}`}>
            <FontAwesomeIcon icon={card.icon} />
          </div>
        </div>
      ))}
    </div>
  );
}
