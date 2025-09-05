import React from 'react';

import { UserDTO, ProjectPayloadDTO } from '../../../shared/types/sharedTypes';
import ProjectViewer from '../DataViews/ProjectViewer';
import TaskViewer from '../DataViews/TaskViewer';

import './Dashboard.css';

interface DashboardProps {
    user?: UserDTO | null;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
    if (!user) {
        return (
            <div>
                Welcome to TaskBask!  Please <a href="/login">log in</a> to access your dashboard.
            </div>
        );
    }

    const [selectedProjectPayload, setSelectedProjectId] = React.useState<ProjectPayloadDTO | null>(null);

    return (
            <div className="dashboard-flex">
                <ProjectViewer onProjectSelect={setSelectedProjectId} selectedProjectId={selectedProjectPayload ? selectedProjectPayload.project.id : null} />
                {/* <br/> */}
                <TaskViewer selectedProjectPayloadDTO={selectedProjectPayload} />
            </div>
    );

};



export default Dashboard;