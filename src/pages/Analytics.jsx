import React, { useState, useEffect } from 'react';
import visitService from '../services/visitService';
import customerService from '../services/customerService';
import userService from '../services/userService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const VisitDashboard = () => {
  const [visits, setVisits] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const visitData = await visitService.list('-created_date', 500);
        const customerData = await customerService.list();
        const userData = await userService.list();
        setVisits(visitData);
        setCustomers(customerData);
        setUsers(userData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Visit Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-100 p-4 rounded">
              <h3 className="font-semibold">Total Visits</h3>
              <p className="text-2xl">{visits.length}</p>
            </div>
            <div className="bg-green-100 p-4 rounded">
              <h3 className="font-semibold">Total Customers</h3>
              <p className="text-2xl">{customers.length}</p>
            </div>
            <div className="bg-purple-100 p-4 rounded">
              <h3 className="font-semibold">Total Users</h3>
              <p className="text-2xl">{users.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VisitDashboard;