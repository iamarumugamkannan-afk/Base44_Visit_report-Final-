import React, { useState, useEffect } from "react";
import visitService from "../services/visitService";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Dashboard() {
  const [visits, setVisits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const visitsData = await visitService.list("-created_date", 100);
      setVisits(visitsData);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      {user && <p>Welcome, {user.name}!</p>}
      <div>
        <h2>Recent Visits</h2>
        {visits.length === 0 ? (
          <p>No visits found.</p>
        ) : (
          <ul>
            {visits.map((visit) => (
              <li key={visit.id}>
                <Link to={createPageUrl(`/visits/${visit.id}`)}>
                  {visit.shop_name} - {new Date(visit.created_date).toLocaleDateString()}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}