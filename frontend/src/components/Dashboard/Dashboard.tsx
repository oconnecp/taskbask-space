import React from 'react';

import { UserResponse } from '../../../shared/types/SharedTypes';
import { getUser } from '../../services/UserService';

interface DashboardProps {
    user?: UserResponse | null;
}

const Dashboard: React.FC<DashboardProps> = ({user}) => {
    if (!user) {
        return (
            <div>
                Welcome to TaskBask!  Please <a href="/login">log in</a> to access your dashboard.
            </div>
        );
    }

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome, {user.name}!</p>
            <p>Your email: {user.email}</p>
        </div>
    );

};



export default Dashboard;